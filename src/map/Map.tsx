import Leaflet, { type StyleFunction } from "leaflet"
import { useEffect, useState } from "react"
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"
import type {
    BarangayFeature,
    BarangayGeoJSON,
    ClusterFeature,
} from "../types/map"
import type { MapReport } from "../types/reports"

interface MapProps {
    clusters?: ClusterFeature[]
    selectedBarangay: BarangayFeature | null
    barangays: BarangayGeoJSON
    reports?: MapReport[]
    OnMoveEnd?: (map: Leaflet.Map) => void | undefined
}

export default function Map({
    barangays,
    clusters,
    selectedBarangay,
    OnMoveEnd,
}: MapProps) {
    const geoJsonStyle: StyleFunction<BarangayFeature["properties"]> = (
        feature
    ) => {
        const isSelected =
            selectedBarangay?.properties.Brgy_id === feature?.properties.Brgy_id

        return {
            color: isSelected ? "#e53e3e" : "#3182ce",
            weight: isSelected ? 2 : 0.75,
            fillOpacity: isSelected ? 0.4 : 0.2,
        }
    }

    const onEachFeature = (feature: BarangayFeature, layer: L.Layer) => {
        layer.on("click", () => {
            console.log("...")
        })
    }

    return (
        <MapContainer
            center={[6.74972, 125.35722]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100vw" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <GeoJSON
                data={barangays}
                onEachFeature={onEachFeature}
                style={geoJsonStyle}
            />
            <FitBoundsToGeoJSON geojson={barangays} />
            <MapEvents onMoveEnd={OnMoveEnd} />
            {selectedBarangay && <ZoomToBarangay feature={selectedBarangay} />}
            {/* {renderReportMarkers(reports)} */}
            <ClusterLayer clusters={clusters ?? []} />
        </MapContainer>
    )
}

function ZoomToBarangay({ feature }: { feature: BarangayFeature }) {
    const map = useMap()

    useEffect(() => {
        const layer = Leaflet.geoJSON(feature)
        map.fitBounds(layer.getBounds(), {
            padding: [20, 20],
            animate: true,
            duration: 0.8,
            easeLinearity: 0.25,
        })
    }, [feature, map])

    return null
}

function FitBoundsToGeoJSON({
    geojson,
}: {
    geojson: GeoJSON.FeatureCollection
}) {
    const map = useMap()

    useEffect(() => {
        const layer = Leaflet.geoJSON(geojson)
        map.fitBounds(layer.getBounds(), { padding: [5, 5] })
    }, [geojson, map])

    return null
}

interface MapEventsProps {
    onClick?: (latlng: Leaflet.LatLng) => void
    onMoveEnd?: (map: Leaflet.Map) => void
    onZoomEnd?: (zoom: number, map: Leaflet.Map) => void
}

export function MapEvents({ onClick, onMoveEnd, onZoomEnd }: MapEventsProps) {
    const map = useMapEvents({
        click: (e) => onClick?.(e.latlng),
        moveend: () => onMoveEnd?.(map),
        zoomend: () => onZoomEnd?.(map.getZoom(), map),
    })

    return null
}

interface ClusterLayerProps {
    clusters: ClusterFeature[]
    onClusterClick?: (clusterId: number, coordinates: [number, number]) => void
}

function getFeatureKey(feature: ClusterFeature) {
    if (feature.properties.cluster) {
        const [lng, lat] = feature.geometry.coordinates

        return `cluster-${lat.toFixed(5)}-${lng.toFixed(5)}`
    } else {
        return `report-${feature.properties.id}`
    }
}

function createClusterIcon(count: number) {
    return Leaflet.divIcon({
        html: `<div class="cluster-marker">${count}</div>`,
        className: "custom-cluster-icon",
        iconSize: [40, 40],
    })
}

function getLogPadding(zoom: number): number {
    return Math.min(1.2, Math.max(0.2, 1.5 - zoom * 0.04))
}

export function ClusterLayer({ clusters, onClusterClick }: ClusterLayerProps) {
    const map = useMap()
    const bounds = map.getBounds()
    const padding = getLogPadding(map.getZoom())
    console.log("🚀 ~ ClusterLayer ~ map.getZoom():", map.getZoom())
    console.log("🚀 ~ ClusterLayer ~ padding:", padding)
    const paddedBounds = bounds.pad(padding)

    const [markerCache, setMarkerCache] = useState<ClusterFeature[]>([])
    const [lastZoom, setLastZoom] = useState(map.getZoom())

    const clusterCount = clusters.filter((f) => f.properties.cluster).length
    const pointCount = clusters.length - clusterCount

    console.log("📦 Received clusters:", clusters.length)
    console.log("🔵 Cluster circles:", clusterCount)
    console.log("📍 Individual report points:", pointCount)
    console.log("🧠 Cached markers total:", markerCache.length)

    useEffect(() => {
        const currentZoom = map.getZoom()

        setMarkerCache((prevMarkers) => {
            if (lastZoom !== currentZoom) {
                setLastZoom(currentZoom)

                return clusters
            }

            const prevIds = new Set(
                prevMarkers.map((prevMarker) => getFeatureKey(prevMarker))
            )

            const retainedClusters = prevMarkers.filter((prevMarker) => {
                const [lng, lat] = prevMarker.geometry.coordinates

                return paddedBounds.contains([lat, lng])
            })

            const newClusters = clusters.filter((cluster) => {
                const key = getFeatureKey(cluster)

                return !prevIds.has(key)
            })

            return [...retainedClusters, ...newClusters]
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusters, map])

    return (
        <>
            {markerCache.map((feature) => {
                const [lng, lat] = feature.geometry.coordinates
                const clusterId = `cluster-${lat.toFixed(5)}-${lng.toFixed(5)}`

                const isClusterType = feature.properties.cluster

                if (isClusterType) {
                    const { cluster_id, point_count } = feature.properties

                    return (
                        <Marker
                            key={clusterId}
                            position={[lat, lng]}
                            icon={createClusterIcon(point_count)}
                            eventHandlers={{
                                click: () => {
                                    map.setView([lat, lng], map.getZoom() + 2)
                                    onClusterClick?.(cluster_id, [lng, lat])
                                },
                            }}
                        >
                            <Popup>{point_count} reports</Popup>
                        </Marker>
                    )
                } else {
                    const { id, type } = feature.properties
                    const markerId = `report-${id}`

                    return (
                        <Marker
                            key={markerId}
                            position={[lat, lng]}
                            opacity={1}
                        >
                            <Popup>
                                <strong>Type:</strong> {type}
                            </Popup>
                        </Marker>
                    )
                }
            })}
        </>
    )
}

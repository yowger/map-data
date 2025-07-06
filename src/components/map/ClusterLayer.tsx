import Leaflet from "leaflet"
import { useEffect, useState } from "react"
import { useMap, Marker, Popup } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import type { ClusterFeature } from "../../types/map"

interface ClusterLayerProps {
    clusters: ClusterFeature[]
    onClusterClick?: (clusterId: number, coordinates: [number, number]) => void
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
            let prevMarkersCopy = prevMarkers

            if (lastZoom !== currentZoom) {
                setLastZoom(currentZoom)

                // flickers when zoomed, not big problem, fix later. for now reset markers to keep data fresh.
                prevMarkersCopy = []
            }

            const prevIds = new Set(
                prevMarkersCopy.map((prevMarker) => getFeatureKey(prevMarker))
            )

            const retainedClusters = prevMarkersCopy.filter((prevMarker) => {
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
                    const markerStyle =
                        markerStyles[type] || markerStyles["Other"]

                    return (
                        <Marker
                            key={markerId}
                            position={[lat, lng]}
                            opacity={1}
                            icon={customMarker(
                                markerStyle.icon,
                                markerStyle.color
                            )}
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

const markerStyles: Record<string, { icon: string; color: string }> = {
    Flood: { icon: "fas fa-water", color: "#2563eb" },
    Landslide: { icon: "fas fa-mountain", color: "#F54900" },
    Garbage: { icon: "fas fa-trash", color: "#009966" },
    "Road Damage": { icon: "fas fa-road", color: "#57534D" },
    "Blocked Drainage": { icon: "fas fa-tint-slash", color: "#155DFC" },
    "Power Outage": { icon: "fas fa-bolt", color: "#D08700" },
    "Missing Person": { icon: "fas fa-user-slash", color: "#E7000B" },
    "Missing Animal": { icon: "fas fa-dog", color: "#92400e" },
    "Missing Vehicle": { icon: "fas fa-car-side", color: "#0084D1" },
    "Missing Object": { icon: "fas fa-box-open", color: "#45556C" },
    Other: { icon: "fas fa-question-circle", color: "#525252" },
}

function customMarker(iconClass: string, bgColor = "#3b82f6") {
    return Leaflet.divIcon({
        html: `
        <div class="custom-marker">
          <div class="icon-circle" style="--marker-color: ${bgColor};">
            <i class="${iconClass} icon"></i>
          </div>
              <div class="marker-arrow" ></div>
        </div>
      `,
        className: "",
        iconSize: [40, 52],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40],
        shadowSize: [5, 5],
        shadowAnchor: [10, 10],
    })
}

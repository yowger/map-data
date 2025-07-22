import Leaflet, { type StyleFunction } from "leaflet"
import { useEffect, useRef } from "react"
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap,
    useMapEvents,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"
import { ClusterLayer } from "../components/map/ClusterLayer"
import { ZoomToBarangay } from "../components/map/ZoomToBarangay"
import type {
    BarangayFeature,
    BarangayGeoJSON,
    ClusterFeature,
} from "../types/map"

interface MapProps {
    clusters?: ClusterFeature[]
    selectedBarangay: BarangayFeature | null
    barangays: BarangayGeoJSON
    OnMoveEnd?: (map: Leaflet.Map) => void
    OnReady?: (map: Leaflet.Map) => void
}

export default function Map({
    barangays,
    clusters,
    selectedBarangay,
    OnReady,
    OnMoveEnd,
}: MapProps) {
    const geoJsonStyle: StyleFunction<BarangayFeature["properties"]> = (
        feature
    ) => {
        const isSelected =
            selectedBarangay?.properties.Brgy_id === feature?.properties.Brgy_id

        return {
            color: "#3182ce",
            weight: 0.75,
            fill: isSelected ? true : false,
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
                key={selectedBarangay?.properties.Brgy_id}
            />
            <FitBoundsToGeoJSON geojson={barangays} />
            <MapEvents onMoveEnd={OnMoveEnd} />
            {selectedBarangay && <ZoomToBarangay feature={selectedBarangay} />}
            <ClusterLayer clusters={clusters ?? []} />
            <MapReady onReady={OnReady} />
        </MapContainer>
    )
}

function MapReady({ onReady }: { onReady?: (map: Leaflet.Map) => void }) {
    const map = useMap()
    const hasFiredRef = useRef(false)

    useEffect(() => {
        if (!onReady || hasFiredRef.current) return

        map.whenReady(() => {
            if (!hasFiredRef.current) {
                onReady(map)
                hasFiredRef.current = true
            }
        })
    }, [map, onReady])

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

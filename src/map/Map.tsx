import Leaflet, { type StyleFunction } from "leaflet"
import { useEffect } from "react"
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import type { BarangayFeature, BarangayGeoJSON } from "../types/map"

interface MapProps {
    selectedBarangay: BarangayFeature | null
    barangays: BarangayGeoJSON
}

export default function Map({ barangays, selectedBarangay }: MapProps) {
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

            <>
                <GeoJSON
                    data={barangays}
                    onEachFeature={onEachFeature}
                    style={geoJsonStyle}
                />
                <FitBoundsToGeoJSON geojson={barangays} />
                {selectedBarangay && (
                    <ZoomToBarangay feature={selectedBarangay} />
                )}
            </>
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

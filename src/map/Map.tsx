import Leaflet from "leaflet"
import { useEffect } from "react"
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import { useGetBarangayGeoData } from "../api/useGetBarangayGeoData"

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

export default function Map() {
    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    const geoJsonStyle = () => ({
        color: "#3182ce",
        weight: 0.75,
        fillOpacity: 0.2,
    })

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
            {!barangaysLoading && !barangaysError && barangays && (
                <>
                    <GeoJSON data={barangays} style={geoJsonStyle} />
                    <FitBoundsToGeoJSON geojson={barangays} />
                </>
            )}
        </MapContainer>
    )
}

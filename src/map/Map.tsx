import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import { useGetBarangayGeoData } from "../api/useGetBarangayGeoData"

export default function Map() {
    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()


    return (
        <MapContainer
            center={[ 6.74972000, 125.35722000]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100vw" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!barangaysLoading && !barangaysError && barangays && (
                <GeoJSON data={barangays} />
            )}
        </MapContainer>
    )
}

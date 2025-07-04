import Leaflet, { type StyleFunction } from "leaflet"
import { useEffect } from "react"
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
import type { BarangayFeature, BarangayGeoJSON } from "../types/map"
import type { MapReport } from "../types/reports"

interface MapProps {
    selectedBarangay: BarangayFeature | null
    barangays: BarangayGeoJSON
    reports: MapReport[]
    OnMoveEnd?: (map: Leaflet.Map) => void | undefined
}

export default function Map({
    barangays,
    reports,
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
            {renderReportMarkers(reports)}
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

function renderReportMarkers(reports: MapReport[]) {
    return reports?.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]}>
            <Popup>
                <div className="text-sm space-y-1">
                    <p className="font-medium">
                        {report.type.replace("_", " ").toUpperCase()}
                    </p>
                    <p>{report.message}</p>
                    <p className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                    </p>
                    {report.verified && (
                        <p className="text-green-600 text-xs font-semibold">
                            ✔ Verified
                        </p>
                    )}
                    {report.imageUrls && (
                        <img
                            src={report.imageUrls[0]}
                            alt={report.type}
                            className="mt-2 w-full h-24 object-cover rounded"
                        />
                    )}
                </div>
            </Popup>
        </Marker>
    ))
}

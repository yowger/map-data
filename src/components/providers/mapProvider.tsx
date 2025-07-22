import type { Map } from "leaflet"
import { useRef } from "react"

import { MapContext } from "../../store/mapContext"

export function MapProvider({ children }: { children: React.ReactNode }) {
    const mapRef = useRef<Map | null>(null)

    return <MapContext value={mapRef}>{children}</MapContext>
}

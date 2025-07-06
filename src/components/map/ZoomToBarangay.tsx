import Leaflet from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

import type { BarangayFeature } from "../../types/map"

export function ZoomToBarangay({ feature }: { feature: BarangayFeature }) {
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

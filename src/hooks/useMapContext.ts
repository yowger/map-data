import { use } from "react"

import { MapContext } from "../store/mapContext"

export function useMapRefContext() {
    const context = use(MapContext)

    if (!context) throw new Error("useMapRef must be used within MapProvider")
    return context
}

import { createContext, type RefObject } from "react"
import type { Map } from "leaflet"

export const MapContext = createContext<RefObject<Map | null> | null>(null)

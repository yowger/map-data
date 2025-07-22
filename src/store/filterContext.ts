import { createContext } from "react"
import type { DateRange } from "react-day-picker"

export type FilterContextType = {
    range: DateRange | undefined
    setRange: (r: DateRange | undefined) => void
    selectedEvents: string[]
    setSelectedEvents: (e: string[]) => void
    selectedStatuses: string[]
    setSelectedStatuses: (s: string[]) => void
    selectedBarangayIds: string[]
    setSelectedBarangayIds: (b: string[]) => void
}

export const FilterContext = createContext<FilterContextType | null>(null)

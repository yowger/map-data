import  { createContext } from "react"

export type DateRange = { from: Date | null; to: Date | null }

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

export const FilterContext = createContext<FilterContextType | undefined>(
    undefined
)

import { useState } from "react"
import {
    FilterContext,
    type DateRange,
    type FilterContextType,
} from "./filterContext"

export default function FilterProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [range, setRange] = useState<DateRange | undefined>()
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [selectedBarangayIds, setSelectedBarangayIds] = useState<string[]>([])

    const context: FilterContextType = {
        range,
        setRange,
        selectedEvents,
        setSelectedEvents,
        selectedStatuses,
        setSelectedStatuses,
        selectedBarangayIds,
        setSelectedBarangayIds,
    }

    return (
        <FilterContext.Provider value={context}>
            {children}
        </FilterContext.Provider>
    )
}

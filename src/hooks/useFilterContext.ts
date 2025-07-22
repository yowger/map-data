import { use } from "react"
import { FilterContext } from "../store/filterContext"

export function useFilterContext() {
    const context = use(FilterContext)

    if (!context) {
        throw new Error("useFilterContext must be used within FilterProvider")
    }
    return context
}

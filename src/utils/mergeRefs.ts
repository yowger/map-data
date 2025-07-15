import type { Ref } from "react"

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
    return (element: T | null) => {
        for (const ref of refs) {
            if (typeof ref === "function") {
                ref(element)
            } else if (ref && typeof ref === "object") {
                ref.current = element
            }
        }
    }
}

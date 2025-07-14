import { useRef, useEffect, useCallback, type RefObject } from "react"

const FOCUSABLE_QUERY =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap<T extends HTMLElement = HTMLElement>(): {
    containerRef: RefObject<T | null>
} {
    const containerRef = useRef<T>(null)

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const isTabKey = event.key === "Tab"
        const container = containerRef.current

        if (!isTabKey || !container) return

        const focusableElements = Array.from(
            container.querySelectorAll<T>(FOCUSABLE_QUERY)
        ).filter((el) => !el.hasAttribute("disabled"))

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault()
                lastElement?.focus()
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault()
                firstElement?.focus()
            }
        }
    }, [])

    useEffect(() => {
        const container = containerRef.current

        if (!container) return

        const focusableElements = container.querySelectorAll<T>(FOCUSABLE_QUERY)

        focusableElements[0]?.focus()

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    return {
        containerRef,
    }
}

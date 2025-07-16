import { useEffect } from "react"

interface UseOnClickOutsideProps<T extends HTMLElement> {
    ref: React.RefObject<T | null>
    isEnabled: boolean
    onClickOutside: () => void
}

export function useOnClickOutside<T extends HTMLElement>({
    ref,
    isEnabled,
    onClickOutside,
}: UseOnClickOutsideProps<T>): void {
    useEffect(() => {
        if (!isEnabled) return

        function handleClickOutside(event: MouseEvent) {
            const element = ref.current
            const hasClickedElement = element?.contains(event.target as Node)

            if (!hasClickedElement) {
                onClickOutside()
            }
        }

        if (isEnabled) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref, isEnabled, onClickOutside])
}

import { useEffect, type RefObject } from "react"

interface UseOnClickOutsideProps<T extends HTMLElement> {
    ref: React.RefObject<T | null>
    isEnabled?: boolean
    excludeRef?: RefObject<HTMLElement>
    onClickOutside: () => void
}

export function useOnClickOutside<T extends HTMLElement>({
    ref,
    isEnabled,
    onClickOutside,
    excludeRef,
}: UseOnClickOutsideProps<T>) {
    useEffect(() => {
        if (!isEnabled) return

        function handleClickOutside(event: MouseEvent) {
            const element = ref.current
            const excludedElement = excludeRef?.current

            if (
                element &&
                !element.contains(event.target as Node) &&
                !(
                    excludedElement &&
                    excludedElement.contains(event.target as Node)
                )
            ) {
                onClickOutside()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref, onClickOutside, isEnabled, excludeRef])
}

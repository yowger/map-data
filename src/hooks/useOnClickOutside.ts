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
}: UseOnClickOutsideProps<T>) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
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

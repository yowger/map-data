import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"

type Props = {
    children: ReactNode
    className?: string
}

export default function XScrollWrapper({
    children,
    className = "",
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const updateScrollButtons = useCallback(() => {
        const el = containerRef.current
        if (!el) return

        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
    }, [])

    useEffect(() => {
        const element = containerRef.current

        if (!element) return

        updateScrollButtons()
        element.addEventListener("scroll", updateScrollButtons)
        window.addEventListener("resize", updateScrollButtons)

        return () => {
            element.removeEventListener("scroll", updateScrollButtons)
            window.removeEventListener("resize", updateScrollButtons)
        }
    }, [updateScrollButtons])

    const scrollBy = (offset: number) => {
        console.log("scrolls")
        containerRef.current?.scrollBy({ left: offset, behavior: "smooth" })
    }

    return (
        <div className="relative">
            {canScrollLeft && (
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-full absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md cursor-pointer"
                    onClick={() => scrollBy(-150)}
                >
                    <i className="fas fa-chevron-left text-gray-500" />
                </button>
            )}

            {canScrollRight && (
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-full absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md cursor-pointer"
                    onClick={() => scrollBy(150)}
                >
                    <i className="fas fa-chevron-right text-gray-500" />
                </button>
            )}

            <div className={`relative px-4`}>
                <div
                    ref={containerRef}
                    className={`no-scrollbar overflow-x-auto whitespace-nowrap flex gap-2 py-2 ${className}`}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

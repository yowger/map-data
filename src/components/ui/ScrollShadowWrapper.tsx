import {
    useRef,
    useState,
    useCallback,
    type ReactNode,
    type UIEvent,
} from "react"

type ScrollShadowWrapperProps = {
    children: ReactNode
    className?: string
    style?: React.CSSProperties
}

export function ScrollShadowWrapper({
    children,
    className = "",
    style = {},
}: ScrollShadowWrapperProps) {
    const [scrollTop, setScrollTop] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(0)
    const [clientHeight, setClientHeight] = useState(0)

    const wrapperRef = useRef<HTMLDivElement>(null)

    const onScrollHandler = useCallback((event: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget

        setScrollTop(scrollTop)
        setScrollHeight(scrollHeight)
        setClientHeight(clientHeight)
    }, [])

    const getVisibleSides = useCallback(() => {
        const threshold = 2
        const isAtTop = scrollTop <= threshold
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold

        return {
            top: !isAtTop,
            bottom: !isAtBottom,
        }
    }, [scrollTop, scrollHeight, clientHeight])

    const { top, bottom } = getVisibleSides()

    return (
        <div
            ref={wrapperRef}
            style={style}
            className={`relative overflow-auto ${className}`}
            onScroll={onScrollHandler}
        >
            <div
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.12), transparent)",
                }}
                className={`sticky top-0 h-3.5 -mb-3.5 w-full transition-opacity duration-300 ${
                    top ? "opacity-100" : "opacity-0"
                }`}
            />

            {children}

            <div
                style={{
                    background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.08), transparent)",
                }}
                className={`sticky bottom-0 h-3.5 -mt-3.5 w-full transition-opacity duration-300 ${
                    bottom ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    )
}

export default ScrollShadowWrapper

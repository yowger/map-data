type ChevronProps = {
    className?: string
}

export function LeftChevron({
    className = "w-3.5 h-3.5 fill-gray-500",
}: ChevronProps) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24">
            <polygon points="16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" />
        </svg>
    )
}

export function RightChevron({
    className = "w-3.5 h-3.5 fill-gray-500",
}: ChevronProps) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24">
            <polygon points="8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" />
        </svg>
    )
}

export function UpChevron({
    className = "w-3.5 h-3.5 fill-gray-500",
}: ChevronProps) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24">
            <polygon points="6 14.1888889 12 8 18 14.1888889 16.0888889 16.1 12 12.0111111 7.91111111 16.1" />
        </svg>
    )
}

export function DownChevron({
    className = "w-3.5 h-3.5 fill-gray-500",
}: ChevronProps) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24">
            <polygon points="6 9.81111111 12 15.9111111 18 9.81111111 16.0888889 7.9 12 11.9888889 7.91111111 7.9" />
        </svg>
    )
}

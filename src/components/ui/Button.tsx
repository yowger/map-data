import type { ReactNode } from "react"

type IconButtonProps = {
    value?: string
    icon?: ReactNode
    onClick?: () => void
    className?: string
    textClassName?: string
}

export default function Button({
    value,
    icon,
    onClick,
    className = "",
    textClassName = "",
}: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md text-gray-700 cursor-pointer w-full hover:bg-gray-100 ${className}`}
        >
            <span className={`${textClassName}`}>{value}</span>

            {icon && icon}
        </button>
    )
}

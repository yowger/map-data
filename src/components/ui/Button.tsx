import { forwardRef } from "react"
import type { ReactNode, ComponentPropsWithoutRef } from "react"

type ButtonProps = {
    value?: string
    icon?: ReactNode
    textClassName?: string
} & ComponentPropsWithoutRef<"button">

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ value, icon, className = "", textClassName = "", ...rest }, ref) => {
        return (
            <button
                ref={ref}
                {...rest}
                className={`flex items-center justify-between px-3 py-2 border border-gray-400 rounded-md text-gray-700 cursor-pointer w-full hover:bg-gray-100 ${className}`}
            >
                <span className={textClassName}>{value}</span>
                {icon}
            </button>
        )
    }
)

export default Button

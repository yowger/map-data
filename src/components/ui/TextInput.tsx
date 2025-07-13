import type { ReactNode } from "react"

type TextInputProps = {
    icon?: ReactNode
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    wrapperClassName?: string
    inputClassName?: string
    type?: string
}

export default function TextInput(props: TextInputProps) {
    const { icon, inputClassName, wrapperClassName, ...inputProps } = props

    return (
        <div className={`relative ${wrapperClassName}`}>
            {icon && (
                <div className="absolute inset-y-0 start-0 flex items-center ps-2">
                    {icon}
                </div>
            )}

            <input
                {...inputProps}
                className={`w-full ${
                    icon ? "ps-8" : "ps-3"
                } text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:ring-1 focus:border-blue-500 outline-0 ${inputClassName}`}
            />
        </div>
    )
}

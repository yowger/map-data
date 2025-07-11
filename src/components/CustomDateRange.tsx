import clsx from "clsx"
import { useState } from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { enUS } from "date-fns/locale"

export default function CustomDateRange() {
    const [selected, setSelected] = useState<Date>()
    const defaultClassNames = getDefaultClassNames()

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium mb-1 border p-2 rounded-md">
                {selected
                    ? `Selected: ${selected.toLocaleDateString()}`
                    : "Pick a day."}
            </label>

            <DayPicker
                captionLayout="dropdown"
                mode="single"
                selected={selected}
                onSelect={setSelected}
                showOutsideDays
                locale={enUS}
                formatters={{
                    formatWeekdayName: (date) => {
                        return date.toLocaleDateString("en-US", {
                            weekday: "narrow",
                        })
                    },
                }}
                classNames={{
                    root: `${defaultClassNames.root} rounded p-2 absolute z-50 bg-white shadow-md`,
                    weekday: "font-normal text-gray-400",
                    selected: `text-white`,
                    day: `group w-10 h-10`,
                    outside: `text-gray-400`,
                    disabled: `text-gray-500`,
                    today: "font-semibold",
                    chevron: `w-4 h-4`,
                }}
                components={{
                    DayButton: (props) => {
                        const { day, ...buttonProps } = props
                        const isSelected =
                            selected &&
                            day.date.toDateString() === selected.toDateString()

                        return (
                            <button
                                {...buttonProps}
                                className="cursor-pointer p-0 w-full h-full"
                                onClick={() => setSelected(day.date)}
                            >
                                <div
                                    className={clsx(
                                        "flex items-center justify-center w-full aspect-square",
                                        "rounded-full",
                                        isSelected
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-200"
                                    )}
                                >
                                    {day.date.getDate()}
                                </div>
                            </button>
                        )
                    },
                    Dropdown: ({ options, value, ...props }) => {
                        console.log("props: ", props)

                        return (
                            <select value={value}>
                                {options?.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )
                        // return (
                        //     <select
                        //         value={value}
                        //         onChange={(e) =>
                        //             onChange(Number(e.target.value))
                        //         }
                        //         className="border px-2 py-1 rounded bg-white text-sm"
                        //         {...props}
                        //     >
                        //         {children}
                        //     </select>
                        // )
                    },
                }}
            />
        </div>
    )
}

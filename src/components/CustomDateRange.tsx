import clsx from "clsx"
import { Children, useState } from "react"
import { DayPicker, getDefaultClassNames, useDayPicker } from "react-day-picker"
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
                    nav: "hidden",
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
                    Dropdown: ({ options, onChange, value }) => {
                        return (
                            <select
                                className="w-full text-gray-500 text-base py-2 outline-0 flex pr-1"
                                value={value?.toString()}
                                onChange={(e) => onChange?.(e)}
                            >
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
                    },
                    DropdownNav: ({ children }) => {
                        const childrenArray = Children.toArray(children)

                        const { nextMonth, previousMonth, goToMonth } =
                            useDayPicker()

                        const yearDropDown = childrenArray[0]
                        const monthDropDown = childrenArray[1]

                        return (
                            <div className="flex w-full gap-2 items-center">
                                <div className="">{yearDropDown ?? null}</div>

                                <div className="">{monthDropDown ?? null}</div>

                                <div className="flex items-center ml-auto">
                                    <button
                                        onClick={() =>
                                            previousMonth &&
                                            goToMonth(previousMonth)
                                        }
                                        disabled={!previousMonth}
                                        className="rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 p-1.5"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5 fill-gray-500"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <polygon points="16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20"></polygon>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() =>
                                            nextMonth && goToMonth(nextMonth)
                                        }
                                        disabled={!nextMonth}
                                        className="rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 p-1.5"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5 fill-gray-500"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <polygon points="8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20"></polygon>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )
                    },
                }}
            />
        </div>
    )
}

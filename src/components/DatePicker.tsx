import clsx from "clsx"
import { Children } from "react"
import {
    DayPicker,
    getDefaultClassNames,
    useDayPicker,
    type PropsRange,
    type PropsSingle,
} from "react-day-picker"
import { enUS } from "date-fns/locale"

export type DatePickerProps = PropsSingle | PropsRange

export default function DatePicker(props: DatePickerProps) {
    const defaultClassNames = getDefaultClassNames()

    return (
        <DayPicker
            {...props}
            captionLayout="dropdown"
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
                day: `group w-9 h-9`,
                outside: `text-gray-400`,
                disabled: `text-gray-500`,
                today: "font-semibold",
                nav: "hidden",
            }}
            components={{
                DayButton: (dayProps) => {
                    const { day, ...buttonProps } = dayProps

                    let isSelected = false

                    if (props.selected instanceof Date) {
                        isSelected =
                            day.date.toDateString() ===
                            props.selected.toDateString()
                    } else if (
                        props.selected &&
                        "from" in props.selected &&
                        "to" in props.selected
                    ) {
                        const { from, to } = props.selected
                        isSelected =
                            from !== undefined &&
                            to !== undefined &&
                            day.date >= from &&
                            day.date <= to
                    }

                    return (
                        <button
                            {...buttonProps}
                            className="cursor-pointer p-0 w-full h-full"
                            onClick={(e) => {
                                const modifiers = dayProps.modifiers ?? {}

                                if (props.mode === "single") {
                                    props.onSelect?.(
                                        dayProps.day.date,
                                        dayProps.day.date,
                                        modifiers,
                                        e
                                    )
                                } else if (props.mode === "range") {
                                    props.onSelect?.(
                                        {
                                            from: dayProps.day.date,
                                            to: dayProps.day.date,
                                        },
                                        dayProps.day.date,
                                        modifiers,
                                        e
                                    )
                                }
                            }}
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
                        <div className="flex w-full gap-2 items-center mb-1">
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
    )
}

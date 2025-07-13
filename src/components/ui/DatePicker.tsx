import { Children } from "react"
import {
    DayPicker,
    getDefaultClassNames,
    useDayPicker,
    type PropsRange,
    type PropsSingle,
} from "react-day-picker"
import { enUS } from "date-fns/locale"

import { LeftChevron, RightChevron } from "./Chevrons"

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
                formatMonthDropdown: (month) =>
                    month.toLocaleDateString("en-US", {
                        month: "short",
                    }),
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
                    const { day, modifiers, ...buttonProps } = dayProps
                    const { mode, selected } = props

                    const isStart = modifiers.range_start
                    const isEnd = modifiers.range_end
                    const isMiddle = modifiers.range_middle
                    const isSelected = modifiers.selected ?? false

                    const hasRange =
                        mode === "range" &&
                        selected &&
                        "from" in selected &&
                        "to" in selected
                    const isSameDate =
                        hasRange &&
                        selected.from instanceof Date &&
                        selected.to instanceof Date &&
                        selected.from.toDateString() ===
                            selected.to.toDateString()

                    let wrapperClassName = "cursor-pointer p-0 w-full h-full"

                    if (hasRange && !isSameDate && isStart) {
                        wrapperClassName += " bg-blue-100 rounded-s-full"
                    } else if (hasRange && !isSameDate && isEnd) {
                        wrapperClassName += " bg-blue-100 rounded-e-full"
                    }

                    let dayClassNames =
                        "flex items-center justify-center w-full aspect-square"

                    if (isStart) {
                        dayClassNames += " bg-blue-500 text-white rounded-full"
                    } else if (isEnd) {
                        dayClassNames +=
                            " border border-blue-500 text-black rounded-full bg-white"
                    } else if (isMiddle) {
                        dayClassNames += " bg-blue-100 text-black"
                    } else if (isSelected) {
                        dayClassNames += " bg-blue-500 text-white rounded-full"
                    } else {
                        dayClassNames += " hover:bg-gray-100 rounded-full"
                    }

                    return (
                        <button {...buttonProps} className={wrapperClassName}>
                            <div className={dayClassNames}>
                                {day.date.getDate()}
                            </div>
                        </button>
                    )
                },
                Dropdown: ({ options, onSelect, value, onChange }) => {
                    return (
                        <select
                            className="w-full text-gray-500 text-base py-2 outline-0 flex pr-1 cursor-pointer"
                            onChange={onChange}
                            onSelect={onSelect}
                            value={value}
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

                    const yearDropDownComponent = childrenArray[0]
                    const monthDropDownComponent = childrenArray[1]

                    return (
                        <div className="flex w-full gap-2 items-center mb-1">
                            <div>{yearDropDownComponent ?? null}</div>
                            <div>{monthDropDownComponent ?? null}</div>

                            <div className="flex items-center ml-auto">
                                <button
                                    onClick={() =>
                                        previousMonth &&
                                        goToMonth(previousMonth)
                                    }
                                    disabled={!previousMonth}
                                    className="rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 p-1.5"
                                >
                                    <LeftChevron />
                                </button>

                                <button
                                    onClick={() =>
                                        nextMonth && goToMonth(nextMonth)
                                    }
                                    disabled={!nextMonth}
                                    className="rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 p-1.5"
                                >
                                    <RightChevron />
                                </button>
                            </div>
                        </div>
                    )
                },
            }}
        />
    )
}

import clsx from "clsx"
import { useState } from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

export default function CustomDateRange() {
    const [selected, setSelected] = useState<Date>()
    const defaultClassNames = getDefaultClassNames()

    return (
        <div>
            <label className="block text-sm font-medium mb-1 border p-2 rounded-md">
                {selected
                    ? `Selected: ${selected.toLocaleDateString()}`
                    : "Pick a day."}
            </label>

            <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                showOutsideDays
                className="border rounded p-4"
                classNames={{
                    selected: `text-white`,
                    root: `${defaultClassNames.root} shadow-lg p-5`,
                    chevron: `w-4 h-4 fill-amber-700`,
                    day: `group w-10 h-10`,
                    caption_label: `text-base`,
                    disabled: `text-gray-500`,
                }}
                components={{
                    DayButton: (props) => {
                        const { day, ...buttonProps } = props

                        return (
                            <button
                                {...buttonProps}
                                className={clsx(
                                    "cursor-pointer w-7 h-7 m-1  rounded-sm",
                                    day.outside && "text-gray-400",
                                    selected
                                        ? "group-aria-selected:bg-blue-500"
                                        : "hover:bg-gray-200"
                                )}
                                onClick={() => setSelected(day.date)}
                            />
                        )
                    },
                }}
            />
        </div>
    )
}

import { useState } from "react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"

import Button from "../ui/Button"
import DatePicker from "../ui/DatePicker"
import PopOver from "../ui/PopOver"

type Props = {
    range: DateRange | undefined
    onChange?: (range: DateRange | undefined) => void
    onClear?: () => void
    onDone?: () => void
}

const DEFAULT_TEXT = "Select date"

export default function DateRangeSelector({
    range,
    onChange,
    onClear,
    onDone,
}: Props) {
    const [open, setOpen] = useState(false)

    const formattedRange = formatRange(range)

    return (
        <PopOver>
            <PopOver.Trigger>
                <Button
                    value={formattedRange}
                    onClick={() => setOpen(!open)}
                    icon={
                        <i className="fa-solid fa-calendar-day text-gray-400" />
                    }
                    className={open ? "bg-gray-100 rounded-sm" : "rounded-sm "}
                />
            </PopOver.Trigger>
            <PopOver.Content>
                <PopOver.Body>
                    <DatePicker
                        mode="range"
                        selected={range}
                        onSelect={(newRange) => {
                            const from = newRange?.from
                            const to = newRange?.to

                            const isRangeComplete =
                                from &&
                                to &&
                                from instanceof Date &&
                                to instanceof Date &&
                                from.getTime() !== to.getTime()

                            onChange?.(newRange)

                            if (isRangeComplete) {
                                setOpen(false)
                            }
                        }}
                    />
                </PopOver.Body>

                <PopOver.Footer className="flex justify-end gap-2">
                    <button
                        className="text-sm px-2 py-1 cursor-pointer font-medium text-gray-700"
                        onClick={onClear}
                    >
                        Clear
                    </button>

                    <PopOver.Close>
                        <button
                            className="text-sm px-2 py-1 cursor-pointer font-medium text-blue-500"
                            onClick={onDone}
                        >
                            Done
                        </button>
                    </PopOver.Close>
                </PopOver.Footer>
            </PopOver.Content>
        </PopOver>
    )
}

function formatRange(range: DateRange | undefined): string {
    if (!range?.from) {
        return DEFAULT_TEXT
    }

    const from = format(range.from, "MMM d yyyy")
    const to =
        range.to && range.to.getTime() !== range.from.getTime()
            ? format(range.to, "MMM d yyyy")
            : ""

    return `${from}${to ? ` - ${to}` : ""}`
}

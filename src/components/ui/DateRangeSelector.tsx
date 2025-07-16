import { useState } from "react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"

import Button from "./Button"
import DatePicker from "./DatePicker"
import PopOver from "./PopOver"

type Props = {
    range: DateRange | undefined
    onChange?: (range: DateRange | undefined) => void
}

const DEFAULT_TEXT = "Select date"

export default function DateRangeSelector({ range, onChange }: Props) {
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
                    className={open ? "bg-gray-100" : ""}
                />
            </PopOver.Trigger>
            <PopOver.Content>
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

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"
import Button from "./Button"
import DatePicker from "./DatePicker"

type Props = {
    range: DateRange | undefined
    onChange?: (range: DateRange | undefined) => void
}

const DEFAULT_TEXT = "Select date"

export default function DateRangeSelector({ range, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const formattedRange = formatRange(range)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open])

    return (
        <div ref={containerRef} className="relative inline-block w-full">
            <Button
                value={formattedRange}
                onClick={() => setOpen(!open)}
                icon={<i className="fa-solid fa-calendar-day text-gray-400" />}
            />

            {open && (
                <div className="absolute z-50 mt-2 shadow-md">
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
                </div>
            )}
        </div>
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

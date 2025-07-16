import { useState } from "react"
import type { DateRange } from "react-day-picker"

import TextInput from "../components/ui/TextInput"
import DateRangePicker from "../components/ui/DateRangeSelector"
import FilterPopoverButton from "../components/ui/FilterPopOverButton"
import PopOver from "../components/ui/PopOver"

export default function Sidebar() {
    const [range, setRange] = useState<DateRange | undefined>()

    return (
        <div className="w-96 bg-white shadow-md">
            <div className="flex flex-col gap-4 p-4">
                <TextInput icon={searchIcon} placeholder="Search barangay" />

                <DateRangePicker
                    range={range}
                    onChange={(newRange) => {
                        setRange(newRange)
                    }}
                />

                {/* <FilterPopoverButton /> */}
            </div>

            <div className="px-4">
                <PopOver>
                    <PopOver.Trigger>
                        <button className="p-2 border rounded-md text-sm">
                            Click me
                        </button>
                    </PopOver.Trigger>
                    <PopOver.Content>
                        <div className="border p-4">
                            <p>Content</p>
                            <input type="text" className="border rounded-md" />
                        </div>
                    </PopOver.Content>
                </PopOver>
            </div>

            <h2>Barangay List</h2>

            <ul>
                <li>
                    <div>Digos</div>
                </li>
                <li>
                    <div>Aplaya</div>
                </li>
                <li>
                    <div>Digos</div>
                </li>
                <li>
                    <div>Aplaya</div>
                </li>
                <li>
                    <div>Digos</div>
                </li>
                <li>
                    <div>Aplaya</div>
                </li>
            </ul>

            <FilterPopoverButton />
            <div className="px-4 justify-end flex">
                <PopOver>
                    <PopOver.Trigger>
                        <button className="p-2 border rounded-md text-sm">
                            Click me
                        </button>
                    </PopOver.Trigger>
                    <PopOver.Content>
                        <div className="border p-4">
                            <p>Content</p>
                        </div>
                    </PopOver.Content>
                </PopOver>
            </div>
        </div>
    )
}

// filter for
// hazard, status, sort Z-A?

const searchIcon = (
    <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
    </svg>
)

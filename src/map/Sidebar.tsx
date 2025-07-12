import { useState } from "react"
import DatePicker from "../components/DatePicker"
import type { DateRange } from "react-day-picker"

export default function Sidebar() {
    const [range, setRange] = useState<DateRange>()

    return (
        <div className="w-96 bg-white shadow-md">
            <div className="p-4">
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-2">
                        <svg
                            className="w-4 h-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search barangay"
                        className="w-full ps-8 text-gray-900 border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:ring-1 focus:border-teal-500 outline-0"
                    />
                </div>
            </div>

            <DatePicker
                mode="range"
                selected={range}
                onSelect={setRange}
                min={2}
                max={7}
            />

            <h2>Barangay List</h2>

            <ul>
                <li>
                    <div>Digos</div>
                </li>
                <li>
                    <div>Aplaya</div>
                </li>
            </ul>
        </div>
    )
}

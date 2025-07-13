import { useState } from "react"
import DatePicker from "../components/ui/DatePicker"
import type { DateRange } from "react-day-picker"
import Button from "../components/ui/Button"
import TextInput from "../components/ui/TextInput"

export default function Sidebar() {
    const [range, setRange] = useState<DateRange>()

    return (
        <div className="w-96 bg-white shadow-md">
            <div className="p-4">
                <TextInput icon={searchIcon} placeholder="Search barangay" />
            </div>

            <div className="px-4">
                <Button
                    value="lorem ipsum"
                    icon={
                        <i className="fa-solid fa-calendar-day text-gray-400" />
                    }
                />
            </div>

            <DatePicker mode="range" selected={range} onSelect={setRange} />

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

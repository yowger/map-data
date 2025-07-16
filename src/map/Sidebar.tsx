import { useState } from "react"
import type { DateRange } from "react-day-picker"

import TextInput from "../components/ui/TextInput"
import DateRangePicker from "../components/ui/DateRangeSelector"
import PopOver from "../components/ui/PopOver"
import { EventsFilterDropdown } from "../components/map/EventsFilter"
import { StatusFilterDropdown } from "../components/map/StatusFilter"

const HAZARD_OPTIONS = [
    "Flood",
    "Earthquake",
    "Fire",
    "Landslide",
    "Tsunami",
    "Typhoon",
    "Storm Surge",
    "Volcanic Eruption",
    "Drought",
    "Extreme Heat",
    "Strong Winds",
    "Hailstorm",
    "Pandemic",
    "Tornado",
    "Chemical Spill",
]

const STATUS_OPTIONS = ["Verified", "Unverified", "Spam", "Archived"]

export default function Sidebar() {
    const [range, setRange] = useState<DateRange | undefined>()
    const [selectedHazards, setSelectedHazards] = useState<string[]>([])
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

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
            </div>

            <div className="px-4 flex gap-2">
                <EventsFilterDropdown
                    selected={selectedEvents}
                    onChange={setSelectedEvents}
                    events={HAZARD_OPTIONS}
                    onClear={() => setSelectedEvents([])}
                    onDone={() => {}}
                />

                <StatusFilterDropdown
                    selected={selectedStatuses}
                    onChange={setSelectedStatuses}
                    statuses={STATUS_OPTIONS}
                    onClear={() => setSelectedStatuses([])}
                    onDone={() => console.log("Statuses:", selectedStatuses)}
                />
            </div>

            <h2>Barangay List</h2>

            <div className="px-2">
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

                <PopOver>
                    <PopOver.Trigger>
                        <button className="px-3.5 py-1.5 bg-gray-200 rounded-md text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-300">
                            <span className="mr-1.5">Category</span>
                            <i className="fa-solid fa-caret-down" />
                        </button>
                    </PopOver.Trigger>
                    <PopOver.Content>
                        <div className="py-3 flex flex-col border border-gray-300 rounded-md space-y-4 w-48 shadow-md overflow-auto">
                            <div className="px-4">
                                <div className="flex flex-col gap-1 ">
                                    <div>
                                        {[
                                            "Flood",
                                            "Earthquake",
                                            "Fire",
                                            "Landslide",
                                            "Tsunami",
                                            "Typhoon",
                                            "Storm Surge",
                                            "Volcanic Eruption",
                                            "Drought",
                                            "Extreme Heat",
                                            "Strong Winds",
                                            "Hailstorm",
                                            "Pandemic",
                                            "Tornado",
                                            "Chemical Spill",
                                        ].map((hazard) => (
                                            <label
                                                key={hazard}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={hazard}
                                                    checked={selectedHazards.includes(
                                                        hazard
                                                    )}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value
                                                        setSelectedHazards(
                                                            (prev) =>
                                                                prev.includes(
                                                                    value
                                                                )
                                                                    ? prev.filter(
                                                                          (h) =>
                                                                              h !==
                                                                              value
                                                                      )
                                                                    : [
                                                                          ...prev,
                                                                          value,
                                                                      ]
                                                        )
                                                    }}
                                                />
                                                {hazard}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end px-4">
                                <button className="text-sm px-2 py-1 cursor-pointer font-medium text-gray-700">
                                    Clear
                                </button>
                                <button className="text-sm px-2 py-1 cursor-pointer font-medium text-blue-500">
                                    Done
                                </button>
                            </div>
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

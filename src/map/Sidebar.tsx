import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { useBarangaysWithReports } from "../api/useGetBarangayWithReports"
import TextInput from "../components/ui/TextInput"
import DateRangePicker from "../components/ui/DateRangeSelector"
// import PopOver from "../components/ui/PopOver"
import { EventsFilterDropdown } from "../components/map/EventsFilter"
import { StatusFilterDropdown } from "../components/map/StatusFilter"
import { timeAgo } from "../utils/time"
import { markerStyles } from "../utils/map"

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
    // const [selectedHazards, setSelectedHazards] = useState<string[]>([])
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

    const {
        data: barangays,
        isLoading: barangaysIsLoading,
        error: barangaysIsError,
    } = useBarangaysWithReports()

    return (
        <aside className="w-[27rem] bg-white shadow-lg h-full flex flex-col">
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

            <div className="flex items-center my-4 mx-4">
                <h2 className="text-xl">Results</h2>
            </div>

            <section className="overflow-auto flex-grow">
                {barangaysIsLoading ? (
                    <div className="text-gray-500 text-sm">
                        Loading barangays...
                    </div>
                ) : barangaysIsError ? (
                    <div className="text-red-500 text-sm">
                        Failed to load data.
                    </div>
                ) : barangays?.length === 0 ? (
                    <div className="text-gray-500 text-sm">
                        No results found.
                    </div>
                ) : (
                    <ul className="">
                        {barangays?.map((barangay) => (
                            <li
                                key={barangay.id}
                                className="p-4 hover:bg-gray-50 border-b border-gray-300"
                            >
                                <div className="text-lg font-medium tracking-[.2px] text-gray-800">
                                    {barangay.name}
                                </div>

                                <div className="">
                                    <h3 className="text-gray-700 hover:text-gray-900">
                                        Recent reports
                                    </h3>

                                    {barangay.recentReports
                                        .slice(0, 2)
                                        .map((report, index) => {
                                            const style =
                                                markerStyles[report.type] ||
                                                markerStyles["Other"]

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex gap-3 p-2"
                                                >
                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                style.color,
                                                        }}
                                                        className="size-9 rounded-full flex items-center justify-center"
                                                    >
                                                        <i
                                                            className={`${style.icon} text-white text-sm`}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {report.type}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {timeAgo(
                                                                report.createdAt
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </aside>
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

type Barangay = {
    id: string
    name: string
    hazards: string[]
}

const barangays: Barangay[] = [
    {
        id: "1",
        name: "Aplaya",
        hazards: ["Flood", "Typhoon"],
    },
    {
        id: "2",
        name: "San Miguel",
        hazards: ["Landslide"],
    },
    {
        id: "3",
        name: "Zone 3",
        hazards: ["Flood", "Pandemic"],
    },
]

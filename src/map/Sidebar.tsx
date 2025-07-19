import { useEffect, useRef, useState } from "react"
import type { DateRange } from "react-day-picker"

import { useBarangaysWithReports } from "../api/useGetBarangayWithReports"
import TextInput from "../components/ui/TextInput"
import DateRangePicker from "../components/ui/DateRangeSelector"
// import PopOver from "../components/ui/PopOver"
import { EventsFilterDropdown } from "../components/map/EventsFilter"
import { StatusFilterDropdown } from "../components/map/StatusFilter"
import BarangayReportList from "../components/map/BarangayReportList"
import ScrollShadowWrapper from "../components/ui/ScrollShadowWrapper"
import { usePaginatedReports } from "../api/usePaginatedReports"
import { useVirtualizer } from "@tanstack/react-virtual"
import { timeAgo } from "../utils/time"

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
const LIST_ITEM_HEIGHT = 120

export default function Sidebar() {
    const [range, setRange] = useState<DateRange | undefined>()
    // const [selectedHazards, setSelectedHazards] = useState<string[]>([])
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

    // const {
    //     data: barangays,
    //     isLoading: barangaysIsLoading,
    //     error: barangaysIsError,
    // } = useBarangaysWithReports()

    const {
        data: reports,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        status,
    } = usePaginatedReports({
        // limit: 20,
        // barangayIds: ["5", "6"],
        // types: ["Flood", "Landslide"],
        // statuses: ["pending", "verified"],
    })

    const allReports = reports
        ? reports.pages.flatMap((report) => report.items)
        : []
    const parentRef = useRef<HTMLDivElement>(null)
    console.log("🚀 ~ Sidebar ~ allReports:", allReports)

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? allReports.length + 1 : allReports.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => LIST_ITEM_HEIGHT,
        overscan: 5,
    })

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

        if (!lastItem) return

        if (
            lastItem.index >= allReports.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        hasNextPage,
        fetchNextPage,
        allReports.length,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ])

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

            <div className="px-4 flex gap-2 mb-4">
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

            {/* virtualizer.scrollToIndex(42) */}

            {status === "pending" ? (
                <p>Loading...</p>
            ) : status === "error" ? (
                <span>Error: {error.message}</span>
            ) : (
                <div ref={parentRef} className="flex-1 w-full overflow-auto">
                    <div
                        className="relative w-full"
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const isLoaderRow =
                                virtualRow.index > allReports.length - 1
                            const report = allReports[virtualRow.index]

                            return (
                                <div
                                    key={virtualRow.key}
                                    ref={rowVirtualizer.measureElement}
                                    className="absolute top-0 left-0 w-full"
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {isLoaderRow ? (
                                        <div className="text-center text-gray-400 text-sm">
                                            hasNextPage ? ( "Loading more..." )
                                            : ( "Nothing more to load" )
                                        </div>
                                    ) : (
                                        <div className="w-full h-auto flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-200">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 leading-tight truncate">
                                                    {report.type}
                                                </p>

                                                <p className="text-sm text-gray-700">
                                                    {report.barangayName}
                                                </p>

                                                {/* 
             <span className="capitalize">
                                                        {report.status}
                                                    </span>
                                                    <span>•</span>
*/}
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                                    <i className="fa-regular fa-clock"></i>
                                                    <span>
                                                        {timeAgo(
                                                            report.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {report.author
                                                        .avatarUrl && (
                                                        <img
                                                            src={
                                                                report.author
                                                                    .avatarUrl
                                                            }
                                                            alt={
                                                                report.author
                                                                    .name
                                                            }
                                                            className="size-5 rounded-full object-cover"
                                                        />
                                                    )}

                                                    <p className="text-sm text-gray-800 truncate">
                                                        {report.author.name}
                                                    </p>
                                                </div>
                                            </div>

                                            {report.imageUrls?.[0] && (
                                                <img
                                                    src={report.imageUrls[0]}
                                                    alt={report.type}
                                                    className="size-20 rounded-md object-cover flex-shrink-0"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* <div className="flex items-center my-4 mx-4">
                <h2 className="text-xl">Reports</h2>
            </div> */}

            {/* {barangaysIsLoading ? (
                <div className="text-gray-500 text-sm">
                    Loading barangays...
                </div>
            ) : barangaysIsError ? (
                <div className="text-red-500 text-sm">Failed to load data.</div>
            ) : barangays?.length === 0 ? (
                <div className="text-gray-500 text-sm">No results found.</div>
            ) : (
                <ScrollShadowWrapper>
                    <BarangayReportList barangays={barangays || []} />

                    <div></div>
                </ScrollShadowWrapper>
            )} */}
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

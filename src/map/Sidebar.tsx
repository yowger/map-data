import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef, useState } from "react"
import type { DateRange } from "react-day-picker"

import { useGetBarangays } from "../api/useGetBarangay"
import { BarangayFilterDropdown } from "../components/map/BarangayFilter"
import DateRangePicker from "../components/map/DateRangeSelector"
import { EventsFilterDropdown } from "../components/map/EventsFilter"
import { ReportCard as ReportItem } from "../components/map/ReportItem"
import { StatusFilterDropdown } from "../components/map/StatusFilter"
import { usePaginatedReports } from "../api/usePaginatedReports"
import TextInput from "../components/ui/TextInput"
import XScrollWrapper from "../components/ui/XScrollWrapper"

const HAZARD_OPTIONS = [
    "Flood",
    "Landslide",
    "Garbage",
    "Road Damage",
    "Blocked Drainage",
    "Power Outage",
    "Missing Person",
    "Missing Animal",
    "Missing Vehicle",
    "Missing Object",
    "Other",
]
const STATUS_OPTIONS = ["pending", "verified", "rejected", "archived"]
const LIST_ITEM_HEIGHT = 150
const ITEM_PER_PAGE = 20

export default function Sidebar() {
    const [range, setRange] = useState<DateRange | undefined>()
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [selectedBarangayIds, setSelectedBarangayIds] = useState<string[]>([])

    const parentRef = useRef<HTMLDivElement>(null)

    const { data: barangays } = useGetBarangays()

    const {
        data: reports,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        status,
    } = usePaginatedReports({
        limit: ITEM_PER_PAGE,
        barangayIds: selectedBarangayIds,
        types: selectedEvents,
        statuses: selectedStatuses,
        from: range?.from?.toISOString(),
        to: range?.to
            ? new Date(range.to.setHours(23, 59, 59, 999)).toISOString()
            : undefined,
    })

    const allReports = reports
        ? reports.pages.flatMap((report) => report.items)
        : []

    const virtualizer = useVirtualizer({
        count: hasNextPage ? allReports.length + 1 : allReports.length,
        overscan: 5,
        getScrollElement: () => parentRef.current,
        estimateSize: () => LIST_ITEM_HEIGHT,
        measureElement: (el) => el.getBoundingClientRect().height,
    })

    const items = virtualizer.getVirtualItems()

    useEffect(() => {
        const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

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
        virtualizer.getVirtualItems(),
    ])

    return (
        <aside className="w-[28rem] bg-white shadow-lg h-full flex flex-col overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
                <TextInput icon={searchIcon} placeholder="Search title" />

                <DateRangePicker
                    range={range}
                    onChange={(newRange) => {
                        setRange(newRange)
                    }}
                />
            </div>

            <div className="w-full mb-2">
                <XScrollWrapper>
                    <BarangayFilterDropdown
                        selected={selectedBarangayIds}
                        onChange={setSelectedBarangayIds}
                        barangays={barangays || []}
                        onClear={() => setSelectedBarangayIds([])}
                        onDone={() => {}}
                    />

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
                        onDone={() =>
                            console.log("Statuses:", selectedStatuses)
                        }
                    />
                </XScrollWrapper>
            </div>

            {status === "pending" ? (
                <p>Loading...</p>
            ) : status === "error" ? (
                <span>Error: {error.message}</span>
            ) : allReports.length === 0 ? (
                <div className="flex text-gray-500 text-sm px-4 py-2">
                    No reports found.
                </div>
            ) : (
                <div
                    ref={parentRef}
                    className="flex-1 w-full overflow-auto contain-strict"
                >
                    <div
                        className="relative w-full"
                        style={{
                            height: virtualizer.getTotalSize(),
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${
                                    items[0]?.start ?? 0
                                }px)`,
                            }}
                        >
                            {items.map((virtualRow) => {
                                const isLoaderRow =
                                    virtualRow.index > allReports.length - 1
                                const report = allReports[virtualRow.index]

                                return (
                                    <div
                                        key={virtualRow.key}
                                        data-index={virtualRow.key}
                                        ref={virtualizer.measureElement}
                                    >
                                        {isLoaderRow ? (
                                            <div className="text-center text-gray-400 text-sm">
                                                hasNextPage ? ( "Loading
                                                more..." ) : ( "Nothing more to
                                                load" )
                                            </div>
                                        ) : (
                                            <ReportItem report={report} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </aside>
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

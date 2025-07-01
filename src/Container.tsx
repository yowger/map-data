import { useState } from "react"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"

import BarangayDetailView from "./components/BarangayViewDetail"
import BarangayListView from "./components/BarangayListView"
import { mockReports } from "./data/mock/mockReports"
import Map from "./map/Map"
import type { BarangayFeature } from "./types/map"

export default function Container() {
    const [sidebarView, setSidebarView] = useState<"list" | "detail">("list")
    const [selectedBarangay, setSelectedBarangay] =
        useState<BarangayFeature | null>(null)

    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    if (barangaysLoading) {
        return <p>Loading...</p>
    }

    if (barangaysError || !barangays) {
        return <p>Error fetching map data...</p>
    }

    return (
        <div className="flex h-screen">
            <aside className="w-96 bg-white shadow overflow-y-auto p-4">
                {sidebarView === "list" && (
                    <BarangayListView
                        barangays={barangays}
                        setSelectedBarangay={setSelectedBarangay}
                        setSidebarView={setSidebarView}
                    />
                )}

                {sidebarView === "detail" && selectedBarangay && (
                    <BarangayDetailView
                        barangay={selectedBarangay}
                        onBack={() => setSidebarView("list")}
                    />
                )}
            </aside>

            <Map
                barangays={barangays}
                selectedBarangay={selectedBarangay}
                reports={mockReports}
            />
        </div>
    )
}

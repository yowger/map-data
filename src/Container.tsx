import Leaflet from "leaflet"
import { useState } from "react"
import { useDebounceValue } from "usehooks-ts"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"
import { useGetReportClusters } from "./api/useGetBarangayReportClusters"
import BarangayDetailView from "./components/BarangayViewDetail"
import BarangayListView from "./components/BarangayListView"
import { mockReports } from "./data/mock/mockReports"
import Map from "./map/Map"
import type { BarangayFeature, BBox } from "./types/map"

export default function Container() {
    const [sidebarView, setSidebarView] = useState<"list" | "detail">("list")
    const [selectedBarangay, setSelectedBarangay] =
        useState<BarangayFeature | null>(null)
    const [bbox, setBbox] = useDebounceValue<BBox | null>(null, 450)
    const [zoom, setZoom] = useDebounceValue<number | null>(null, 450)

    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    const {
        data: clusters,
        // isLoading,
        // isError,
    } = useGetReportClusters(bbox as BBox, zoom as number)
    console.log("🚀 ~ Container ~ clusters:", clusters)

    function handleMoveEnd(map: Leaflet.Map) {
        const bounds = map.getBounds()

        const bbox: BBox = [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
        ]
        const zoom = map.getZoom()

        setBbox(bbox)
        setZoom(zoom)
    }

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
                OnMoveEnd={handleMoveEnd}
            />
        </div>
    )
}

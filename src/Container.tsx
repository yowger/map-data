import { useQueryClient } from "@tanstack/react-query"
import Leaflet from "leaflet"
import { useState } from "react"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"
import {
    fetchClusters,
    getCachedClusters,
} from "./api/useGetBarangayReportClusters"
// import BarangayDetailView from "./components/map/BarangayViewDetail"
// import BarangayListView from "./components/map/BarangayListView"
import Map from "./map/Map"
import type { BarangayFeature, BBox, ClusterFeature } from "./types/map"
import Sidebar from "./map/Sidebar"
import {
    deduplicateClusters,
    getClusterKey,
    getDynamicPadding,
} from "./utils/mapUtils"

const PADDING_FALLOFF_RATE = 0.1
const VISIBLE_PADDING_FACTOR = 0.6

export default function Container() {
    // const [sidebarView, setSidebarView] = useState<"list" | "detail">("list")
    // const [selectedBarangay, setSelectedBarangay] =
    //     useState<BarangayFeature | null>(null)
    const [visibleClusters, setVisibleClusters] = useState<ClusterFeature[]>([])

    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    const queryClient = useQueryClient()

    async function handleMoveEnd(map: Leaflet.Map) {
        const bounds = map.getBounds()
        const zoom = map.getZoom()

        const fetchPadding =
            getDynamicPadding(map.getZoom()) + PADDING_FALLOFF_RATE
        const fetchPaddedBounds = bounds.pad(fetchPadding)
        const bbox: BBox = [
            fetchPaddedBounds.getWest(),
            fetchPaddedBounds.getSouth(),
            fetchPaddedBounds.getEast(),
            fetchPaddedBounds.getNorth(),
        ]

        const incomingClusters = await fetchClusters(queryClient, zoom, bbox)
        const cachedClusters = getCachedClusters(queryClient, zoom)
        const dedupedCachedClusters = deduplicateClusters(cachedClusters)

        const incomingClusterKeys = new Set(incomingClusters.map(getClusterKey))
        const visibleBounds = bounds.pad(VISIBLE_PADDING_FACTOR)

        const filteredVisibleClusters = dedupedCachedClusters.filter(
            (cluster) => {
                const [lng, lat] = cluster.geometry.coordinates
                const key = getClusterKey(cluster)

                return (
                    visibleBounds.contains(Leaflet.latLng(lat, lng)) &&
                    incomingClusterKeys.has(key)
                )
            }
        )

        setVisibleClusters(filteredVisibleClusters)
    }

    if (barangaysLoading) {
        return <p>Loading...</p>
    }

    if (barangaysError || !barangays) {
        return <p>Error fetching map data...</p>
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* <aside className="w-96 bg-white shadow overflow-y-auto p-4">
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
            </aside> */}
            <Sidebar />

            <Map
                barangays={barangays}
                clusters={visibleClusters}
                // selectedBarangay={selectedBarangay}
                selectedBarangay={null}
                OnMoveEnd={handleMoveEnd}
            />
        </div>
    )
}

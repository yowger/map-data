import Leaflet from "leaflet"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"
import { useGetReportClusters } from "./api/useGetBarangayReportClusters"
import BarangayDetailView from "./components/map/BarangayViewDetail"
import BarangayListView from "./components/map/BarangayListView"
import Map from "./map/Map"
import type { BarangayFeature, BBox, ClusterFeature } from "./types/map"

function getDynamicPadding(zoom: number): number {
    console.log("🚀 ~ getDynamicPadding ~ zoom:", zoom)
    const maxPadding = 0.6
    const minPadding = 0.2
    const paddingFalloffRate = 0.1

    const dynamicPadding = 1.2 - zoom * paddingFalloffRate

    return Math.min(maxPadding, Math.max(minPadding, dynamicPadding))
}

export default function Container() {
    const [sidebarView, setSidebarView] = useState<"list" | "detail">("list")
    const [selectedBarangay, setSelectedBarangay] =
        useState<BarangayFeature | null>(null)
    const [bbox, setBbox] = useDebounceValue<BBox | null>(null, 450)
    const [zoom, setZoom] = useDebounceValue<number | null>(null, 450)
    const [markerCache, setMarkerCache] = useState<ClusterFeature[]>([])

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

    function handleMoveEnd(map: Leaflet.Map) {
        const bounds = map.getBounds()

        const paddingFactor = getDynamicPadding(map.getZoom())
        const paddedBounds = bounds.pad(paddingFactor)

        const bbox: BBox = [
            paddedBounds.getWest(),
            paddedBounds.getSouth(),
            paddedBounds.getEast(),
            paddedBounds.getNorth(),
        ]
        const zoom = map.getZoom()

        setBbox(bbox)
        setZoom(zoom)
    }

    useEffect(() => {
        if (!clusters) return

        const clusterKey = (cluster: ClusterFeature) =>
            `${cluster.geometry.coordinates[0].toFixed(
                5
            )}:${cluster.geometry.coordinates[1].toFixed(5)}`

        const newClusterKeys = new Set(clusters.map(clusterKey))

        setMarkerCache((prevMarkerCache) => {
            const retainedClusters = prevMarkerCache.filter((marker) =>
                newClusterKeys.has(clusterKey(marker))
            )

            const newClusters = clusters.filter(
                (cluster) =>
                    !retainedClusters.some(
                        (retainedCluster) =>
                            clusterKey(retainedCluster) === clusterKey(cluster)
                    )
            )

            return [...retainedClusters, ...newClusters]
        })
    }, [clusters])

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
                clusters={markerCache}
                selectedBarangay={selectedBarangay}
                OnMoveEnd={handleMoveEnd}
            />
        </div>
    )
}

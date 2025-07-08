import Leaflet from "leaflet"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"
import {
    getReportClusters,
    useGetReportClusters,
} from "./api/useGetBarangayReportClusters"
import BarangayDetailView from "./components/map/BarangayViewDetail"
import BarangayListView from "./components/map/BarangayListView"
import Map from "./map/Map"
import type { BarangayFeature, BBox, ClusterFeature } from "./types/map"
import { QueryCache, useQueryClient } from "@tanstack/react-query"

function getDynamicPadding(zoom: number): number {
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
    // const [markerCache, setMarkerCache] = useState<ClusterFeature[]>([])
    const [visibleClusters, setVisibleClusters] = useState<ClusterFeature[]>([])

    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    // const {
    //     data: clusters,
    //     // isLoading,
    //     // isError,
    //     isFetched,
    // } = useGetReportClusters(bbox as BBox, zoom as number)

    const queryClient = useQueryClient()

    async function handleMoveEnd(map: Leaflet.Map) {
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

        const incomingClusters = await queryClient.fetchQuery({
            queryKey: ["reportClusters", zoom, bbox],
            queryFn: () => getReportClusters(bbox, zoom),
            staleTime: 1000 * 60 * 5,
        })
        // console.log("🚀 ~ handleMoveEnd ~ incomingClusters:", incomingClusters)

        const cachedClusters = queryClient.getQueriesData({
            queryKey: ["reportClusters", zoom],
        })
        // console.log("🚀 ~ handleMoveEnd ~ cachedClusters:", cachedClusters)

        // setBbox(bbox)
        // setZoom(zoom)

        const clusterSet = new Set<string>()
        const dedupedCachedClusters: ClusterFeature[] = []

        for (const [, data] of cachedClusters) {
            if (!Array.isArray(data)) continue

            for (const cluster of data) {
                const [lng, lat] = cluster.geometry.coordinates
                const key = `${lng.toFixed(5)}:${lat.toFixed(5)}`

                if (!clusterSet.has(key)) {
                    clusterSet.add(key)
                    dedupedCachedClusters.push(cluster)
                }
            }
        }

        const showVisibleClusters = dedupedCachedClusters.filter((cluster) => {
            const [lng, lat] = cluster.geometry.coordinates

            const clusterExist = incomingClusters.some((clusters) => {
                const [lng2, lat2] = clusters.geometry.coordinates

                return lng === lng2 && lat === lat2
            })

            return (
                paddedBounds.contains(new Leaflet.LatLng(lat, lng)) &&
                clusterExist
            )
        })
        console.log(
            "🚀 ~ showVisibleClusters ~ showVisibleClusters:",
            showVisibleClusters
        )

        // show only visible clusters

        // setVisibleClusters(dedupedCachedClusters)
        setVisibleClusters(showVisibleClusters)
    }

    // useEffect(() => {
    //     if (!clusters) return

    //     console.log("has clusters")
    // }, [clusters])

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
                clusters={visibleClusters}
                selectedBarangay={selectedBarangay}
                OnMoveEnd={handleMoveEnd}
            />
        </div>
    )
}

/*
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
*/

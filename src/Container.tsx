import { useQueryClient } from "@tanstack/react-query"
import Leaflet from "leaflet"
import { useEffect, useState } from "react"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"
import {
    fetchClusters,
    getCachedClusters,
} from "./api/useGetBarangayReportClusters"
import { useFilterContext } from "./hooks/useFilterContext"
import { useMapRefContext } from "./hooks/useMapContext"
import Map from "./map/Map"
import Sidebar from "./map/Sidebar"
import type { BBox, ClusterFeature } from "./types/map"
import {
    deduplicateClusters,
    getClusterKey,
    getDynamicPadding,
} from "./utils/mapUtils"

const PADDING_FALLOFF_RATE = 0.1
const VISIBLE_PADDING_FACTOR = 0.6

export default function Container() {
    const { range, selectedEvents, selectedStatuses, selectedBarangayIds } =
        useFilterContext()
    const mapRefContext = useMapRefContext()
    const [mapRef, setMapRef] = useState<Leaflet.Map | null>(null)
    const [visibleClusters, setVisibleClusters] = useState<ClusterFeature[]>([])

    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    const queryClient = useQueryClient()

    async function handleMoveEnd(map: Leaflet.Map) {
        setMapRef(map)

        const visibleClusters = await fetchVisibleClusters(map)

        setVisibleClusters(visibleClusters)
    }

    async function fetchVisibleClusters(map: Leaflet.Map) {
        const zoom = map.getZoom()
        const bbox = getMapBBox(map)
        const filters = builderFilters({
            selectedEvents,
            selectedStatuses,
            selectedBarangayIds,
            range,
        })

        const incomingClusters = await fetchClusters({
            queryClient,
            filters: {
                ...filters,
                zoom,
                bbox,
            },
        })

        const cachedClusters = getCachedClusters({
            queryClient,
            filters: {
                ...filters,
                zoom,
            },
        })

        return filterClustersInView(
            cachedClusters,
            incomingClusters,
            map.getBounds()
        )
    }

    useEffect(() => {
        if (!mapRef) return

        const run = async () => {
            const visibleClusters = await fetchVisibleClusters(mapRef)

            setVisibleClusters(visibleClusters)
        }

        run()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEvents, selectedStatuses, selectedBarangayIds, range])

    if (barangaysLoading) {
        return <p>Loading...</p>
    }

    if (barangaysError || !barangays) {
        return <p>Error fetching map data...</p>
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <Map
                barangays={barangays}
                clusters={visibleClusters}
                // selectedBarangay={selectedBarangay}
                selectedBarangay={null}
                OnMoveEnd={handleMoveEnd}
                OnReady={async (map) => {
                    mapRefContext.current = map

                    const visibleClusters = await fetchVisibleClusters(map)

                    setVisibleClusters(visibleClusters)
                }}
            />
        </div>
    )
}

function getMapBBox(map: Leaflet.Map): BBox {
    const bounds = map.getBounds()
    const padding = getDynamicPadding(map.getZoom()) + PADDING_FALLOFF_RATE
    const padded = bounds.pad(padding)

    return [
        padded.getWest(),
        padded.getSouth(),
        padded.getEast(),
        padded.getNorth(),
    ]
}

function builderFilters({
    selectedEvents,
    selectedStatuses,
    selectedBarangayIds,
    range,
}: {
    selectedEvents: string[]
    selectedStatuses: string[]
    selectedBarangayIds: string[]
    range: { from?: Date; to?: Date } | undefined
}) {
    return {
        types: selectedEvents.length ? selectedEvents : undefined,
        statuses: selectedStatuses.length ? selectedStatuses : undefined,
        barangayIds: selectedBarangayIds.length
            ? selectedBarangayIds
            : undefined,
        from: range?.from?.toISOString(),
        to: range?.to?.toISOString(),
    }
}

function filterClustersInView(
    cached: [unknown, unknown][],
    incoming: ClusterFeature[],
    bounds: Leaflet.LatLngBounds
) {
    const deduped = deduplicateClusters(cached)
    const visibleBounds = bounds.pad(VISIBLE_PADDING_FACTOR)
    const incomingKeys = new Set(incoming.map(getClusterKey))

    return deduped.filter((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates
        const key = getClusterKey(cluster)

        return (
            visibleBounds.contains(Leaflet.latLng(lat, lng)) &&
            incomingKeys.has(key)
        )
    })
}

/*

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

        const filters = {
            types: selectedEvents.length > 0 ? selectedEvents : undefined,
            statuses:
                selectedStatuses.length > 0 ? selectedStatuses : undefined,
            barangayIds:
                selectedBarangayIds.length > 0
                    ? selectedBarangayIds
                    : undefined,
            from: range?.from?.toISOString(),
            to: range?.to?.toISOString(),
        }

        const incomingClusters = await fetchClusters({
            queryClient,
            filters: {
                ...filters,
                zoom,
                bbox,
            },
        })
        const cachedClusters = getCachedClusters({
            queryClient,
            filters: {
                ...filters,
                zoom,
            },
        })
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
*/

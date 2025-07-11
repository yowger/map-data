import { QueryClient, useQuery } from "@tanstack/react-query"
import axios from "axios"

import type { BBox, ClusterFeature } from "../types/map"

const CLUSTER_STALE_TIME = 1000 * 60 * 5
const CLUSTER_KEY = "reportClusters"

export async function fetchClusters(
    queryClient: QueryClient,
    zoom: number,
    bbox: BBox
): Promise<ClusterFeature[]> {
    return await queryClient.fetchQuery({
        queryKey: [CLUSTER_KEY, zoom, bbox],
        queryFn: () => getReportClusters(bbox, zoom),
        staleTime: CLUSTER_STALE_TIME,
    })
}

export function getCachedClusters(queryClient: QueryClient, zoom: number) {
    return queryClient.getQueriesData({
        queryKey: [CLUSTER_KEY, zoom],
    })
}

export function getReportClusters(
    bbox: BBox,
    zoom: number
): Promise<ClusterFeature[]> {
    const bboxParam = bbox.join(",")

    return axios
        .get("http://localhost:3000/api/v1/reports/clusters", {
            params: { bbox: bboxParam, zoom },
        })
        .then((result) => {
            return result.data
        })
}

export function useGetReportClusters(bbox: BBox, zoom: number) {
    return useQuery({
        queryKey: ["reportClusters", zoom, bbox],
        queryFn: () => getReportClusters(bbox, zoom),
        staleTime: 1000 * 60 * 5,
        enabled: !!bbox && !!zoom,
    })
}

import { QueryClient } from "@tanstack/react-query"
import qs from "qs"

import type { BBox, ClusterFeature } from "../types/map"
import { axiosClient } from "../services/axios"

const CLUSTER_STALE_TIME = 1000 * 60 * 5
const CLUSTER_KEY = "reportClusters"

export type GetReportsParams = {
    zoom?: number
    bbox?: BBox | string
    barangayIds?: string[]
    types?: string[]
    statuses?: string[]
    from?: string
    to?: string
}

export type ClusterQueryParams = {
    queryClient: QueryClient
    filters: GetReportsParams
}

export async function getReportClusters(
    params: GetReportsParams
): Promise<ClusterFeature[]> {
    const filters = {
        ...params,
        bbox: Array.isArray(params.bbox) ? params.bbox.join(",") : params.bbox,
    }

    return axiosClient
        .get("/v1/reports/clusters", {
            params: filters,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: "repeat" }),
        })
        .then((result) => result.data)
}

export async function fetchClusters({
    queryClient,
    filters,
}: ClusterQueryParams): Promise<ClusterFeature[]> {
    return await queryClient.fetchQuery({
        queryKey: [CLUSTER_KEY, filters],
        queryFn: () => getReportClusters(filters),
        staleTime: CLUSTER_STALE_TIME,
    })
}

export function getCachedClusters({
    queryClient,
    filters,
}: ClusterQueryParams) {
    return queryClient.getQueriesData({
        queryKey: [CLUSTER_KEY, filters],
    })
}

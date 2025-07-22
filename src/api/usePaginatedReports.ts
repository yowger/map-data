import { useInfiniteQuery } from "@tanstack/react-query"
import qs from "qs"

import { axiosClient } from "../services/axios"
import type { PaginatedReportsResponse } from "../types/reports"

type GetReportsParams = {
    limit?: number
    barangayIds?: string[]
    types?: string[]
    statuses?: string[]
    from?: string
    to?: string
}

async function fetchReports(
    cursor: string | null,
    filters: GetReportsParams
): Promise<PaginatedReportsResponse> {
    const res = await axiosClient.get<PaginatedReportsResponse>("/v1/reports", {
        params: {
            cursor,
            ...filters,
        },
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
    })

    return res.data
}

export function usePaginatedReports(filters: GetReportsParams = {}) {
    return useInfiniteQuery<PaginatedReportsResponse>({
        queryKey: ["reports", filters],
        queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
            const cursor = typeof pageParam === "string" ? pageParam : null

            return fetchReports(cursor, filters)
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
}

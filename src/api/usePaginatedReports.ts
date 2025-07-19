import { useInfiniteQuery } from "@tanstack/react-query"

import { axiosClient } from "../services/axios"
import type { PaginatedReportsResponse } from "../types/reports"

type GetReportsParams = {
    limit?: number
    barangayIds?: string[]
    types?: string[]
    statuses?: string[]
}

async function fetchReports(
    cursor: string | null,
    filters: GetReportsParams
): Promise<PaginatedReportsResponse> {
    const res = await axiosClient.get<PaginatedReportsResponse>(
        "/api/reports",
        {
            params: {
                cursor,
                ...filters,
            },
        }
    )

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

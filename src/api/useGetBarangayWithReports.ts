import { useQuery } from "@tanstack/react-query"

import { axiosClient } from "../services/axios"
import type { BarangayWithReportsList } from "../types/barangays"

const STALE_TIME = 5 * 60 * 1000

async function getBarangaysWithReports(): Promise<BarangayWithReportsList> {
    return await axiosClient("/v1/barangays/with-reports").then((result) => {
        return result.data
    })
}

export function useBarangaysWithReports() {
    return useQuery({
        queryKey: ["barangays-with-reports"],
        queryFn: getBarangaysWithReports,
        staleTime: STALE_TIME,
    })
}

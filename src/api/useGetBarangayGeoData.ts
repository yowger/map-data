import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import type { BarangayGeoJSON } from "../types/map"

async function getBargangayGeoData(): Promise<BarangayGeoJSON> {
    return axios.get("/data/barangaysSimplified.json").then((result) => {
        return result.data
    })
}

export function useGetBarangayGeoData() {
    return useQuery({
        queryKey: ["barangays-geo-data"],
        queryFn: getBargangayGeoData,
        staleTime: Infinity,
    })
}

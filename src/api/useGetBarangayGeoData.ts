import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import type { BarangayGeoJSON } from "../types/map"

function getBargangayGeoData(): Promise<BarangayGeoJSON> {
    return axios.get("/data/barangaysSimplified.json").then((result) => {
        return result.data
    })
}

export function useGetBarangayGeoData() {
    return useQuery({
        queryKey: ["barangays"],
        queryFn: getBargangayGeoData,
    })
}

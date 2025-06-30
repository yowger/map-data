import { useQuery } from "@tanstack/react-query"
import axios from "axios"

function getBargangayGeoData() {
    return axios.get("/data/barangays.geojson").then((result) => {
        return result.data
    })
}

export function useGetBarangayGeoData() {
    return useQuery({
        queryKey: ["barangays"],
        queryFn: getBargangayGeoData,
    })
}

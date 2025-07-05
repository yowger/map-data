import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import type { BBox, ClusterFeature } from "../types/map"

export function getReportClusters(
    bbox: BBox,
    zoom: number
): Promise<ClusterFeature[]> {
    console.log("enabled")
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
        queryKey: ["reportClusters", bbox, zoom],
        queryFn: () => getReportClusters(bbox, zoom),
        enabled: !!bbox && !!zoom,
    })
}

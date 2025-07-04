import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import type { BBox } from "../types/map"

export interface ClusterFeature {
    type: "Feature"
    geometry: {
        type: "Point"
        coordinates: [number, number]
    }
    properties: {
        cluster: boolean
        cluster_id?: number
        point_count?: number
        point_count_abbreviated?: string
        type?: string
        message?: string
    }
}

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

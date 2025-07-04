export type BarangayFeature = {
    type: "Feature"
    properties: {
        OBJECTID: string
        Brgy_Name: string
        Brgy_id: string
        AREA_SQKM: number
        AREA_HA: number
        North: string
        South: string
        East: string
        West: string
    }
    geometry: {
        type: "MultiPolygon"
        coordinates: number[][][][]
    }
}

export type BarangayGeoJSON = {
    type: "FeatureCollection"
    name: string
    crs?: {
        type: string
        properties: {
            name: string
        }
    }
    features: BarangayFeature[]
}

export type BBox = [number, number, number, number]

export type MapReport = {
    id: string
    lat: number
    lng: number
    type:
        | "flood"
        | "landslide"
        | "earthquake"
        | "road_block"
        | "fire"
        | "missing_person"
        | "accident"
        | "environmental"
        | "other"
    message: string
    imageUrls?: string[]
    barangayId?: string
    verified: boolean
    createdAt: string
}

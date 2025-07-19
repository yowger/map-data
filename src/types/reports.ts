export type Report = {
    _id: string
    barangayId: string
    type: string
    message: string
    lat: number
    lng: number
    location: {
        type: "Point"
        coordinates: [number, number]
    }
    imageUrls: string[]
    authorId: string
    status: "pending" | "verified" | "rejected" | "archived"
    createdAt: string
    updatedAt: string
}

export type PaginatedReportsResponse = {
    items: Report[]
    nextCursor: string | null
}

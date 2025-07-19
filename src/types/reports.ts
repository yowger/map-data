export type PopulatedAuthor = {
    _id: string
    name: string
    email: string
    avatarUrl: string
}

export type Report = {
    _id: string
    barangayId: string
    barangayName: string
    type: string
    message: string
    lat: number
    lng: number
    location: {
        type: "Point"
        coordinates: [number, number]
    }
    imageUrls: string[]
    author: PopulatedAuthor
    status: "pending" | "verified" | "rejected" | "archived"
    createdAt: string
    updatedAt: string
}

export type PaginatedReportsResponse = {
    items: Report[]
    nextCursor: string | null
}

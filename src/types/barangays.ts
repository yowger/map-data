export type ReportSummary = {
    _id: string
    barangayId: string
    type: string
    status: "pending" | "verified" | "rejected" | "archived"
    createdAt: string
}

export type Barangay = {
    id: string
    name: string
    areaSqKm: number
    areaHa: number
}

export type BarangayWithReports = Barangay & {
    recentReports: ReportSummary[]
}

export type BarangayWithReportsList = BarangayWithReports[]

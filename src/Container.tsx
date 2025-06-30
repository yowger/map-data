import { useState } from "react"

import { useGetBarangayGeoData } from "./api/useGetBarangayGeoData"
import Map from "./map/Map"
import type { BarangayFeature } from "./types/map"

export default function Container() {
    const [selectedBarangay, setSelectedBarangay] =
        useState<BarangayFeature | null>(null)

    const {
        data: barangays,
        isLoading: barangaysLoading,
        error: barangaysError,
    } = useGetBarangayGeoData()

    if (barangaysLoading) {
        return <p>Loading...</p>
    }

    if (barangaysError || !barangays) {
        return <p>Error fetching map data...</p>
    }

    return (
        <div className="flex h-screen">
            <aside className=" w-80 p-4 bg-white shadow overflow-y-auto">
                <h2>Barangays</h2>
                <ul>
                    {barangays.features.map((barangay, index) => {
                        return (
                            <div key={index}>
                                <div
                                    className="flex justify-between"
                                    onClick={() =>
                                        setSelectedBarangay(barangay)
                                    }
                                >
                                    <p>{barangay.properties.Brgy_Name}</p>
                                    <button>View</button>
                                </div>
                            </div>
                        )
                    })}
                </ul>
            </aside>

            <Map barangays={barangays} selectedBarangay={selectedBarangay} />
        </div>
    )
}

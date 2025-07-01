import type { BarangayFeature, BarangayGeoJSON } from "../types/map"

interface Props {
    barangays: BarangayGeoJSON
    setSelectedBarangay: (barangay: BarangayFeature) => void
    setSidebarView: (view: "list" | "detail") => void
}

export default function BarangayListView({
    barangays,
    setSelectedBarangay,
    setSidebarView,
}: Props) {
    return (
        <>
            <h2 className="text-lg font-semibold mb-2">Barangays</h2>
            <ul className="space-y-2">
                {barangays.features.map((barangay) => (
                    <li
                        key={barangay.properties.Brgy_id}
                        className="py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-medium">
                                {barangay.properties.Brgy_Name}
                            </p>
                            <div className="space-x-1">
                                <button
                                    className="text-blue-600 text-sm hover:underline"
                                    onClick={() =>
                                        setSelectedBarangay(barangay)
                                    }
                                >
                                    View
                                </button>
                                <button
                                    className="text-gray-600 text-sm hover:underline"
                                    onClick={() => {
                                        setSelectedBarangay(barangay)
                                        setSidebarView("detail")
                                    }}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

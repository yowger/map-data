import type { BarangayFeature } from "../types/map"

export default function BarangayDetailView({
    barangay,
    onBack,
}: {
    barangay: BarangayFeature
    onBack: () => void
}) {
    const p = barangay.properties
    return (
        <div className="p-2 space-y-2">
            <button
                className="text-sm text-blue-600 hover:underline"
                onClick={onBack}
            >
                ← Back
            </button>
            <h3 className="text-xl font-semibold">{p.Brgy_Name}</h3>
            <p>
                <strong>Barangay ID:</strong> {p.Brgy_id}
            </p>
            <p>
                <strong>Area (HA):</strong> {p.AREA_HA.toLocaleString()}
            </p>
            <p>
                <strong>North:</strong> {p.North}
            </p>
            <p>
                <strong>South:</strong> {p.South}
            </p>
            <p>
                <strong>East:</strong> {p.East}
            </p>
            <p>
                <strong>West:</strong> {p.West}
            </p>
        </div>
    )
}

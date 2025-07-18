import type { BarangayWithReportsList } from "../../types/barangays"
import { markerStyles } from "../../utils/map"
import { timeAgo } from "../../utils/time"

type Props = {
    barangays: BarangayWithReportsList
}

export default function BarangayReportList({ barangays }: Props) {
    return (
        <ul>
            {barangays.map((barangay) => (
                <li
                    key={barangay.id}
                    className="p-4 hover:bg-gray-50 border-b border-gray-300"
                >
                    <div className="text-lg font-medium tracking-[.2px] text-gray-800">
                        {barangay.name}
                    </div>

                    <div>
                        <h3 className="text-gray-700 hover:text-gray-900 mb-1">
                            Recent reports
                        </h3>

                        {barangay.recentReports
                            .slice(0, 2)
                            .map((report, index) => (
                                <ReportItem
                                    key={index}
                                    type={report.type}
                                    createdAt={report.createdAt}
                                />
                            ))}
                    </div>
                </li>
            ))}
        </ul>
    )
}

type ReportItemProps = {
    type: string
    createdAt: string
}

function ReportItem({ type, createdAt }: ReportItemProps) {
    const style = markerStyles[type] || markerStyles["Other"]

    return (
        <div className="flex gap-3 px-2 py-1 items-center">
            <div
                style={{ backgroundColor: style.color }}
                className="size-8 rounded-full flex items-center justify-center"
            >
                <i className={`${style.icon} text-white text-sm`} />
            </div>

            <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-gray-800">
                    {type}
                </span>
                <span className="text-xs text-gray-500">
                    {timeAgo(createdAt)}
                </span>
            </div>
        </div>
    )
}

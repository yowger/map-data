import { timeAgo } from "../../utils/time"

type ReportCardProps = {
    report: {
        title: string
        barangayName: string
        type: string
        status: string
        createdAt: string
        imageUrls?: string[]
        author: {
            name: string
            avatarUrl?: string
        }
    }
}

export function ReportCard({ report }: ReportCardProps) {
    return (
        <div className="w-full h-auto flex items-center gap-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
            <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <p className="font-semibold text-gray-900 leading-tight text-wrap line-clamp-2">
                                {report.title}
                            </p>

                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mt-1">
                                <i
                                    className={`fa-solid fa-location-dot text-gray-500 flex-shrink-0`}
                                />
                                <span>{report.barangayName}</span>
                            </div>
                        </div>

                        {report.imageUrls?.[0] && (
                            <img
                                src={report.imageUrls[0]}
                                alt={`${report.title} thumbnail`}
                                className="size-20 rounded-md object-cover flex-shrink-0"
                            />
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 mt-1">
                        <InfoRow
                            icon="fa-solid fa-circle-exclamation"
                            text={report.type}
                        />
                        <InfoRow
                            icon="fa-regular fa-clock"
                            text={timeAgo(report.createdAt)}
                        />
                        <InfoRow icon="fa-solid fa-flag" text={report.status} />
                    </div>

                    <div className="flex items-center gap-1.5">
                        {report.author.avatarUrl && (
                            <img
                                src={report.author.avatarUrl}
                                alt={report.author.name}
                                className="size-5 rounded-full object-cover"
                            />
                        )}
                        <p className="text-sm text-gray-800 truncate">
                            {report.author.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-1 text-xs text-gray-500">
            <i className={`${icon} flex-shrink-0`} />
            <span>{text}</span>
        </div>
    )
}

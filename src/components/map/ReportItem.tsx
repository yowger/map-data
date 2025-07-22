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
        <button
            onClick={() => console.log("todo")}
            className="w-full text-left h-auto flex items-center gap-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            aria-label={`View report titled ${report.title}`}
        >
            <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2 mb-3">
                    <div className="flex flex-col">
                        <p className="font-semibold text-gray-900 leading-tight text-wrap line-clamp-2 mb-2.5">
                            {report.title}
                        </p>

                        <div className="w-full flex justify-between">
                            <div className="flex gap-0.5 flex-col">
                                <InfoRow
                                    icon="fa-solid fa-circle-exclamation"
                                    text={report.type}
                                />
                                <InfoRow
                                    icon="fa-solid fa-location-dot"
                                    text={report.barangayName}
                                />
                                <InfoRow
                                    icon="fa-regular fa-clock"
                                    text={timeAgo(report.createdAt)}
                                />
                                <InfoRow
                                    icon="fa-solid fa-flag"
                                    text={report.status}
                                />
                            </div>

                            <div>
                                {report.imageUrls?.[0] && (
                                    <div className="relative size-20 flex-shrink-0">
                                        <img
                                            src={report.imageUrls[0]}
                                            alt={`${report.title} thumbnail`}
                                            className="w-full h-full object-cover rounded-md"
                                            loading="lazy"
                                        />

                                        {report.imageUrls.length > 1 && (
                                            <div className="absolute bottom-1 right-1 bg-black/40 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">
                                                +{report.imageUrls.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
        </button>
    )
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-2 text-[0.8125rem] text-gray-500">
            <i className={`${icon} flex-shrink-0 w-3.5`} />
            <span>{text}</span>
        </div>
    )
}

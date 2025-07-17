export function timeAgo(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)

    if (seconds < 60) return "just now"
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`
    if (months < 6) return `${months} month${months !== 1 ? "s" : ""} ago`

    return date.toLocaleDateString() 
}

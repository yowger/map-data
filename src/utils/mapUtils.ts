import type { ClusterFeature } from "../types/map"

const MAX_PADDING = 0.6
const MIN_PADDING = 0.2
const PADDING_FALLOFF_RATE = 0.1

export function getDynamicPadding(zoom: number): number {
    const dynamicPadding = 1.2 - zoom * PADDING_FALLOFF_RATE

    return Math.min(MAX_PADDING, Math.max(MIN_PADDING, dynamicPadding))
}

export function getClusterKey(cluster: ClusterFeature): string {
    const [lng, lat] = cluster.geometry.coordinates

    return cluster.properties.cluster
        ? `${lng.toFixed(5)}:${lat.toFixed(5)}`
        : cluster.properties.id
}

export function deduplicateClusters(
    clusterGroups: [unknown, unknown][]
): ClusterFeature[] {
    const seen = new Set<string>()
    const result: ClusterFeature[] = []

    for (const [, data] of clusterGroups) {
        if (!Array.isArray(data)) continue

        for (const cluster of data as ClusterFeature[]) {
            const key = getClusterKey(cluster)

            if (!seen.has(key)) {
                seen.add(key)
                result.push(cluster)
            }
        }
    }

    return result
}

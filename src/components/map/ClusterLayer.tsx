import Leaflet from "leaflet"
import { useMap, Marker, Popup } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import type { ClusterFeature } from "../../types/map"

interface ClusterLayerProps {
    clusters: ClusterFeature[]
    onClusterClick?: (clusterId: number, coordinates: [number, number]) => void
}

export function ClusterLayer({ clusters, onClusterClick }: ClusterLayerProps) {
    const map = useMap()

    return (
        <>
            {clusters.map((feature) => {
                const [lng, lat] = feature.geometry.coordinates
                const clusterId = `cluster-${lat.toFixed(5)}-${lng.toFixed(5)}`

                const isClusterType = feature.properties.cluster

                if (isClusterType) {
                    const { cluster_id, point_count } = feature.properties

                    return (
                        <Marker
                            key={clusterId}
                            position={[lat, lng]}
                            icon={createClusterIcon(point_count)}
                            eventHandlers={{
                                click: () => {
                                    map.setView([lat, lng], map.getZoom() + 2)
                                    onClusterClick?.(cluster_id, [lng, lat])
                                },
                            }}
                        >
                            <Popup>{point_count} reports</Popup>
                        </Marker>
                    )
                } else {
                    const { id, type } = feature.properties
                    const markerId = `report-${id}`
                    const markerStyle =
                        markerStyles[type] || markerStyles["Other"]

                    return (
                        <Marker
                            key={markerId}
                            position={[lat, lng]}
                            opacity={1}
                            icon={customMarker(
                                markerStyle.icon,
                                markerStyle.color
                            )}
                        >
                            <Popup>
                                <strong>Type:</strong> {type}
                            </Popup>
                        </Marker>
                    )
                }
            })}
        </>
    )
}

function createClusterIcon(count: number) {
    return Leaflet.divIcon({
        html: `<div class="cluster-marker">${count}</div>`,
        className: "custom-cluster-icon",
        iconSize: [40, 40],
    })
}

const markerStyles: Record<string, { icon: string; color: string }> = {
    Flood: { icon: "fas fa-water", color: "#2563eb" },
    Landslide: { icon: "fas fa-mountain", color: "#F54900" },
    Garbage: { icon: "fas fa-trash", color: "#009966" },
    "Road Damage": { icon: "fas fa-road", color: "#57534D" },
    "Blocked Drainage": { icon: "fas fa-tint-slash", color: "#155DFC" },
    "Power Outage": { icon: "fas fa-bolt", color: "#D08700" },
    "Missing Person": { icon: "fas fa-user-slash", color: "#E7000B" },
    "Missing Animal": { icon: "fas fa-dog", color: "#92400e" },
    "Missing Vehicle": { icon: "fas fa-car-side", color: "#0084D1" },
    "Missing Object": { icon: "fas fa-box-open", color: "#45556C" },
    Other: { icon: "fas fa-question-circle", color: "#525252" },
}

function customMarker(iconClass: string, bgColor = "#3b82f6") {
    return Leaflet.divIcon({
        html: `
        <div class="custom-marker">
          <div class="icon-circle" style="--marker-color: ${bgColor};">
            <i class="${iconClass} icon"></i>
          </div>
              <div class="marker-arrow" ></div>
        </div>
      `,
        className: "",
        iconSize: [40, 52],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40],
        shadowSize: [5, 5],
        shadowAnchor: [10, 10],
    })
}

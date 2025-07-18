import Leaflet from "leaflet"
import { useMap, Marker, Popup } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import type { ClusterFeature } from "../../types/map"
import { markerStyles } from "../../utils/map"

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

import { CircleMarker, Popup } from "react-leaflet";
import type { MapMarkerProps } from "./mapModel";

export function MapMarker({
  children,
  label,
  latitude,
  longitude,
  onClick,
}: MapMarkerProps) {
  return (
    <CircleMarker
      center={[latitude, longitude]}
      pathOptions={{
        className: "common-map-star-marker__circle",
        color: "#ffffff",
        fillColor: "#fef08a",
        fillOpacity: 1,
        weight: 2,
      }}
      radius={8}
      eventHandlers={onClick ? { click: onClick } : undefined}
    >
      {(label || children) && <Popup>{children ?? label}</Popup>}
    </CircleMarker>
  );
}

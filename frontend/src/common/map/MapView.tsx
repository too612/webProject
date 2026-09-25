import type { CSSProperties, ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import {
  DEFAULT_WORLD_MAP_ZOOM,
  OPEN_STREET_MAP_ATTRIBUTION,
  OPEN_STREET_MAP_TILE_URL,
  WORLD_MAP_CENTER,
} from "./mapConfig";

type MapViewProps = Readonly<{
  children?: ReactNode;
  center?: [number, number];
  className?: string;
  style?: CSSProperties;
  zoom?: number;
}>;

export function MapView({
  children,
  center = WORLD_MAP_CENTER,
  className = "",
  style,
  zoom = DEFAULT_WORLD_MAP_ZOOM,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      className={`common-map ${className}`.trim()}
      style={style}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl
    >
      <TileLayer
        attribution={OPEN_STREET_MAP_ATTRIBUTION}
        url={OPEN_STREET_MAP_TILE_URL}
      />
      {children}
    </MapContainer>
  );
}

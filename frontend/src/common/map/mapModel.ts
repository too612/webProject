import type { ReactNode } from "react";

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapMarkerData = MapCoordinate & {
  id: string;
  label?: string;
};

export type MapMarkerProps = MapCoordinate & {
  children?: ReactNode;
  label?: string;
  onClick?: () => void;
};

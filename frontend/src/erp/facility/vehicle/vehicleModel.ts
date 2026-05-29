export type FacilityVehicleRow = {
  vehicleName?: string;
  plateNumber?: string;
  driver?: string;
  capacity?: number | string;
  status?: string;
  [key: string]: unknown;
};

type FacilityVehicleColumn = {
  key: keyof FacilityVehicleRow;
  label: string;
};

export const FACILITY_VEHICLE_COLUMNS: FacilityVehicleColumn[] = [
  { key: 'vehicleName', label: '차량명' },
  { key: 'plateNumber', label: '차량번호' },
  { key: 'driver', label: '담당운전자' },
  { key: 'capacity', label: '정원' },
  { key: 'status', label: '상태' },
];

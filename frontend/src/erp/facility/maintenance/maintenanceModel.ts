export type FacilityMaintenanceRow = {
  facilityName?: string;
  title?: string;
  maintenanceDate?: string;
  description?: string;
  cost?: number | string;
  status?: string;
  regDate?: string;
  [key: string]: unknown;
};

type FacilityMaintenanceColumn = {
  key: keyof FacilityMaintenanceRow;
  label: string;
};

export const FACILITY_MAINTENANCE_COLUMNS: FacilityMaintenanceColumn[] = [
  { key: 'facilityName', label: '시설명' },
  { key: 'title', label: '제목' },
  { key: 'maintenanceDate', label: '점검일' },
  { key: 'description', label: '점검내용' },
  { key: 'cost', label: '비용' },
  { key: 'status', label: '상태' },
  { key: 'regDate', label: '등록일' },
];

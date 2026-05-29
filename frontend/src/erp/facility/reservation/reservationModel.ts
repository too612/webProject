export type FacilityReservationRow = {
  facilityName?: string;
  reserverName?: string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  [key: string]: unknown;
};

type FacilityReservationColumn = {
  key: keyof FacilityReservationRow;
  label: string;
};

export const FACILITY_RESERVATION_COLUMNS: FacilityReservationColumn[] = [
  { key: 'facilityName', label: '시설명' },
  { key: 'reserverName', label: '신청자' },
  { key: 'reservationDate', label: '예약일' },
  { key: 'startTime', label: '시작시간' },
  { key: 'endTime', label: '종료시간' },
  { key: 'status', label: '상태' },
];

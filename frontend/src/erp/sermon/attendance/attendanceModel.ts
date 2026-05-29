export type SermonAttendanceRow = {
  worshipDate?: string;
  worshipType?: string;
  attendanceCount?: number | string;
  totalMembers?: number | string;
  attendanceRate?: number | string;
  [key: string]: unknown;
};

type SermonAttendanceColumn = {
  key: keyof SermonAttendanceRow;
  label: string;
};

export const SERMON_ATTENDANCE_COLUMNS: SermonAttendanceColumn[] = [
  { key: 'worshipDate', label: '예배일' },
  { key: 'worshipType', label: '예배 종류' },
  { key: 'attendanceCount', label: '출석인원' },
  { key: 'totalMembers', label: '전체인원' },
  { key: 'attendanceRate', label: '출석률' },
];

export type StatsAttendanceRow = {
  date: string;
  total: number;
  present: number;
  absent: number;
  rate: number;
};

export const STATS_ATTENDANCE_COLUMNS = [
  { key: 'date', label: '날짜' },
  { key: 'total', label: '전체' },
  { key: 'present', label: '출석' },
  { key: 'absent', label: '결석' },
  { key: 'rate', label: '출석률(%)' },
];

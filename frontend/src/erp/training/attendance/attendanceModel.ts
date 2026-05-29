export type TrainingAttendanceRow = {
  classDate?: string;
  courseName?: string;
  attendanceCount?: number | string;
  totalStudents?: number | string;
  attendanceRate?: number | string;
  [key: string]: unknown;
};

type TrainingAttendanceColumn = {
  key: keyof TrainingAttendanceRow;
  label: string;
};

export const TRAINING_ATTENDANCE_COLUMNS: TrainingAttendanceColumn[] = [
  { key: 'classDate', label: '수업일' },
  { key: 'courseName', label: '과정명' },
  { key: 'attendanceCount', label: '출석인원' },
  { key: 'totalStudents', label: '전체인원' },
  { key: 'attendanceRate', label: '출석률' },
];
export type TrainingCourseRow = {
  courseName?: string;
  instructor?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number | string;
  [key: string]: unknown;
};

type TrainingCourseColumn = {
  key: keyof TrainingCourseRow;
  label: string;
};

export const TRAINING_COURSE_COLUMNS: TrainingCourseColumn[] = [
  { key: 'courseName', label: '과정명' },
  { key: 'instructor', label: '강사' },
  { key: 'startDate', label: '시작일' },
  { key: 'endDate', label: '종료일' },
  { key: 'capacity', label: '정원' },
];
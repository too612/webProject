export type TrainingStudentRow = {
  name?: string;
  courseName?: string;
  enrollDate?: string;
  status?: string;
  [key: string]: unknown;
};

type TrainingStudentColumn = {
  key: keyof TrainingStudentRow;
  label: string;
};

export const TRAINING_STUDENT_COLUMNS: TrainingStudentColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'courseName', label: '수강 과정' },
  { key: 'enrollDate', label: '등록일' },
  { key: 'status', label: '수강 상태' },
];
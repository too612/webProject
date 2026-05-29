export type TrainingCompleteRow = {
    name?: string;
    courseName?: string;
    completeDate?: string;
    grade?: string;
    [key: string]: unknown;
};

type TrainingCompleteColumn = {
    key: keyof TrainingCompleteRow;
    label: string;
};

export const TRAINING_COMPLETE_COLUMNS: TrainingCompleteColumn[] = [
    { key: 'name', label: '이름' },
    { key: 'courseName', label: '과정명' },
    { key: 'completeDate', label: '수료일' },
    { key: 'grade', label: '성적' },
];

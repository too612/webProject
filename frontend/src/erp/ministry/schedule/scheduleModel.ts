export type MinistryScheduleRow = {
    scheduleDate?: string;
    deptName?: string;
    title?: string;
    location?: string;
    status?: string;
    [key: string]: unknown;
};

type MinistryScheduleColumn = {
    key: keyof MinistryScheduleRow;
    label: string;
};

export const MINISTRY_SCHEDULE_COLUMNS: MinistryScheduleColumn[] = [
    { key: 'scheduleDate', label: '일정일' },
    { key: 'deptName', label: '부서명' },
    { key: 'title', label: '일정 제목' },
    { key: 'location', label: '장소' },
    { key: 'status', label: '상태' },
];

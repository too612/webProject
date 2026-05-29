export type MinistryVolunteerRow = {
    name?: string;
    deptName?: string;
    role?: string;
    startDate?: string;
    status?: string;
    [key: string]: unknown;
};

type MinistryVolunteerColumn = {
    key: keyof MinistryVolunteerRow;
    label: string;
};

export const MINISTRY_VOLUNTEER_COLUMNS: MinistryVolunteerColumn[] = [
    { key: 'name', label: '이름' },
    { key: 'deptName', label: '부서명' },
    { key: 'role', label: '역할' },
    { key: 'startDate', label: '시작일' },
    { key: 'status', label: '상태' },
];

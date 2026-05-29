export type MinistryDepartmentRow = {
    deptName?: string;
    leader?: string;
    memberCount?: number | string;
    category?: string;
    [key: string]: unknown;
};

type MinistryDepartmentColumn = {
    key: keyof MinistryDepartmentRow;
    label: string;
};

export const MINISTRY_DEPARTMENT_COLUMNS: MinistryDepartmentColumn[] = [
    { key: 'deptName', label: '부서명' },
    { key: 'leader', label: '담당자' },
    { key: 'memberCount', label: '인원수' },
    { key: 'category', label: '종류' },
];

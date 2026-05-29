export type MinistryReportRow = {
    reportDate?: string;
    deptName?: string;
    title?: string;
    author?: string;
    [key: string]: unknown;
};

type MinistryReportColumn = {
    key: keyof MinistryReportRow;
    label: string;
};

export const MINISTRY_REPORT_COLUMNS: MinistryReportColumn[] = [
    { key: 'reportDate', label: '보고일' },
    { key: 'deptName', label: '부서명' },
    { key: 'title', label: '보고 제목' },
    { key: 'author', label: '작성자' },
];

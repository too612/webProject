export type CommunitySaintJobRow = {
    title?: string;
    company?: string;
    type?: string;
    date?: string;
    status?: string;
    [key: string]: unknown;
};

type CommunitySaintJobColumn = {
    key: keyof CommunitySaintJobRow;
    label: string;
};

export const COMMUNITY_SAINT_JOB_COLUMNS: CommunitySaintJobColumn[] = [
    { key: 'title', label: '제목' },
    { key: 'company', label: '업체/개인' },
    { key: 'type', label: '유형' },
    { key: 'date', label: '등록일' },
    { key: 'status', label: '상태' },
];
export type CommunitySaintPrayRow = {
    name?: string;
    type?: string;
    request?: string;
    date?: string;
    status?: string;
    [key: string]: unknown;
};

type CommunitySaintPrayColumn = {
    key: keyof CommunitySaintPrayRow;
    label: string;
};

export const COMMUNITY_SAINT_PRAY_COLUMNS: CommunitySaintPrayColumn[] = [
    { key: 'name', label: '이름' },
    { key: 'type', label: '유형' },
    { key: 'request', label: '기도 제목' },
    { key: 'date', label: '등록일' },
    { key: 'status', label: '상태' },
];
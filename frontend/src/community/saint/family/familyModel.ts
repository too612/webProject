export type CommunitySaintFamilyRow = {
    name?: string;
    type?: string;
    date?: string;
    contact?: string;
    [key: string]: unknown;
};

type CommunitySaintFamilyColumn = {
    key: keyof CommunitySaintFamilyRow;
    label: string;
};

export const COMMUNITY_SAINT_FAMILY_COLUMNS: CommunitySaintFamilyColumn[] = [
    { key: 'name', label: '가정/성도' },
    { key: 'type', label: '유형' },
    { key: 'date', label: '일정' },
    { key: 'contact', label: '연락처' },
];
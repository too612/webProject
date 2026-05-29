export type CommunityFacilitiesDiningRow = {
    date?: string;
    task?: string;
    owner?: string;
    status?: string;
    [key: string]: unknown;
};

type CommunityFacilitiesDiningColumn = {
    key: keyof CommunityFacilitiesDiningRow;
    label: string;
};

export const COMMUNITY_FACILITIES_DINING_COLUMNS: CommunityFacilitiesDiningColumn[] = [
    { key: 'date', label: '일정' },
    { key: 'task', label: '업무' },
    { key: 'owner', label: '담당자' },
    { key: 'status', label: '상태' },
];
export type CommunityFacilitiesPrayerRow = {
    date?: string;
    task?: string;
    owner?: string;
    status?: string;
    [key: string]: unknown;
};

type CommunityFacilitiesPrayerColumn = {
    key: keyof CommunityFacilitiesPrayerRow;
    label: string;
};

export const COMMUNITY_FACILITIES_PRAYER_COLUMNS: CommunityFacilitiesPrayerColumn[] = [
    { key: 'date', label: '일정' },
    { key: 'task', label: '업무' },
    { key: 'owner', label: '담당자' },
    { key: 'status', label: '상태' },
];
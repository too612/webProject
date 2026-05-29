export type CommunityGroupManagerRow = {
    district?: string;
    leader?: string;
    members?: number | string;
    attendance?: number | string;
    status?: string;
    [key: string]: unknown;
};

type CommunityGroupManagerColumn = {
    key: keyof CommunityGroupManagerRow;
    label: string;
};

export const COMMUNITY_GROUP_MANAGER_COLUMNS: CommunityGroupManagerColumn[] = [
    { key: 'district', label: '구역' },
    { key: 'leader', label: '리더' },
    { key: 'members', label: '인원' },
    { key: 'attendance', label: '출석률' },
    { key: 'status', label: '상태' },
];
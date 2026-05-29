export type CommunityGroupB2Row = {
    name?: string;
    role?: string;
    age?: number | string;
    phone?: string;
    attendance?: number | string;
    [key: string]: unknown;
};

type CommunityGroupB2Column = {
    key: keyof CommunityGroupB2Row;
    label: string;
};

export const COMMUNITY_GROUP_B2_COLUMNS: CommunityGroupB2Column[] = [
    { key: 'name', label: '이름' },
    { key: 'role', label: '역할' },
    { key: 'age', label: '나이' },
    { key: 'phone', label: '전화번호' },
    { key: 'attendance', label: '출석률' },
];
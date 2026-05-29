export type CommunityGroupA1Row = {
    name?: string;
    role?: string;
    age?: number | string;
    phone?: string;
    attendance?: number | string;
    [key: string]: unknown;
};

type CommunityGroupA1Column = {
    key: keyof CommunityGroupA1Row;
    label: string;
};

export const COMMUNITY_GROUP_A1_COLUMNS: CommunityGroupA1Column[] = [
    { key: 'name', label: '이름' },
    { key: 'role', label: '역할' },
    { key: 'age', label: '나이' },
    { key: 'phone', label: '전화번호' },
    { key: 'attendance', label: '출석률' },
];
export type CommunitySaintSalesRow = {
    item?: string;
    seller?: string;
    price?: string | number;
    status?: string;
    [key: string]: unknown;
};

type CommunitySaintSalesColumn = {
    key: keyof CommunitySaintSalesRow;
    label: string;
};

export const COMMUNITY_SAINT_SALES_COLUMNS: CommunitySaintSalesColumn[] = [
    { key: 'item', label: '물건' },
    { key: 'seller', label: '판매자' },
    { key: 'price', label: '가격' },
    { key: 'status', label: '상태' },
];
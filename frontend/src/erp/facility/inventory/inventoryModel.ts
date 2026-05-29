export type FacilityInventoryRow = {
  itemName?: string;
  category?: string;
  quantity?: number | string;
  unit?: string;
  location?: string;
  status?: string;
  regDate?: string;
  [key: string]: unknown;
};

type FacilityInventoryColumn = {
  key: keyof FacilityInventoryRow;
  label: string;
};

export const FACILITY_INVENTORY_COLUMNS: FacilityInventoryColumn[] = [
  { key: 'itemName', label: '비품명' },
  { key: 'category', label: '종류' },
  { key: 'quantity', label: '수량' },
  { key: 'unit', label: '단위' },
  { key: 'location', label: '보관위치' },
  { key: 'status', label: '상태' },
  { key: 'regDate', label: '등록일' },
];

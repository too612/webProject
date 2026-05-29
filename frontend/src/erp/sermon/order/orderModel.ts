export type SermonOrderRow = {
  worshipDate?: string;
  worshipType?: string;
  orderTitle?: string;
  officiant?: string;
  [key: string]: unknown;
};

type SermonOrderColumn = {
  key: keyof SermonOrderRow;
  label: string;
};

export const SERMON_ORDER_COLUMNS: SermonOrderColumn[] = [
  { key: 'worshipDate', label: '예배일' },
  { key: 'worshipType', label: '예배 종류' },
  { key: 'orderTitle', label: '순서 제목' },
  { key: 'officiant', label: '담당자' },
];

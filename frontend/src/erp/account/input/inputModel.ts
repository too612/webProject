export type AccountInputRow = {
  transDate?: string;
  category?: string;
  transType?: string;
  amount?: string | number;
  memo?: string;
  [key: string]: unknown;
};

type AccountInputColumn = {
  key: keyof AccountInputRow;
  label: string;
};

export const ACCOUNT_INPUT_COLUMNS: AccountInputColumn[] = [
  { key: 'transDate', label: '거래일' },
  { key: 'category', label: '구분' },
  { key: 'transType', label: '유형' },
  { key: 'amount', label: '금액' },
  { key: 'memo', label: '비고' },
];

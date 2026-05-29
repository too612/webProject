export type NewcomerRow = {
  name?: string;
  phone?: string;
  visitDate?: string;
  invitedBy?: string;
  status?: string;
  [key: string]: unknown;
};

type NewcomerColumn = {
  key: keyof NewcomerRow;
  label: string;
};

export const NEWCOMER_COLUMNS: NewcomerColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'phone', label: '연락처' },
  { key: 'visitDate', label: '방문일' },
  { key: 'invitedBy', label: '인도자' },
  { key: 'status', label: '상태' },
];

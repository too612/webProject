export type ChangeRow = {
  name?: string;
  changeType?: string;
  changeDate?: string;
  reason?: string;
  [key: string]: unknown;
};

type ChangeColumn = {
  key: keyof ChangeRow;
  label: string;
};

export const CHANGE_COLUMNS: ChangeColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'changeType', label: '변경유형' },
  { key: 'changeDate', label: '변경일' },
  { key: 'reason', label: '사유' },
];

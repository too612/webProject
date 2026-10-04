export type PersonnelMoveRow = {
  name?: string;
  changeType?: string;
  changeDate?: string;
  reason?: string;
  [key: string]: unknown;
};

type PersonnelMoveColumn = {
  key: keyof PersonnelMoveRow;
  label: string;
};

export const PERSONNELMOVE_COLUMNS: PersonnelMoveColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'changeType', label: '변경유형' },
  { key: 'changeDate', label: '변경일' },
  { key: 'reason', label: '사유' },
];

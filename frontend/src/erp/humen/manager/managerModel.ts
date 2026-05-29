export type ManagerRow = {
  name?: string;
  district?: string;
  phone?: string;
  registeredAt?: string;
  [key: string]: unknown;
};

type ManagerColumn = {
  key: keyof ManagerRow;
  label: string;
};

export const MANAGER_COLUMNS: ManagerColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'district', label: '구역' },
  { key: 'phone', label: '연락처' },
  { key: 'registeredAt', label: '등록일' },
];

export type SystemUserManagerRow = {
  id?: string;
  name?: string;
  role?: string;
  status?: string;
  lastLogin?: string;
  [key: string]: unknown;
};

type SystemUserManagerColumn = {
  key: keyof SystemUserManagerRow | 'actions';
  label: string;
};

export const SYSTEM_USER_MANAGER_COLUMNS: SystemUserManagerColumn[] = [
  { key: 'id', label: '아이디' },
  { key: 'name', label: '이름' },
  { key: 'role', label: '역할' },
  { key: 'status', label: '상태' },
  { key: 'lastLogin', label: '최근 로그인' },
  { key: 'actions', label: '관리' },
];

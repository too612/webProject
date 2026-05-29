export type SystemConfigMenuRow = {
  menuId?: string;
  menuName?: string;
  path?: string;
  level?: number;
  visibleRole?: string;
  [key: string]: unknown;
};

type SystemConfigMenuColumn = {
  key: keyof SystemConfigMenuRow | 'actions';
  label: string;
};

export const SYSTEM_CONFIG_MENU_COLUMNS: SystemConfigMenuColumn[] = [
  { key: 'menuId', label: '메뉴 ID' },
  { key: 'menuName', label: '메뉴명' },
  { key: 'path', label: '경로' },
  { key: 'level', label: '레벨' },
  { key: 'visibleRole', label: '접근 가능 역할' },
  { key: 'actions', label: '관리' },
];

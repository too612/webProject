export type SystemUserRoleRow = {
  roleId?: string;
  roleName?: string;
  description?: string;
  userCount?: number;
  [key: string]: unknown;
};

type SystemUserRoleColumn = {
  key: keyof SystemUserRoleRow | 'actions';
  label: string;
};

export const SYSTEM_USER_ROLE_COLUMNS: SystemUserRoleColumn[] = [
  { key: 'roleId', label: '역할 코드' },
  { key: 'roleName', label: '역할명' },
  { key: 'description', label: '설명' },
  { key: 'userCount', label: '사용자 수' },
  { key: 'actions', label: '관리' },
];

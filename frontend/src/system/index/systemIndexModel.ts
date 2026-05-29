export type SystemIndexData = {
  activeAccounts: number;
  todayWarnings: number;
  backupSuccessRate: string;
  pendingRoleRequests: number;
};

export const EMPTY_SYSTEM_INDEX: SystemIndexData = {
  activeAccounts: 0,
  todayWarnings: 0,
  backupSuccessRate: '0.0%',
  pendingRoleRequests: 0,
};

export const SYSTEM_INDEX_QUICK_LINKS = [
  { label: '사용자계정관리', to: '/system/user/manager' },
  { label: '권한역할관리', to: '/system/user/role' },
  { label: '공통코드관리', to: '/system/config/code' },
  { label: '메뉴권한관리', to: '/system/config/menu' },
  { label: '시스템로그조회', to: '/system/log/system' },
  { label: '감사추적관리', to: '/system/log/audit' },
  { label: '백업정책관리', to: '/system/backup/policy' },
  { label: '복구이력관리', to: '/system/backup/history' },
] as const;

export const SYSTEM_INDEX_GROUPS = [
  { title: '사용자/권한관리', links: SYSTEM_INDEX_QUICK_LINKS.slice(0, 2) },
  { title: '운영설정관리', links: SYSTEM_INDEX_QUICK_LINKS.slice(2, 4) },
  { title: '로그/감사관리', links: SYSTEM_INDEX_QUICK_LINKS.slice(4, 6) },
  { title: '백업/복구관리', links: SYSTEM_INDEX_QUICK_LINKS.slice(6, 8) },
] as const;

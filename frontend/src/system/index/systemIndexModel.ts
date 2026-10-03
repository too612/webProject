export type SystemIndexData = {
  source: 'LIVE';
  asOf: string;
  periodStart: string;
  menuCount: number;
  routedMenuCount: number;
  programCount: number;
  activeProgramCount: number;
  roleCount: number;
  activeRoleCount: number;
  codeCount: number;
  activeCodeCount: number;
  periodCodeCount: number;
  periodProgramCount: number;
  monthlyRegistrations: { month: string; codeCount: number; programCount: number }[];
  programStatus: { label: string; count: number }[];
  roleCoverage: { label: string; readCount: number; writeCount: number }[];
  recentChanges: { kind: SystemChangeKind; label: string; changedAt: string }[];
};

export type SystemChangeKind = 'MENU' | 'CODE' | 'ROLE' | 'PROGRAM';

export const SYSTEM_CHANGE_KINDS: Record<SystemChangeKind, { label: string; path: string }> = {
  MENU: { label: '메뉴', path: '/system/config/menu' },
  CODE: { label: '공통코드', path: '/system/config/code' },
  ROLE: { label: '역할', path: '/system/user/role' },
  PROGRAM: { label: '프로그램', path: '/system/config/menu' },
};

export const SYSTEM_INDEX_QUICK_LINKS = [
  { path: '/system/config/menu', note: '메뉴와 접근 설정 확인' },
  { path: '/system/user/role', note: '역할 관리 화면 열기' },
  { path: '/system/config/code', note: '코드 관리 화면 열기' },
  { path: '/system/user/manager', note: '계정 관리 화면 열기' },
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isLabel(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function monthIndex(value: string): number {
  return Number(value.slice(0, 4)) * 12 + Number(value.slice(5, 7)) - 1;
}

export function isSystemIndexData(value: unknown): value is SystemIndexData {
  if (!isRecord(value) || value.source !== 'LIVE' || !isDate(value.asOf) || !isDate(value.periodStart)) return false;
  const counts = ['menuCount', 'routedMenuCount', 'programCount', 'activeProgramCount', 'roleCount',
    'activeRoleCount', 'codeCount', 'activeCodeCount', 'periodCodeCount', 'periodProgramCount'] as const;
  for (const key of counts) if (!isCount(value[key])) return false;
  if (!isCount(value.menuCount) || !isCount(value.routedMenuCount)
    || !isCount(value.programCount) || !isCount(value.activeProgramCount)
    || !isCount(value.roleCount) || !isCount(value.activeRoleCount)
    || !isCount(value.codeCount) || !isCount(value.activeCodeCount)) return false;
  if (value.routedMenuCount > value.menuCount || value.activeProgramCount > value.programCount
    || value.activeRoleCount > value.roleCount || value.activeCodeCount > value.codeCount
    || Number(value.periodCodeCount) > value.codeCount || Number(value.periodProgramCount) > value.programCount) return false;

  if (!Array.isArray(value.monthlyRegistrations) || value.monthlyRegistrations.length !== 6
    || !value.monthlyRegistrations.every((item: unknown) => isRecord(item)
      && typeof item.month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(item.month)
      && isCount(item.codeCount) && isCount(item.programCount))) return false;
  const months: SystemIndexData['monthlyRegistrations'] = value.monthlyRegistrations;
  const firstMonth = monthIndex(value.asOf) - 5;
  if (value.periodStart.slice(8) !== '01' || monthIndex(value.periodStart) !== firstMonth
    || months.some((item, index) => monthIndex(item.month) !== firstMonth + index)
    || months.reduce((sum, item) => sum + item.codeCount, 0) !== value.periodCodeCount
    || months.reduce((sum, item) => sum + item.programCount, 0) !== value.periodProgramCount) return false;

  if (!Array.isArray(value.programStatus) || !value.programStatus.every((item: unknown) =>
    isRecord(item) && (item.label === '사용' || item.label === '미사용') && isCount(item.count) && item.count > 0)) return false;
  const statuses: SystemIndexData['programStatus'] = value.programStatus;
  if (new Set(statuses.map((item) => item.label)).size !== statuses.length
    || statuses.reduce((sum, item) => sum + item.count, 0) !== value.programCount
    || statuses.filter((item) => item.label === '사용').reduce((sum, item) => sum + item.count, 0) !== value.activeProgramCount) return false;

  if (!Array.isArray(value.roleCoverage) || value.roleCoverage.length !== value.activeRoleCount
    || !value.roleCoverage.every((item: unknown) => isRecord(item) && isLabel(item.label)
      && isCount(item.readCount) && item.readCount <= Number(value.activeProgramCount)
      && isCount(item.writeCount) && item.writeCount <= Number(value.activeProgramCount))) return false;
  return Array.isArray(value.recentChanges) && value.recentChanges.length <= 8
    && value.recentChanges.every((item: unknown) => isRecord(item)
      && typeof item.kind === 'string' && Object.prototype.hasOwnProperty.call(SYSTEM_CHANGE_KINDS, item.kind)
      && isLabel(item.label) && typeof item.changedAt === 'string'
      && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(item.changedAt));
}

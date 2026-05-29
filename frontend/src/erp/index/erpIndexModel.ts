export type ErpIndexTaskItem = {
  id: string;
  title: string;
  status: string;
  date: string;
};

export type ErpIndexData = {
  totalMembers: number;
  sermonPendingCount: number;
  accountRecordCount: number;
  recentSermonTasks: ErpIndexTaskItem[];
};

export type ErpShortcut = {
  label: string;
  to: string;
};

export const ERP_INDEX_SHORTCUTS: ErpShortcut[] = [
  { label: '통계 대시보드', to: '/erp/stats/dashboard' },
  { label: '회계 보고서', to: '/erp/account/report' },
  { label: '메시지', to: '/erp/comm/message' },
  { label: '행사 캘린더', to: '/erp/event/calendar' },
  { label: '설교 작성', to: '/erp/sermon/write' },
  { label: '사역 보고', to: '/erp/ministry/report' },
];

export const EMPTY_ERP_INDEX_DATA: ErpIndexData = {
  totalMembers: 0,
  sermonPendingCount: 0,
  accountRecordCount: 0,
  recentSermonTasks: [],
};

export function getTaskStatusStyle(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized.includes('URGENT')) return 'bg-red-100 text-red-700';
  if (normalized.includes('PENDING') || normalized.includes('DRAFT')) return 'bg-amber-100 text-amber-700';
  if (normalized.includes('DONE') || normalized.includes('COMPLETE') || normalized.includes('ACTIVE')) return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-100 text-gray-600';
}

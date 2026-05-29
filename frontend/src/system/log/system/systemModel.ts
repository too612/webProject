export type SystemLogSystemRow = {
  timestamp?: string;
  level?: string;
  category?: string;
  message?: string;
  ip?: string;
  [key: string]: unknown;
};

type SystemLogSystemColumn = {
  key: keyof SystemLogSystemRow;
  label: string;
};

export const SYSTEM_LOG_SYSTEM_COLUMNS: SystemLogSystemColumn[] = [
  { key: 'timestamp', label: '시간' },
  { key: 'level', label: '레벨' },
  { key: 'category', label: '분류' },
  { key: 'message', label: '메시지' },
  { key: 'ip', label: 'IP' },
];

export const SYSTEM_LOG_LEVEL_CLASS: Record<string, string> = {
  INFO: 'badge-active',
  WARN: 'badge-warning',
  ERROR: 'badge-danger',
};

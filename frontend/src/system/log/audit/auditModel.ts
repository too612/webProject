export type SystemLogAuditRow = {
  timestamp?: string;
  userId?: string;
  action?: string;
  target?: string;
  result?: string;
  [key: string]: unknown;
};

type SystemLogAuditColumn = {
  key: keyof SystemLogAuditRow;
  label: string;
};

export const SYSTEM_LOG_AUDIT_COLUMNS: SystemLogAuditColumn[] = [
  { key: 'timestamp', label: '시간' },
  { key: 'userId', label: '사용자' },
  { key: 'action', label: '액션' },
  { key: 'target', label: '대상' },
  { key: 'result', label: '결과' },
];

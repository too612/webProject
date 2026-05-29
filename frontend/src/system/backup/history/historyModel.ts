export type SystemBackupHistoryRow = {
  backupId?: string;
  target?: string;
  startTime?: string;
  endTime?: string;
  size?: string;
  result?: string;
  [key: string]: unknown;
};

type SystemBackupHistoryColumn = {
  key: keyof SystemBackupHistoryRow | 'actions';
  label: string;
};

export const SYSTEM_BACKUP_HISTORY_COLUMNS: SystemBackupHistoryColumn[] = [
  { key: 'backupId', label: '백업 ID' },
  { key: 'target', label: '대상' },
  { key: 'startTime', label: '시작시간' },
  { key: 'endTime', label: '종료시간' },
  { key: 'size', label: '크기' },
  { key: 'result', label: '결과' },
  { key: 'actions', label: '관리' },
];

export type SystemBackupPolicyRow = {
  policyId?: string;
  target?: string;
  schedule?: string;
  retention?: string;
  status?: string;
  lastRun?: string;
  [key: string]: unknown;
};

type SystemBackupPolicyColumn = {
  key: keyof SystemBackupPolicyRow | 'actions';
  label: string;
};

export const SYSTEM_BACKUP_POLICY_COLUMNS: SystemBackupPolicyColumn[] = [
  { key: 'policyId', label: '정책 ID' },
  { key: 'target', label: '백업 대상' },
  { key: 'schedule', label: '실행 주기' },
  { key: 'retention', label: '보존 기간' },
  { key: 'status', label: '상태' },
  { key: 'lastRun', label: '최근 실행' },
  { key: 'actions', label: '관리' },
];

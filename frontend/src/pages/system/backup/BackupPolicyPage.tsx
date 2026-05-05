import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type PolicyRow = {
  policyId: string;
  target: string;
  schedule: string;
  retention: string;
  status: string;
  lastRun: string;
  [key: string]: unknown;
};

export default function BackupPolicyPage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.backup.getPolicy(q) as unknown) as Promise<SystemListResult<PolicyRow>>,
    []
  );

  const columns = [
    { key: 'policyId', label: '정책 ID', render: (row: PolicyRow) => <code>{row.policyId}</code> },
    { key: 'target', label: '백업 대상' },
    { key: 'schedule', label: '실행 주기' },
    { key: 'retention', label: '보존 기간' },
    {
      key: 'status',
      label: '상태',
      render: (row: PolicyRow) => (
        <span className={`community-badge ${row.status === '활성' ? 'badge-active' : 'badge-inactive'}`}>{row.status}</span>
      ),
    },
    { key: 'lastRun', label: '최근 실행' },
    {
      key: 'actions',
      label: '관리',
      render: () => (
        <>
          <button type="button" className="btn btn-sm btn-secondary">수정</button>
          <button type="button" className="btn btn-sm btn-secondary">즉시실행</button>
        </>
      ),
    },
  ];

  return (
    <SystemListPage<PolicyRow>
      title="백업 정책 관리"
      description="자동 백업 스케줄과 보관 정책을 정책 관리자가 관리합니다."
      columns={columns}
      fetchFn={fetchFn}
      onPrimaryAction={() => undefined}
      primaryActionLabel="정책 추가"
    />
  );
}
import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type AuditRow = {
  timestamp: string;
  userId: string;
  action: string;
  target: string;
  result: string;
  [key: string]: unknown;
};

export default function LogAuditPage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.log.getAudit(q) as unknown) as Promise<SystemListResult<AuditRow>>,
    []
  );

  const columns = [
    { key: 'timestamp', label: '시간' },
    { key: 'userId', label: '사용자', render: (row: AuditRow) => <code>{row.userId}</code> },
    { key: 'action', label: '액션' },
    { key: 'target', label: '대상' },
    {
      key: 'result',
      label: '결과',
      render: (row: AuditRow) => (
        <span className={`community-badge ${row.result === '성공' ? 'badge-active' : 'badge-danger'}`}>{row.result}</span>
      ),
    },
  ];

  return (
    <SystemListPage<AuditRow>
      title="감사 추적 관리"
      description="주요 사용자의 접속 및 변경 이력을 감사 목적으로 관리합니다."
      columns={columns}
      fetchFn={fetchFn}
      searchable
      searchPlaceholder="사용자 ID 또는 액션 검색"
      onPrimaryAction={() => undefined}
      primaryActionLabel="감사내역 다운로드"
    />
  );
}
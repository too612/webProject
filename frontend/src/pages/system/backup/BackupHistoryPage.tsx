import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type HistoryRow = {
  backupId: string;
  target: string;
  startTime: string;
  endTime: string;
  size: string;
  result: string;
  [key: string]: unknown;
};

export default function BackupHistoryPage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.backup.getHistory(q) as unknown) as Promise<SystemListResult<HistoryRow>>,
    []
  );

  const columns = [
    { key: 'backupId', label: '백업 ID', render: (row: HistoryRow) => <code>{row.backupId}</code> },
    { key: 'target', label: '대상' },
    { key: 'startTime', label: '시작시간' },
    { key: 'endTime', label: '종료시간' },
    { key: 'size', label: '크기' },
    {
      key: 'result',
      label: '결과',
      render: (row: HistoryRow) => (
        <span className={`community-badge ${row.result === '성공' ? 'badge-active' : 'badge-danger'}`}>{row.result}</span>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      render: (row: HistoryRow) =>
        row.result === '성공' ? <button type="button" className="btn btn-sm btn-secondary">복구</button> : '-',
    },
  ];

  return (
    <SystemListPage<HistoryRow>
      title="복구 이력 관리"
      description="백업 파일의 복구 요청 이력을 조회하고 상태를 관리합니다."
      columns={columns}
      fetchFn={fetchFn}
    />
  );
}
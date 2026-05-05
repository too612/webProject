import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type LogRow = {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  ip: string;
  [key: string]: unknown;
};

const LEVEL_CLASS: Record<string, string> = {
  INFO: 'badge-active',
  WARN: 'badge-warning',
  ERROR: 'badge-danger',
};

export default function LogSystemPage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.log.getSystem(q) as unknown) as Promise<SystemListResult<LogRow>>,
    []
  );

  const columns = [
    { key: 'timestamp', label: '시간' },
    {
      key: 'level',
      label: '레벨',
      render: (row: LogRow) => <span className={`community-badge ${LEVEL_CLASS[row.level] ?? ''}`}>{row.level}</span>,
    },
    { key: 'category', label: '분류' },
    { key: 'message', label: '메시지' },
    { key: 'ip', label: 'IP' },
  ];

  return (
    <SystemListPage<LogRow>
      title="시스템 로그 조회"
      description="시스템 각 모듈에서 발생한 이벤트 로그를 확인하고 이상을 분석합니다."
      columns={columns}
      fetchFn={fetchFn}
      searchable
      searchPlaceholder="메시지 검색"
      onPrimaryAction={() => undefined}
      primaryActionLabel="로그 내보내기"
    />
  );
}
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'scheduleDate', label: '일정일' },
  { key: 'deptName', label: '부서명' },
  { key: 'title', label: '일정 제목' },
  { key: 'location', label: '장소' },
  { key: 'status', label: '상태' },
];

export default function MinistrySchedulePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.ministry.getSchedule(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="사역 일정"
      description="부서별 사역 일정을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
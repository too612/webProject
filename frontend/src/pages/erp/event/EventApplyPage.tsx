import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'eventName', label: '행사명' },
  { key: 'applicantName', label: '신청자' },
  { key: 'applyDate', label: '신청일' },
  { key: 'status', label: '상태' },
];

export default function EventApplyPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.event.getApply(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="행사 신청"
      description="행사 신청 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
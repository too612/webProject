import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'requester', label: '신청자' },
  { key: 'content', label: '기도 내용' },
  { key: 'createdAt', label: '신청일' },
  { key: 'status', label: '상태' },
];

export default function CommPrayerPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.comm.getPrayer(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="기도신청"
      description="기도 신청 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
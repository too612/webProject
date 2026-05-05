import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'phone', label: '연락처' },
  { key: 'visitDate', label: '방문일' },
  { key: 'invitedBy', label: '인도자' },
  { key: 'status', label: '상태' },
];

export default function HumenNewcomerPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.humen.getNewcomer(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="새신자 관리"
      description="새신자 등록 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'worshipDate', label: '예배일' },
  { key: 'worshipType', label: '예배 종류' },
  { key: 'orderTitle', label: '순서 제목' },
  { key: 'officiant', label: '담당자' },
];

export default function SermonOrderPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.sermon.getOrder(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="예배 순서"
      description="예배 순서를 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
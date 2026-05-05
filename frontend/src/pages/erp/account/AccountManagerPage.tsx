import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'transDate', label: '거래일' },
  { key: 'category', label: '구분' },
  { key: 'transType', label: '유형' },
  { key: 'amount', label: '금액' },
  { key: 'memo', label: '비고' },
];

export default function AccountManagerPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.account.getManager(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="회계 관리"
      description="수입/지출 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
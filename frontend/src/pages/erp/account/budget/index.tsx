import { useCallback } from 'react';
import ErpListPage from '../../shared/ErpListPage';
import { erpApi } from '../../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'budgetYear', label: '년도' },
  { key: 'category', label: '항목' },
  { key: 'plannedAmount', label: '예산' },
  { key: 'status', label: '상태' },
  { key: 'description', label: '비고' },
];

export default function AccountBudgetPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.account.getBudget(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="예산 관리"
      description="예산 항목을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
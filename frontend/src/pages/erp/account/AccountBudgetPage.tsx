import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'budgetYear', label: '회계연도' },
  { key: 'category', label: '구분' },
  { key: 'budgetAmount', label: '예산액' },
  { key: 'executedAmount', label: '집행액' },
  { key: 'remainAmount', label: '잔액' },
];

export default function AccountBudgetPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.account.getBudget(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="예산 관리"
      description="연간 예산 편성 및 집행 현황을 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
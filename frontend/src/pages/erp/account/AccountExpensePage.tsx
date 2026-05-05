import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'expenseDate', label: '지출일' },
  { key: 'category', label: '구분' },
  { key: 'amount', label: '금액' },
  { key: 'payee', label: '지급처' },
  { key: 'approver', label: '결재자' },
];

export default function AccountExpensePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.account.getExpense(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="지출결의"
      description="지출결의서 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'reportDate', label: '보고일' },
  { key: 'deptName', label: '부서명' },
  { key: 'title', label: '보고 제목' },
  { key: 'author', label: '작성자' },
];

export default function MinistryReportPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.ministry.getReport(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="사역 보고"
      description="부서별 사역 보고서를 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
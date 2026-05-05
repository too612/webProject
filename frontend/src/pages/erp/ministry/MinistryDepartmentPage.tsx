import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'deptName', label: '부서명' },
  { key: 'leader', label: '담당자' },
  { key: 'memberCount', label: '인원수' },
  { key: 'category', label: '종류' },
];

export default function MinistryDepartmentPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.ministry.getDepartment(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="부서 관리"
      description="사역 부서 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
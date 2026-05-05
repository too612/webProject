import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'deptName', label: '부서명' },
  { key: 'role', label: '역할' },
  { key: 'startDate', label: '시작일' },
  { key: 'status', label: '상태' },
];

export default function MinistryVolunteerPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.ministry.getVolunteer(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="봉사자 관리"
      description="부서별 봉사자 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
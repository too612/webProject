import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'docNo', label: '문서번호' },
  { key: 'title', label: '제목' },
  { key: 'requester', label: '기안자' },
  { key: 'approver', label: '결재자' },
  { key: 'status', label: '결재상태' },
  { key: 'requestedAt', label: '기안일' },
];

export default function AdminApprovalPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.admin.getApproval(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="결재 관리"
      description="문서 결재 신청 및 처리 현황을 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
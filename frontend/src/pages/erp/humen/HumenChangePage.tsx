import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'changeType', label: '변경유형' },
  { key: 'changeDate', label: '변경일' },
  { key: 'reason', label: '사유' },
];

export default function HumenChangePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.humen.getChange(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="이동 현황"
      description="성도 이동(등록/이적/전입/전출) 현황을 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'district', label: '구역' },
  { key: 'phone', label: '연락처' },
  { key: 'registeredAt', label: '등록일' },
];

export default function HumenManagerPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.humen.getManager(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="성도 관리"
      description="등록된 성도 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
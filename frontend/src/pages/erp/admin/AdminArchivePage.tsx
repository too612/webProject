import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'docId', label: '문서 ID' },
  { key: 'title', label: '문서 제목' },
  { key: 'category', label: '분류' },
  { key: 'registeredAt', label: '등록일' },
  { key: 'registeredBy', label: '등록자' },
];

export default function AdminArchivePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.admin.getArchive(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="문서 보관"
      description="지정 문서를 분류별로 보관하고 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}

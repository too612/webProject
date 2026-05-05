import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '설교 제목' },
  { key: 'preacher', label: '설교자' },
  { key: 'scripture', label: '본문' },
  { key: 'sermonDate', label: '설교일' },
];

export default function SermonManagerPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.sermon.getManager(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="설교 관리"
      description="등록된 설교 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
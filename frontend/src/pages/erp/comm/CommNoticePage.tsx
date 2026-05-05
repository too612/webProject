import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '제목' },
  { key: 'author', label: '작성자' },
  { key: 'createdAt', label: '작성일' },
  { key: 'viewCount', label: '조회수' },
];

export default function CommNoticePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.comm.getNotice(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="공지사항"
      description="전체 공지사항을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
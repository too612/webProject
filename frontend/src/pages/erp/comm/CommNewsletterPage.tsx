import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '소식지 제목' },
  { key: 'period', label: '발행기간' },
  { key: 'publishedAt', label: '발행일' },
  { key: 'viewCount', label: '조회수' },
];

export default function CommNewsletterPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.comm.getNewsletter(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="소식지"
      description="발행된 소식지 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
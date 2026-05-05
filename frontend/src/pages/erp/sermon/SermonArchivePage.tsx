import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '설교 제목' },
  { key: 'preacher', label: '설교자' },
  { key: 'mediaType', label: '미디어유형' },
  { key: 'uploadDate', label: '업로드일' },
  { key: 'viewCount', label: '조회수' },
];

export default function SermonArchivePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.sermon.getArchive(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="설교 아카이브"
      description="설교 영상 및 아카이브를 보관하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
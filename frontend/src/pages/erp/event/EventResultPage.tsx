import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'eventName', label: '행사명' },
  { key: 'eventDate', label: '행사일' },
  { key: 'totalParticipants', label: '참가인원' },
  { key: 'result', label: '결과' },
  { key: 'author', label: '작성자' },
];

export default function EventResultPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.event.getResult(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="행사 결과"
      description="행사 결과 보고서를 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
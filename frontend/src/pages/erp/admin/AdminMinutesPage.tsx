import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'minuteNo', label: '회의록번호' },
  { key: 'title', label: '회의 제목' },
  { key: 'meetingDate', label: '회의일' },
  { key: 'author', label: '작성자' },
  { key: 'attendeeCount', label: '참석 인원' },
];

export default function AdminMinutesPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.admin.getMinutes(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="회의록 관리"
      description="각종 회의록을 작성하고 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
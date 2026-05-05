import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'eventName', label: '행사명' },
  { key: 'name', label: '참가자' },
  { key: 'participantDate', label: '참가일' },
  { key: 'attendanceStatus', label: '참석 여부' },
];

export default function EventParticipantPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.event.getParticipant(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="참가자 관리"
      description="행사별 참가자 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
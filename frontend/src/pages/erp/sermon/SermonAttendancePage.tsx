import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'worshipDate', label: '예배일' },
  { key: 'worshipType', label: '예배 종류' },
  { key: 'attendanceCount', label: '출석인원' },
  { key: 'totalMembers', label: '전체인원' },
  { key: 'attendanceRate', label: '출석률' },
];

export default function SermonAttendancePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.sermon.getAttendance(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="예배 출석"
      description="예배별 출석 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
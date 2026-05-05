import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'classDate', label: '수업일' },
  { key: 'courseName', label: '과정명' },
  { key: 'attendanceCount', label: '출석인원' },
  { key: 'totalStudents', label: '전체인원' },
  { key: 'attendanceRate', label: '출석률' },
];

export default function TrainingAttendancePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.training.getAttendance(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="훈련 출석"
      description="과정별 출석 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'courseName', label: '과정명' },
  { key: 'instructor', label: '강사' },
  { key: 'startDate', label: '시작일' },
  { key: 'endDate', label: '종료일' },
  { key: 'capacity', label: '정원' },
];

export default function TrainingCoursePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.training.getCourse(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="훈련 과정"
      description="훈련 과정 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
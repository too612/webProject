import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'courseName', label: '과정명' },
  { key: 'completeDate', label: '수료일' },
  { key: 'grade', label: '성적' },
];

export default function TrainingCompletePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.training.getComplete(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="수료 현황"
      description="훈련 과정 수료자 현황을 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
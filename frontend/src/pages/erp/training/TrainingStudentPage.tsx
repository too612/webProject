import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'courseName', label: '수강 과정' },
  { key: 'enrollDate', label: '등록일' },
  { key: 'status', label: '수강 상태' },
];

export default function TrainingStudentPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.training.getStudent(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="수강자 관리"
      description="수강자 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
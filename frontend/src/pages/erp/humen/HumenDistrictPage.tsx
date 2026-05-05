import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'districtName', label: '구역명' },
  { key: 'leaderName', label: '구역장' },
  { key: 'memberCount', label: '인원수' },
  { key: 'meetingDay', label: '모임요일' },
];

export default function HumenDistrictPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.humen.getDistrict(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="구역 관리"
      description="구역 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
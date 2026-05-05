import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'facilityName', label: '시설명' },
  { key: 'reservantName', label: '신청자' },
  { key: 'reserveDate', label: '예약일' },
  { key: 'startTime', label: '시작시간' },
  { key: 'endTime', label: '종료시간' },
  { key: 'status', label: '상태' },
];

export default function FacilityReservationPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.facility.getReservation(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="시설 예약"
      description="시설 예약 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
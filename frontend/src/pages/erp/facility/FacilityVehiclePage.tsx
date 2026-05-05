import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'vehicleName', label: '차량명' },
  { key: 'plateNumber', label: '차량번호' },
  { key: 'driverName', label: '담당운전자' },
  { key: 'status', label: '상태' },
  { key: 'lastInspectionDate', label: '최근점검일' },
];

export default function FacilityVehiclePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.facility.getVehicle(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="차량 관리"
      description="교회 차량 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
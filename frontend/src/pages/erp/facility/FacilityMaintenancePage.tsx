import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'facilityName', label: '시설명' },
  { key: 'maintenanceDate', label: '점검일' },
  { key: 'description', label: '점검내용' },
  { key: 'engineer', label: '담당자' },
  { key: 'cost', label: '비용' },
  { key: 'status', label: '상태' },
];

export default function FacilityMaintenancePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.facility.getMaintenance(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="시설 점검"
      description="시설 점검 및 보수 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
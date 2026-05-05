import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'itemName', label: '비품명' },
  { key: 'category', label: '종류' },
  { key: 'quantity', label: '수량' },
  { key: 'location', label: '보관위치' },
  { key: 'purchaseDate', label: '구입일' },
];

export default function FacilityInventoryPage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.facility.getInventory(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="비품 재고"
      description="교회 비품 및 재고 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'certNo', label: '증명서번호' },
  { key: 'memberName', label: '성도명' },
  { key: 'certType', label: '종류' },
  { key: 'issuedAt', label: '발급일' },
  { key: 'status', label: '상태' },
];

export default function AdminCertificatePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.admin.getCertificate(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="증명서 발급"
      description="성도 증명서 발급 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
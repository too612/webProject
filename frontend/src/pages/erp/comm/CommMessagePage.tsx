import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';
import type { ErpListResult, ErpListQuery } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '제목' },
  { key: 'recipient', label: '수신자' },
  { key: 'sentAt', label: '발송일시' },
  { key: 'status', label: '상태' },
];

export default function CommMessagePage() {
  const fetchFn = useCallback((q: ErpListQuery) => (erpApi.comm.getMessage(q) as unknown) as Promise<ErpListResult<Row>>, []);
  return (
    <ErpListPage<Row>
      title="문자발송"
      description="문자 발송 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
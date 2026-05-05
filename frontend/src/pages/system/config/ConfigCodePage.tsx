import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type CodeRow = {
  groupCode: string;
  groupName: string;
  codeValue: string;
  codeName: string;
  orderNo: number;
  [key: string]: unknown;
};

export default function ConfigCodePage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.config.getCodes(q) as unknown) as Promise<SystemListResult<CodeRow>>,
    []
  );

  const columns = [
    { key: 'groupCode', label: '그룹코드', render: (row: CodeRow) => <code>{row.groupCode}</code> },
    { key: 'groupName', label: '그룹명' },
    { key: 'codeValue', label: '코드값', render: (row: CodeRow) => <code>{row.codeValue}</code> },
    { key: 'codeName', label: '코드명' },
    { key: 'orderNo', label: '순서' },
    {
      key: 'actions',
      label: '관리',
      render: () => (
        <>
          <button type="button" className="btn btn-sm btn-secondary">수정</button>
          <button type="button" className="btn btn-sm btn-danger">삭제</button>
        </>
      ),
    },
  ];

  return (
    <SystemListPage<CodeRow>
      title="공통 코드 관리"
      description="시스템 전반에서 사용하는 코드 체계를 일관되게 관리합니다."
      columns={columns}
      fetchFn={fetchFn}
      searchable
      searchPlaceholder="그룹코드 또는 코드명 검색"
      onPrimaryAction={() => undefined}
      primaryActionLabel="코드 추가"
    />
  );
}
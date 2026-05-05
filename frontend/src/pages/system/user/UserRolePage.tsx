import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type RoleRow = {
  roleId: string;
  roleName: string;
  description: string;
  userCount: number;
  [key: string]: unknown;
};

export default function UserRolePage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.user.getRoles(q) as unknown) as Promise<SystemListResult<RoleRow>>,
    []
  );

  const columns = [
    { key: 'roleId', label: '역할 코드', render: (row: RoleRow) => <code>{row.roleId}</code> },
    { key: 'roleName', label: '역할명' },
    { key: 'description', label: '설명' },
    { key: 'userCount', label: '사용자 수', render: (row: RoleRow) => `${row.userCount}명` },
    {
      key: 'actions',
      label: '관리',
      render: () => (
        <>
          <button type="button" className="btn btn-sm btn-secondary">권한 설정</button>
          <button type="button" className="btn btn-sm btn-secondary">수정</button>
        </>
      ),
    },
  ];

  return (
    <SystemListPage<RoleRow>
      title="역할 권한 관리"
      description="사용자 역할과 메뉴 접근 권한을 정의합니다."
      columns={columns}
      fetchFn={fetchFn}
      onPrimaryAction={() => undefined}
      primaryActionLabel="역할 추가"
    />
  );
}
import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type UserRow = {
  id: string;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
  [key: string]: unknown;
};

export default function UserManagerPage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.user.getList(q) as unknown) as Promise<SystemListResult<UserRow>>,
    []
  );

  const columns = [
    { key: 'id', label: '아이디' },
    { key: 'name', label: '이름' },
    { key: 'role', label: '역할' },
    {
      key: 'status',
      label: '상태',
      render: (row: UserRow) => (
        <span className={`community-badge ${row.status === '활성' ? 'badge-active' : 'badge-inactive'}`}>{row.status}</span>
      ),
    },
    { key: 'lastLogin', label: '최근 로그인' },
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
    <SystemListPage<UserRow>
      title="사용자 계정 관리"
      description="시스템 사용자 계정을 조회하고 권한 정보를 관리합니다."
      columns={columns}
      fetchFn={fetchFn}
      searchable
      searchPlaceholder="아이디 또는 이름 검색"
      onPrimaryAction={() => undefined}
      primaryActionLabel="계정 생성"
    />
  );
}
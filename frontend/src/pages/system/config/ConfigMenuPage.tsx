import { useCallback } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';
import SystemListPage from '../shared/SystemListPage';

type MenuRow = {
  menuId: string;
  menuName: string;
  path: string;
  level: number;
  visibleRole: string;
  [key: string]: unknown;
};

export default function ConfigMenuPage() {
  const fetchFn = useCallback(
    (q: SystemListQuery) => (systemApi.config.getMenus(q) as unknown) as Promise<SystemListResult<MenuRow>>,
    []
  );

  const columns = [
    { key: 'menuId', label: '메뉴 ID', render: (row: MenuRow) => <code>{row.menuId}</code> },
    { key: 'menuName', label: '메뉴명' },
    { key: 'path', label: '경로' },
    { key: 'level', label: '레벨', render: (row: MenuRow) => `LV.${row.level}` },
    { key: 'visibleRole', label: '접근 가능 역할' },
    { key: 'actions', label: '관리', render: () => <button type="button" className="btn btn-sm btn-secondary">권한 설정</button> },
  ];

  return (
    <SystemListPage<MenuRow>
      title="메뉴 권한 관리"
      description="역할별 메뉴 접근 및 권한 정책을 관리합니다."
      columns={columns}
      fetchFn={fetchFn}
      onPrimaryAction={() => undefined}
      primaryActionLabel="메뉴 추가"
    />
  );
}
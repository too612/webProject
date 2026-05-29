import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import SystemIndexPage from '../system/index/systemIndexPage';

// user
import UserManagerPage from '../system/user/manager/managerPage';
import UserRolePage from '../system/user/role/rolePage';

// config
import ConfigCodePage from '../system/config/code/codePage';
import ConfigMenuPage from '../system/config/menu/menuPage';

// log
import LogSystemPage from '../system/log/system/systemPage';
import LogAuditPage from '../system/log/audit/auditPage';

// backup
import BackupPolicyPage from '../system/backup/policy/policyPage';
import BackupHistoryPage from '../system/backup/history/historyPage';

export const systemRoutes: RouteObject[] = [
  {
    path: '/system',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SystemIndexPage />,
      },
      {
        path: 'user',
        element: <SubmenuLayout />,
        children: [
          { path: 'manager', element: <UserManagerPage /> },
          { path: 'role', element: <UserRolePage /> },
        ],
      },
      {
        path: 'config',
        element: <SubmenuLayout />,
        children: [
          { path: 'code', element: <ConfigCodePage /> },
          { path: 'menu', element: <ConfigMenuPage /> },
        ],
      },
      {
        path: 'log',
        element: <SubmenuLayout />,
        children: [
          { path: 'system', element: <LogSystemPage /> },
          { path: 'audit', element: <LogAuditPage /> },
        ],
      },
      {
        path: 'backup',
        element: <SubmenuLayout />,
        children: [
          { path: 'policy', element: <BackupPolicyPage /> },
          { path: 'history', element: <BackupHistoryPage /> },
        ],
      },
    ],
  },
];
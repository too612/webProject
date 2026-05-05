import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import SystemIndexPage from '../pages/system/SystemIndexPage';

// user
import UserManagerPage from '../pages/system/user/UserManagerPage';
import UserRolePage from '../pages/system/user/UserRolePage';

// config
import ConfigCodePage from '../pages/system/config/ConfigCodePage';
import ConfigMenuPage from '../pages/system/config/ConfigMenuPage';

// log
import LogSystemPage from '../pages/system/log/LogSystemPage';
import LogAuditPage from '../pages/system/log/LogAuditPage';

// backup
import BackupPolicyPage from '../pages/system/backup/BackupPolicyPage';
import BackupHistoryPage from '../pages/system/backup/BackupHistoryPage';

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
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';

const SystemIndexPage = lazy(() => import('../system/index/systemIndexPage'));
const UserManagerPage = lazy(() => import('../system/user/manager/managerPage'));
const UserRolePage = lazy(() => import('../system/user/role/rolePage'));
const ConfigCodePage = lazy(() => import('../system/config/code/codePage'));
const ConfigMenuPage = lazy(() => import('../system/config/menu/menuPage'));
const LogSystemPage = lazy(() => import('../system/log/system/systemPage'));
const LogAuditPage = lazy(() => import('../system/log/audit/auditPage'));
const BackupPolicyPage = lazy(() => import('../system/backup/policy/policyPage'));
const BackupHistoryPage = lazy(() => import('../system/backup/history/historyPage'));

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
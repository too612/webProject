import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import WorkspaceLayout from "../layouts/workspace/WorkspaceLayout";
import { Users, Settings2, History, Database } from "lucide-react";
import type { WorkspaceMenuPresentation } from "../common/workspace/workspace.types";

const systemMenuPresentation: WorkspaceMenuPresentation = {
  "/system/user": { label: "사용자", icon: Users },
  "/system/config": { label: "설정", icon: Settings2 },
  "/system/log": { label: "로그", icon: History },
  "/system/backup": { label: "백업", icon: Database },
};

const SystemIndexPage = lazy(() => import("../system/index/systemIndexPage"));
const UserManagerPage = lazy(
  () => import("../system/user/manager/managerPage"),
);
const UserRolePage = lazy(() => import("../system/user/role/rolePage"));
const ConfigCodePage = lazy(() => import("../system/config/code/codePage"));
const ConfigMenuPage = lazy(() => import("../system/config/menu/menuPage"));
const LogSystemPage = lazy(() => import("../system/log/system/systemPage"));
const LogAuditPage = lazy(() => import("../system/log/audit/auditPage"));
const BackupPolicyPage = lazy(
  () => import("../system/backup/policy/policyPage"),
);
const BackupHistoryPage = lazy(
  () => import("../system/backup/history/historyPage"),
);

export const systemRoutes: RouteObject[] = [
  {
    path: "/system",
    element: (
      <ProtectedRoute>
        <WorkspaceLayout
          basePath="/system"
          name="시스템"
          menuPresentation={systemMenuPresentation}
        />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SystemIndexPage />,
      },
      {
        path: "user",
        children: [
          { path: "manager", element: <UserManagerPage /> },
          { path: "role", element: <UserRolePage /> },
        ],
      },
      {
        path: "config",
        children: [
          { path: "code", element: <ConfigCodePage /> },
          { path: "menu", element: <ConfigMenuPage /> },
        ],
      },
      {
        path: "log",
        children: [
          { path: "system", element: <LogSystemPage /> },
          { path: "audit", element: <LogAuditPage /> },
        ],
      },
      {
        path: "backup",
        children: [
          { path: "policy", element: <BackupPolicyPage /> },
          { path: "history", element: <BackupHistoryPage /> },
        ],
      },
    ],
  },
];

import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import WorkspaceLayout from "../layouts/workspace/WorkspaceLayout";
import { Users, CalendarDays, HandHeart, Globe } from "lucide-react";
import type { WorkspaceMenuPresentation } from "../common/workspace/workspace.types";

const communityMenuPresentation: WorkspaceMenuPresentation = {
  "/community/group": { label: "모임", icon: Users },
  "/community/facilities": { label: "시설", icon: CalendarDays },
  "/community/saint": { label: "교우", icon: HandHeart },
  "/community/world": { label: "세상", icon: Globe },
};

const CommunityIndexPage = lazy(
  () => import("../community/index/communityIndexPage"),
);
const GroupManagerPage = lazy(
  () => import("../community/group/manager/managerPage"),
);
const GroupA1Page = lazy(() => import("../community/group/a1/a1Page"));
const GroupB2Page = lazy(() => import("../community/group/b2/b2Page"));
const FacilitiesCalendarPage = lazy(
  () => import("../community/facilities/calendar/calendarPage"),
);
const FacilitiesDiningPage = lazy(
  () => import("../community/facilities/dining/diningPage"),
);
const FacilitiesPrayerPage = lazy(
  () => import("../community/facilities/prayer/prayerPage"),
);
const SaintFamilyPage = lazy(
  () => import("../community/saint/family/familyPage"),
);
const SaintPrayPage = lazy(() => import("../community/saint/pray/prayPage"));
const SaintSalesPage = lazy(() => import("../community/saint/sales/salesPage"));
const SaintJobPage = lazy(() => import("../community/saint/job/jobPage"));
const WorldChristianPage = lazy(
  () => import("../community/world/christian/christianPage"),
);
const WorldEconomicPage = lazy(
  () => import("../community/world/economic/economicPage"),
);
const WorldHealthPage = lazy(
  () => import("../community/world/health/healthPage"),
);

export const communityRoutes: RouteObject[] = [
  {
    path: "/community",
    element: (
      <WorkspaceLayout
        basePath="/community"
        name="공동체"
        menuPresentation={communityMenuPresentation}
      />
    ),
    children: [
      {
        index: true,
        element: <CommunityIndexPage />,
      },
      {
        path: "group",
        children: [
          { path: "manager", element: <GroupManagerPage /> },
          { path: "groupa1", element: <GroupA1Page /> },
          { path: "groupb2", element: <GroupB2Page /> },
        ],
      },
      {
        path: "facilities",
        children: [
          { path: "calendar", element: <FacilitiesCalendarPage /> },
          { path: "dining", element: <FacilitiesDiningPage /> },
          { path: "prayer", element: <FacilitiesPrayerPage /> },
        ],
      },
      {
        path: "saint",
        children: [
          { path: "family", element: <SaintFamilyPage /> },
          { path: "pray", element: <SaintPrayPage /> },
          { path: "sales", element: <SaintSalesPage /> },
          { path: "job", element: <SaintJobPage /> },
        ],
      },
      {
        path: "world",
        children: [
          { path: "christian", element: <WorldChristianPage /> },
          { path: "economic", element: <WorldEconomicPage /> },
          { path: "health", element: <WorldHealthPage /> },
        ],
      },
    ],
  },
];

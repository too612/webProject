import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';

const CommunityIndexPage = lazy(() => import('../community/index/communityIndexPage'));
const GroupManagerPage = lazy(() => import('../community/group/manager/managerPage'));
const GroupA1Page = lazy(() => import('../community/group/a1/a1Page'));
const GroupB2Page = lazy(() => import('../community/group/b2/b2Page'));
const FacilitiesCalendarPage = lazy(() => import('../community/facilities/calendar/calendarPage'));
const FacilitiesDiningPage = lazy(() => import('../community/facilities/dining/diningPage'));
const FacilitiesPrayerPage = lazy(() => import('../community/facilities/prayer/prayerPage'));
const SaintFamilyPage = lazy(() => import('../community/saint/family/familyPage'));
const SaintPrayPage = lazy(() => import('../community/saint/pray/prayPage'));
const SaintSalesPage = lazy(() => import('../community/saint/sales/salesPage'));
const SaintJobPage = lazy(() => import('../community/saint/job/jobPage'));
const WorldChristianPage = lazy(() => import('../community/world/christian/christianPage'));
const WorldEconomicPage = lazy(() => import('../community/world/economic/economicPage'));
const WorldHealthPage = lazy(() => import('../community/world/health/healthPage'));

export const communityRoutes: RouteObject[] = [
  {
    path: '/community',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <CommunityIndexPage />,
      },
      {
        path: 'group',
        element: <SubmenuLayout />,
        children: [
          { path: 'manager', element: <GroupManagerPage /> },
          { path: 'groupa1', element: <GroupA1Page /> },
          { path: 'groupb2', element: <GroupB2Page /> },
        ],
      },
      {
        path: 'facilities',
        element: <SubmenuLayout />,
        children: [
          { path: 'calendar', element: <FacilitiesCalendarPage /> },
          { path: 'dining', element: <FacilitiesDiningPage /> },
          { path: 'prayer', element: <FacilitiesPrayerPage /> },
        ],
      },
      {
        path: 'saint',
        element: <SubmenuLayout />,
        children: [
          { path: 'family', element: <SaintFamilyPage /> },
          { path: 'pray', element: <SaintPrayPage /> },
          { path: 'sales', element: <SaintSalesPage /> },
          { path: 'job', element: <SaintJobPage /> },
        ],
      },
      {
        path: 'world',
        element: <SubmenuLayout />,
        children: [
          { path: 'christian', element: <WorldChristianPage /> },
          { path: 'economic', element: <WorldEconomicPage /> },
          { path: 'health', element: <WorldHealthPage /> },
        ],
      },
    ],
  },
];
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import CommunityIndexPage from '../community/index/communityIndexPage';

// group
import GroupManagerPage from '../community/group/manager/managerPage';
import GroupA1Page from '../community/group/a1/a1Page';
import GroupB2Page from '../community/group/b2/b2Page';

// facilities
import FacilitiesCalendarPage from '../community/facilities/calendar/calendarPage';
import FacilitiesDiningPage from '../community/facilities/dining/diningPage';
import FacilitiesPrayerPage from '../community/facilities/prayer/prayerPage';

// saint
import SaintFamilyPage from '../community/saint/family/familyPage';
import SaintPrayPage from '../community/saint/pray/prayPage';
import SaintSalesPage from '../community/saint/sales/salesPage';
import SaintJobPage from '../community/saint/job/jobPage';

// world
import WorldChristianPage from '../community/world/christian/christianPage';
import WorldEconomicPage from '../community/world/economic/economicPage';
import WorldHealthPage from '../community/world/health/healthPage';

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
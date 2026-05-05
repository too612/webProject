import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import CommunityIndexPage from '../pages/community/CommunityIndexPage';

// group
import GroupManagerPage from '../pages/community/group/GroupManagerPage';
import GroupA1Page from '../pages/community/group/GroupA1Page';
import GroupB2Page from '../pages/community/group/GroupB2Page';

// facilities
import FacilitiesCalendarPage from '../pages/community/facilities/FacilitiesCalendarPage';
import FacilitiesDiningPage from '../pages/community/facilities/FacilitiesDiningPage';
import FacilitiesPrayerPage from '../pages/community/facilities/FacilitiesPrayerPage';

// saint
import SaintFamilyPage from '../pages/community/saint/SaintFamilyPage';
import SaintPrayPage from '../pages/community/saint/SaintPrayPage';
import SaintSalesPage from '../pages/community/saint/SaintSalesPage';
import SaintJobPage from '../pages/community/saint/SaintJobPage';

// world
import WorldChristianPage from '../pages/community/world/WorldChristianPage';
import WorldEconomicPage from '../pages/community/world/WorldEconomicPage';
import WorldHealthPage from '../pages/community/world/WorldHealthPage';

// support
import SupportBoardPage from '../pages/community/support/SupportBoardPage';

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
      {
        path: 'support',
        element: <SubmenuLayout />,
        children: [
          { path: 'board', element: <SupportBoardPage /> },
        ],
      },
    ],
  },
];
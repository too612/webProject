import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { authRoutes } from './AuthRoutes';
import { communityRoutes } from './CommunityRoutes';
import { erpRoutes } from './ErpRoutes';
import { mypageRoutes } from './MypageRoutes';
import { officialRoutes } from './OfficialRoutes';
import { systemRoutes } from './SystemRoutes';

const routes: RouteObject[] = [
  ...officialRoutes,
  ...communityRoutes,
  ...erpRoutes,
  ...mypageRoutes,
  ...systemRoutes,
  ...authRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
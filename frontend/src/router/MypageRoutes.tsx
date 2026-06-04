import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';

const MypageIndexPage = lazy(() => import('../mypage/index/mypageIndexPage'));
const ProfilePage = lazy(() => import('../mypage/user/profile/profilePage'));
const PasswordPage = lazy(() => import('../mypage/user/password/passwordPage'));
const ActivityPage = lazy(() => import('../mypage/user/activity/activityPage'));
const InquiryPage = lazy(() => import('../mypage/user/inquiry/inquiryPage'));
const NotificationsPage = lazy(() => import('../mypage/user/notifications/notificationsPage'));
const WithdrawPage = lazy(() => import('../mypage/user/withdraw/withdrawPage'));

export const mypageRoutes: RouteObject[] = [
  {
    path: '/mypage',
    element: (
      <ProtectedRoute>
        <MainLayout showChatbot={false} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MypageIndexPage /> },

      // user
      {
        path: 'user',
        element: <SubmenuLayout />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'password', element: <PasswordPage /> },
          { path: 'activity', element: <ActivityPage /> },
          { path: 'inquiry', element: <InquiryPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'withdraw', element: <WithdrawPage /> },
        ],
      },
    ],
  },
];

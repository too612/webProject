import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import MypageIndexPage from '../mypage/index/mypageIndexPage';

// user
import ProfilePage from '../mypage/user/profile/profilePage';
import PasswordPage from '../mypage/user/password/passwordPage';
import ActivityPage from '../mypage/user/activity/activityPage';
import InquiryPage from '../mypage/user/inquiry/inquiryPage';
import NotificationsPage from '../mypage/user/notifications/notificationsPage';
import WithdrawPage from '../mypage/user/withdraw/withdrawPage';

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

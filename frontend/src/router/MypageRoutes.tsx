import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MypageLayout from '../layouts/MypageLayout';
import MypageIndexPage from '../pages/mypage/MypageIndexPage';

// user
import ProfilePage from '../pages/mypage/user/ProfilePage';
import PasswordPage from '../pages/mypage/user/PasswordPage';
import ActivityPage from '../pages/mypage/user/ActivityPage';
import InquiryPage from '../pages/mypage/user/InquiryPage';
import NotificationsPage from '../pages/mypage/user/NotificationsPage';
import WithdrawPage from '../pages/mypage/user/WithdrawPage';

export const mypageRoutes: RouteObject[] = [
  {
    path: '/mypage',
    element: (
      <ProtectedRoute>
        <MypageLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MypageIndexPage /> },

      // user
      { path: 'user/profile', element: <ProfilePage /> },
      { path: 'user/password', element: <PasswordPage /> },
      { path: 'user/activity', element: <ActivityPage /> },
      { path: 'user/inquiry', element: <InquiryPage /> },
      { path: 'user/notifications', element: <NotificationsPage /> },
      { path: 'user/withdraw', element: <WithdrawPage /> },
    ]
  }
];

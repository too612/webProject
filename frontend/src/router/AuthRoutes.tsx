import type { RouteObject } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import MyPage from '../pages/auth/MyPage';
import RegisterPage from '../pages/auth/RegisterPage';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
    ],
  },
];
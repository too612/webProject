import { lazy } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';
import AuthLayout from '../common/auth/authLayout';

const LoginPage = lazy(() => import('../common/auth/login/loginPage'));
const RegisterPage = lazy(() => import('../common/auth/register/registerPage'));

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
];
import { lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import AuthLayout from "../common/auth/authLayout";

const LoginPage = lazy(() => import("../common/auth/login/loginPage"));
const RegisterPage = lazy(() => import("../common/auth/register/registerPage"));
const FindIdPage = lazy(() => import("../common/auth/findId/findIdPage"));
const FindPasswordPage = lazy(
  () => import("../common/auth/findPassword/findPasswordPage"),
);

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "find-id",
        element: <FindIdPage />,
      },
      {
        path: "find-password",
        element: <FindPasswordPage />,
      },
    ],
  },
];

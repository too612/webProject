import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../common/auth/authStore';
import { authApi } from '../common/auth/authApi';

type ProtectedRouteProps = {
    children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((auth) => auth.isAuthenticated);
    const clearAuth = useAuthStore((auth) => auth.clearAuth);
    const location = useLocation();
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        let active = true;

        if (!isAuthenticated) {
            setCheckingSession(false);
            return () => {
                active = false;
            };
        }

        setCheckingSession(true);
        authApi.checkSession().then((sessionIsAuthenticated) => {
            if (!active) return;
            if (!sessionIsAuthenticated) clearAuth();
            setCheckingSession(false);
        });

        return () => {
            active = false;
        };
    }, [isAuthenticated, clearAuth]);

    if (checkingSession && isAuthenticated) {
        return (
            <div className="flex min-h-48 items-center justify-center text-sm text-slate-500" role="status">
                로그인 상태를 확인하고 있습니다...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}

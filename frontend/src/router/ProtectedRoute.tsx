import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../common/auth/authStore';
import { authApi } from '../common/auth/authApi';
import { getApiErrorMessage } from '../common/api/apiError';

type ProtectedRouteProps = {
    children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((auth) => auth.isAuthenticated);
    const clearAuth = useAuthStore((auth) => auth.clearAuth);
    const authRevision = useAuthStore((auth) => auth.authRevision);
    const location = useLocation();
    const [verifiedRevision, setVerifiedRevision] = useState<number | null>(null);
    const [sessionError, setSessionError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let active = true;
        setSessionError('');
        setVerifiedRevision(null);

        if (!isAuthenticated) {
            return () => {
                active = false;
            };
        }

        authApi.checkSession().then((sessionIsAuthenticated) => {
            if (!active || useAuthStore.getState().authRevision !== authRevision) return;
            if (!sessionIsAuthenticated) {
                clearAuth(authRevision);
                return;
            }
            setVerifiedRevision(authRevision);
        }).catch((error: unknown) => {
            if (!active || useAuthStore.getState().authRevision !== authRevision) return;
            setSessionError(getApiErrorMessage(error, '로그인 상태를 확인하지 못했습니다. 다시 시도해 주세요.'));
        });

        return () => {
            active = false;
        };
    }, [isAuthenticated, authRevision, clearAuth, retryCount]);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search + location.hash }} />;
    }

    if (sessionError) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-slate-500">
                <p role="alert">{sessionError}</p>
                <button type="button" className="rounded border px-4 py-2" onClick={() => {
                    setSessionError('');
                    setRetryCount((count) => count + 1);
                }}>
                    다시 시도
                </button>
            </div>
        );
    }

    if (verifiedRevision !== authRevision) {
        return (
            <div className="flex min-h-48 items-center justify-center text-sm text-slate-500" role="status">
                로그인 상태를 확인하고 있습니다...
            </div>
        );
    }

    return <>{children}</>;
}

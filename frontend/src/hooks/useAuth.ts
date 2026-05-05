import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserType } from '../types/user.types';

export function useAuth() {
    const navigate = useNavigate();
    const { isAuthenticated, user, token, setAuth, clearAuth } = useAuthStore();

    const login = (nextUser: UserType, nextToken?: string | null) => {
        setAuth(nextUser, nextToken);
    };

    const logout = () => {
        clearAuth();
        navigate('/auth/login');
    };

    return useMemo(() => ({
        isAuthenticated,
        user,
        token,
        login,
        logout,
    }), [isAuthenticated, user, token]);
}

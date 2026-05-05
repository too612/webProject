import { create } from 'zustand';
import type { UserType } from '../types/user.types';

type AuthStore = {
    isAuthenticated: boolean;
    user: UserType | null;
    token: string | null;
    setAuth: (user: UserType, token?: string | null) => void;
    clearAuth: () => void;
};

const loadInitial = (): Pick<AuthStore, 'isAuthenticated' | 'user' | 'token'> => {
    try {
        const raw = sessionStorage.getItem('authStore');
        if (!raw) {
            return { isAuthenticated: false, user: null, token: null };
        }
        const parsed = JSON.parse(raw) as Pick<AuthStore, 'isAuthenticated' | 'user' | 'token'>;
        return {
            isAuthenticated: !!parsed.isAuthenticated,
            user: parsed.user ?? null,
            token: parsed.token ?? null,
        };
    } catch {
        return { isAuthenticated: false, user: null, token: null };
    }
};

const persist = (state: Pick<AuthStore, 'isAuthenticated' | 'user' | 'token'>) => {
    sessionStorage.setItem('authStore', JSON.stringify(state));
};

export const useAuthStore = create<AuthStore>((set) => ({
    ...loadInitial(),
    setAuth: (user, token = null) =>
        set(() => {
            const next = { isAuthenticated: true, user, token };
            persist(next);
            if (token) {
                localStorage.setItem('authToken', token);
            }
            return next;
        }),
    clearAuth: () =>
        set(() => {
            const next = { isAuthenticated: false, user: null, token: null };
            persist(next);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            return next;
        }),
}));

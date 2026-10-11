import { create } from 'zustand';
import type { UserType } from './authModel';

type AuthStore = {
  authRevision: number;
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
  setAuth: (user: UserType, token?: string | null) => void;
  clearAuth: (expectedRevision?: number) => void;
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
  authRevision: 0,
  setAuth: (user, token = null) =>
    set((state) => {
      const next = { isAuthenticated: true, user, token };
      persist(next);
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
      return { ...next, authRevision: state.authRevision + 1 };
    }),
  clearAuth: (expectedRevision) =>
    set((state) => {
      if (expectedRevision !== undefined && expectedRevision !== state.authRevision) {
        return state;
      }
      const next = { isAuthenticated: false, user: null, token: null };
      persist(next);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return { ...next, authRevision: state.authRevision + 1 };
    }),
}));

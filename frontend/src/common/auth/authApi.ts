import client from '../../common/api/api.client';
import type { ApiResponse } from '../../common/api/api.types';
import type { UserType } from './authTypes';

type GetCurrentUserApiResponse = UserType;
type CheckSessionApiResponse = { authenticated: boolean };

export const authApi = {
  logout: async (): Promise<boolean> => {
    try {
      await client.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return true;
    } catch {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return false;
    }
  },

  getCurrentUser: async (): Promise<GetCurrentUserApiResponse | null> => {
    try {
      const response = await client.get<ApiResponse<GetCurrentUserApiResponse>>('/auth/me');
      return response.data.data || null;
    } catch {
      return null;
    }
  },

  checkSession: async (): Promise<boolean> => {
    try {
      const response = await client.get<ApiResponse<CheckSessionApiResponse>>('/auth/check');
      return response.data.data?.authenticated || false;
    } catch {
      return false;
    }
  },
};

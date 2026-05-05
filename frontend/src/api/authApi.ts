import client from './client';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserDto } from '../types';

type ApiFailure = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  return (error as ApiFailure)?.response?.data?.message ?? fallbackMessage;
}

export const authApi = {
  /**
   * 로그인
   */
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await client.post<ApiResponse<AuthResponse>>('/auth/login', request);
      const data = response.data.data;
      if (!data) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
      }
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error(getApiErrorMessage(error, '로그인 중 오류가 발생했습니다.'));
    }
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<boolean> => {
    try {
      await client.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return false;
    }
  },

  /**
   * 회원가입
   */
  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await client.post<ApiResponse<AuthResponse>>('/auth/register', request);
      const data = response.data.data;
      if (!data) {
        throw new Error('회원가입 응답이 올바르지 않습니다.');
      }
      return data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw new Error(getApiErrorMessage(error, '회원가입 처리 중 오류가 발생했습니다.'));
    }
  },

  checkUserId: async (userId: string): Promise<boolean> => {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>('/auth/check-userid', {
        params: { userId },
      });
      return response.data.data?.available ?? false;
    } catch (error) {
      console.error('아이디 중복확인 실패:', error);
      throw new Error(getApiErrorMessage(error, '아이디 중복 확인 중 오류가 발생했습니다.'));
    }
  },

  checkEmail: async (email: string): Promise<boolean> => {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>('/auth/check-email', {
        params: { email },
      });
      return response.data.data?.available ?? false;
    } catch (error) {
      console.error('이메일 중복확인 실패:', error);
      throw new Error(getApiErrorMessage(error, '이메일 중복 확인 중 오류가 발생했습니다.'));
    }
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<UserDto | null> => {
    try {
      const response = await client.get<ApiResponse<UserDto>>('/auth/me');
      return response.data.data || null;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      return null;
    }
  },

  /**
   * 세션 확인
   */
  checkSession: async (): Promise<boolean> => {
    try {
      const response = await client.get<ApiResponse<{ authenticated: boolean }>>('/auth/check');
      return response.data.data?.authenticated || false;
    } catch (error) {
      console.error('세션 확인 실패:', error);
      return false;
    }
  },
};

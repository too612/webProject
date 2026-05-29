import client from '../../api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../lib/apiError';
import type { AuthResponse, RegisterRequest } from '../authTypes';

type RegisterApiRequest = RegisterRequest;
type RegisterApiResponse = AuthResponse;

export const registerApi = {
  async register(request: RegisterApiRequest): Promise<RegisterApiResponse> {
    try {
      const response = await client.post<ApiResponse<RegisterApiResponse>>('/auth/register', request);
      const data = response.data.data;
      if (!data) {
        throw new Error('회원가입 응답이 올바르지 않습니다.');
      }
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '회원가입 처리 중 오류가 발생했습니다.'));
    }
  },

  async checkUserId(userId: string): Promise<boolean> {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>('/auth/check-userid', {
        params: { userId },
      });
      return response.data.data?.available ?? false;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '아이디 중복 확인 중 오류가 발생했습니다.'));
    }
  },

  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>('/auth/check-email', {
        params: { email },
      });
      return response.data.data?.available ?? false;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '이메일 중복 확인 중 오류가 발생했습니다.'));
    }
  },
};

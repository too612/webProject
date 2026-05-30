import client from '../../api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../api/apiError';
import type { AuthResponse, RegisterRequest } from '../authTypes';

type RegisterApiRequest = RegisterRequest;
type RegisterApiResponse = AuthResponse;

export const registerApi = {
  async register(request: RegisterApiRequest): Promise<RegisterApiResponse> {
    try {
      const response = await client.post<ApiResponse<RegisterApiResponse>>('/auth/register', request);
      const data = response.data.data;
      if (!data) {
        throw new Error('?뚯썝媛???묐떟???щ컮瑜댁? ?딆뒿?덈떎.');
      }
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async checkUserId(userId: string): Promise<boolean> {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>('/auth/check-userid', {
        params: { userId },
      });
      return response.data.data?.available ?? false;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>('/auth/check-email', {
        params: { email },
      });
      return response.data.data?.available ?? false;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



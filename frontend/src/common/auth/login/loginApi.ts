import client from '../../api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../api/apiError';
import type { AuthResponse, LoginRequest } from '../authTypes';

type LoginApiRequest = LoginRequest;
type LoginApiResponse = AuthResponse;

export const loginApi = {
  async login(request: LoginApiRequest): Promise<LoginApiResponse> {
    try {
      const response = await client.post<ApiResponse<LoginApiResponse>>('/auth/login', request);
      const data = response.data.data;
      if (!data) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



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
        throw new Error('濡쒓렇???묐떟???щ컮瑜댁? ?딆뒿?덈떎.');
      }
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '濡쒓렇??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.'));
    }
  },
};


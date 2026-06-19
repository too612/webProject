import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { LocationInfo } from './LocationModel';

export const locationApi = {
  async getLocationInfo(): Promise<LocationInfo | null> {
    try {
      const response = await client.get<ApiResponse<LocationInfo>>('/official/about/location');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
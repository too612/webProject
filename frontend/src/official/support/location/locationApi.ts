import client from '../../../common/api/client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../types';
import type { LocationInfo } from './LocationModel';

export const locationApi = {
  async getLocationInfo(): Promise<LocationInfo | null> {
    try {
      const response = await client.get<ApiResponse<LocationInfo>>('/official/support/location');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '오시는 길 정보를 불러오지 못했습니다.'));
    }
  },
};

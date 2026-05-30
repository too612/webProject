import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { LocationInfo } from './LocationModel';

export const locationApi = {
  async getLocationInfo(): Promise<LocationInfo | null> {
    try {
      const response = await client.get<ApiResponse<LocationInfo>>('/official/support/location');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?ㅼ떆??湲??뺣낫瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};


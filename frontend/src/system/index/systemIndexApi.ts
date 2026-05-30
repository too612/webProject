import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_SYSTEM_INDEX, type SystemIndexData } from './systemIndexModel';

export const systemIndexApi = {
  async getIndexData(): Promise<SystemIndexData> {
    try {
      const response = await client.get<ApiResponse<SystemIndexData>>('/system/index');
      return response.data.data ?? EMPTY_SYSTEM_INDEX;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



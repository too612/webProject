import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { WorshipTimeItem } from './worshipTimeModel';

export const worshipTimeApi = {
  async getWorshipTimeItems(): Promise<WorshipTimeItem[]> {
    try {
      const response = await client.get<ApiResponse<WorshipTimeItem[]>>('/official/worship/time');
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



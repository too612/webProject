import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { LiveItem } from './liveModel';

export const liveApi = {
  async getLiveItems(): Promise<LiveItem[]> {
    try {
      const response = await client.get<ApiResponse<LiveItem[]>>('/official/worship/live');
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?덈같 ?ㅽ솴 ?뺣낫瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};


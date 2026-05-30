import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { StatsOfferingRow } from './offeringModel';

export const statsOfferingApi = {
  async getOfferingList(): Promise<StatsOfferingRow[]> {
    try {
      const response = await client.get<ApiResponse<{ content: StatsOfferingRow[] }>>('/erp/stats/offering');
      return response.data.data?.content ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?뚭툑 ?듦퀎 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};


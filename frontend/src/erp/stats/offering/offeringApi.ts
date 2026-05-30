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
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



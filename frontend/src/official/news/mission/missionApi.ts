import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { MissionContent } from './missionModel';

export const missionApi = {
  async getMissionContent(): Promise<MissionContent | null> {
    try {
      const response = await client.get<ApiResponse<MissionContent>>('/official/news/mission');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { NextstepsContent } from './nextstepsModel';

export const nextstepsApi = {
  async getNextstepsContent(): Promise<NextstepsContent | null> {
    try {
      const response = await client.get<ApiResponse<NextstepsContent>>('/official/news/nextsteps');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
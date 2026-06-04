import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import type { CorpDto } from './corpModel';
import { getApiErrorMessage } from '../api/apiError';

export const corpApi = {
  async getInfo(): Promise<CorpDto | null> {
    try {
      const response = await client.get<ApiResponse<CorpDto>>('/common/corp/getInfo');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};


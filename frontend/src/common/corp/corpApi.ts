import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import type { CorpDto } from './corpModel';
import { getApiErrorMessage } from '../api/apiError';

export const corpApi = {
  async getCorpInfo(): Promise<CorpDto | null> {
    try {
      const response = await client.get<ApiResponse<CorpDto>>('/common/corp/getCorpInfo');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '湲곌??뺣낫 議고쉶 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.'));
    }
  },
};

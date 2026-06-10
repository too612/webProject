﻿import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { LiveItem } from './liveModel';

export const liveApi = {
  async getLiveItems(category: string): Promise<LiveItem[]> {
    try {
      // 도메인 경로를 명확히 호출 (baseURL이 /api 라면 /api/official/worship/live 호출됨)
      const response = await client.get<ApiResponse<LiveItem[]>>('/official/worship/live', { params: { category } });
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};

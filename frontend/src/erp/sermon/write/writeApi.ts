import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { SermonWritePayload } from './writeModel';

export const sermonWriteApi = {
  async createSermon(payload: SermonWritePayload): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/erp/sermon/write', payload);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



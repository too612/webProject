import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { SermonWritePayload } from './writeModel';

export const sermonWriteApi = {
  async createSermon(payload: SermonWritePayload): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/erp/sermon/write', payload);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?§Íµê ?Ä?•Ïóê ?§Ìå®?àÏäµ?àÎã§.'));
    }
  },
};

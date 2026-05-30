import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_SYSTEM_INDEX, type SystemIndexData } from './systemIndexModel';

export const systemIndexApi = {
  async getIndexData(): Promise<SystemIndexData> {
    try {
      const response = await client.get<ApiResponse<SystemIndexData>>('/system/index');
      return response.data.data ?? EMPTY_SYSTEM_INDEX;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?쒖뒪??硫붿씤 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};


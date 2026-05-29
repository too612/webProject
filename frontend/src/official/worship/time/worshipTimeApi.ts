import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { WorshipTimeItem } from './worshipTimeModel';

export const worshipTimeApi = {
  async getWorshipTimeItems(): Promise<WorshipTimeItem[]> {
    try {
      const response = await client.get<ApiResponse<WorshipTimeItem[]>>('/official/worship/time');
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?ˆë°° ?œê°„ ?•ë³´ë¥?ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??'));
    }
  },
};

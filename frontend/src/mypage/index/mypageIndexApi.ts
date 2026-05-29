import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/lib/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_MYPAGE_INDEX, type MypageIndexData } from './mypageIndexModel';

export const mypageIndexApi = {
  async getIndexData(): Promise<MypageIndexData> {
    try {
      const response = await client.get<ApiResponse<MypageIndexData>>('/mypage/index');
      return response.data.data ?? EMPTY_MYPAGE_INDEX;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'ë§ˆì´?˜ì´ì§€ ë©”ì¸ ?°ì´?°ë? ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??'));
    }
  },
};

import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_MYPAGE_INDEX, type MypageIndexData } from './mypageIndexModel';

export const mypageIndexApi = {
  async getIndexData(): Promise<MypageIndexData> {
    try {
      const response = await client.get<ApiResponse<MypageIndexData>>('/mypage/index');
      return response.data.data ?? EMPTY_MYPAGE_INDEX;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '留덉씠?섏씠吏 硫붿씤 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};


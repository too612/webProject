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
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



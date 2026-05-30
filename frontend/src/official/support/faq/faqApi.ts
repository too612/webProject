import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { FaqItem } from './FaqModel';

export const faqApi = {
  async getFaqItems(): Promise<FaqItem[]> {
    try {
      const response = await client.get<ApiResponse<FaqItem[]>>('/official/support/faq');
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



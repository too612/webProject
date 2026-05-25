import client from '../../../common/api/client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../types';
import type { FaqItem } from './FaqModel';

export const faqApi = {
  async getFaqItems(): Promise<FaqItem[]> {
    try {
      const response = await client.get<ApiResponse<FaqItem[]>>('/official/support/faq');
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'FAQ를 불러오지 못했습니다.'));
    }
  },
};

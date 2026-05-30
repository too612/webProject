import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import type { Pastor, PastorRequest } from './pastorModel';
import { getApiErrorMessage } from '../../../common/api/apiError';

export const pastorApi = {
  async getPastorProfile(): Promise<Pastor | null> {
    try {
      const response = await client.get<ApiResponse<Pastor>>('/official/about/pastor');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?댁엫紐⑹궗 ?뺣낫 議고쉶 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.'));
    }
  },

  async createPastorProfile(request: PastorRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/official/about/pastor', request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?댁엫紐⑹궗 ?뺣낫 ?깅줉 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.'));
    }
  },

  async updatePastorProfile(corpId: number, request: PastorRequest): Promise<void> {
    try {
      await client.put<ApiResponse<void>>(`/official/about/pastor/${corpId}`, request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?댁엫紐⑹궗 ?뺣낫 ?섏젙 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.'));
    }
  },

  async deletePastorProfile(corpId: number, updatedBy = 'system', updatedIp = '127.0.0.1'): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(`/official/about/pastor/${corpId}`, {
        params: { updatedBy, updatedIp },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?댁엫紐⑹궗 ?뺣낫 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.'));
    }
  },
};


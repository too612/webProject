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
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async createPastorProfile(request: PastorRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/official/about/pastor', request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async updatePastorProfile(corpId: number, request: PastorRequest): Promise<void> {
    try {
      await client.put<ApiResponse<void>>(`/official/about/pastor/${corpId}`, request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async deletePastorProfile(corpId: number, updatedBy = 'system', updatedIp = '127.0.0.1'): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(`/official/about/pastor/${corpId}`, {
        params: { updatedBy, updatedIp },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



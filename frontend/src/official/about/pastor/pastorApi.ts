import client from '../../../common/api/client';
import type { ApiResponse } from '../../../types';
import type { Pastor, PastorRequest } from './PastorModel';
import { getApiErrorMessage } from '../../../common/lib/apiError';

export const pastorApi = {
  async getPastorProfile(): Promise<Pastor | null> {
    try {
      const response = await client.get<ApiResponse<Pastor>>('/official/about/pastor');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '담임목사 정보 조회 중 오류가 발생했습니다.'));
    }
  },

  async createPastorProfile(request: PastorRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/official/about/pastor', request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '담임목사 정보 등록 중 오류가 발생했습니다.'));
    }
  },

  async updatePastorProfile(corpId: number, request: PastorRequest): Promise<void> {
    try {
      await client.put<ApiResponse<void>>(`/official/about/pastor/${corpId}`, request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '담임목사 정보 수정 중 오류가 발생했습니다.'));
    }
  },

  async deletePastorProfile(corpId: number, updatedBy = 'system', updatedIp = '127.0.0.1'): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(`/official/about/pastor/${corpId}`, {
        params: { updatedBy, updatedIp },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '담임목사 정보 삭제 중 오류가 발생했습니다.'));
    }
  },
};

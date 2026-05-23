import client from './client';
import type { ApiResponse } from '../types';

export type Pastor = {
  corpId: number;
  corpName: string;
  businessRegistrationNumber: string;
  chiefName: string;
  chiefImagePath?: string;
  phoneNumber?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  introduction?: string;
  updatedAt?: string;
};

export type PastorRequest = {
  corpName: string;
  businessRegistrationNumber: string;
  chiefName: string;
  chiefImagePath?: string;
  phoneNumber?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  introduction?: string;
  createdBy?: string;
  createdIp?: string;
  updatedBy?: string;
  updatedIp?: string;
};

type ApiFailure = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  return (error as ApiFailure)?.response?.data?.message ?? fallbackMessage;
}

export const aboutApi = {
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

import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { isSystemIndexData, type SystemIndexData } from './systemIndexModel';

export const systemIndexApi = {
  async getIndexData(): Promise<SystemIndexData> {
    try {
      const response = await client.get<ApiResponse<unknown>>('/system/index');
      if (!response.data.success || response.data.statusCode !== 200) {
        throw new Error(response.data.message || '시스템 현황 조회에 실패했습니다.');
      }
      if (!isSystemIndexData(response.data.data)) {
        throw new Error('시스템 대시보드 응답 형식 또는 집계 합계가 올바르지 않습니다.');
      }
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(getApiErrorMessage(error, error.message));
      }
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};


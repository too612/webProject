import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CongregationContent } from './congregationModel';

function isCongregationItem(value: unknown): value is CongregationContent['congregations'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CongregationContent['congregations'][number]>;
  return typeof candidate.title === 'string' && typeof candidate.description === 'string';
}

function isCongregationContent(value: unknown): value is CongregationContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CongregationContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && Array.isArray(candidate.congregations)
    && candidate.congregations.every((congregation) => isCongregationItem(congregation))
  );
}

export const congregationApi = {
  async getCongregationContent(): Promise<CongregationContent | null> {
    try {
      const response = await client.get<ApiResponse<CongregationContent>>('/official/about/congregation');
      const payload = response.data.data;
      return isCongregationContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



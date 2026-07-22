import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { PeopleContent } from './peopleModel';

function isPeopleContent(value: unknown): value is PeopleContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PeopleContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && !!candidate.pastor
    && typeof candidate.pastor === 'object'
    && Array.isArray(candidate.leaders)
  );
}

export const peopleApi = {
  async getPeopleContent(): Promise<PeopleContent | null> {
    try {
      const response = await client.get<ApiResponse<PeopleContent>>('/official/about/people');
      const payload = response.data.data;
      return isPeopleContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
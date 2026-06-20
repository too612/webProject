import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { PeopleContent } from './peopleModel';

function isPeopleCard(value: unknown): value is PeopleContent['coreVisions'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PeopleContent['coreVisions'][number]>;
  return typeof candidate.title === 'string' && typeof candidate.description === 'string';
}

function isPeopleContent(value: unknown): value is PeopleContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PeopleContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && Array.isArray(candidate.coreVisions)
    && candidate.coreVisions.every((item) => isPeopleCard(item))
    && Array.isArray(candidate.ministryDirections)
    && candidate.ministryDirections.every((direction) => typeof direction === 'string')
    && typeof candidate.bibleVerse === 'string'
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
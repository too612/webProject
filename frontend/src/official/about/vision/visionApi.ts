import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { VisionContent } from './visionModel';

function isVisionCard(value: unknown): value is VisionContent['coreVisions'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<VisionContent['coreVisions'][number]>;
  return typeof candidate.title === 'string' && typeof candidate.description === 'string';
}

function isVisionContent(value: unknown): value is VisionContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<VisionContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && Array.isArray(candidate.coreVisions)
    && candidate.coreVisions.every((item) => isVisionCard(item))
    && Array.isArray(candidate.ministryDirections)
    && candidate.ministryDirections.every((direction) => typeof direction === 'string')
    && typeof candidate.bibleVerse === 'string'
  );
}

export const visionApi = {
  async getVisionContent(): Promise<VisionContent | null> {
    try {
      const response = await client.get<ApiResponse<VisionContent>>('/official/about/vision');
      const payload = response.data.data;
      return isVisionContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



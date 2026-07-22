import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CourseContent } from './courseModel';

function isCourseContent(value: unknown): value is CourseContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CourseContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && Array.isArray(candidate.steps)
  );
}

export const courseApi = {
  async getCourseContent(): Promise<CourseContent | null> {
    try {
      const response = await client.get<ApiResponse<CourseContent>>('/official/training/course');
      const payload = response.data.data;
      return isCourseContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
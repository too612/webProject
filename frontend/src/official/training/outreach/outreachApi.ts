import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { OutreachContent } from './outreachModel';

function isOutreachItem(value: unknown): value is OutreachContent['activities'][number] {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<OutreachContent['activities'][number]>;
  return typeof c.title === 'string' && typeof c.description === 'string';
}

function isOutreachContent(value: unknown): value is OutreachContent {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<OutreachContent>;
  return typeof c.headline === 'string' && typeof c.summary === 'string' && Array.isArray(c.activities) && c.activities.every((a) => isOutreachItem(a));
}

export const outreachApi = {
  async getOutreachContent(): Promise<OutreachContent | null> {
    try {
      const response = await client.get<ApiResponse<OutreachContent>>('/official/training/outreach');
      const payload = response.data.data;
      return isOutreachContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { BeliefsContent } from './beliefsModel';

function isBeliefItem(value: unknown): value is BeliefsContent['beliefs'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BeliefsContent['beliefs'][number]>;
  return typeof candidate.title === 'string' && typeof candidate.description === 'string';
}

function isBeliefsContent(value: unknown): value is BeliefsContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BeliefsContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && Array.isArray(candidate.beliefs)
    && candidate.beliefs.every((belief) => isBeliefItem(belief))
    && typeof candidate.footerNote === 'string'
  );
}

export const beliefsApi = {
  async getBeliefsContent(): Promise<BeliefsContent | null> {
    try {
      const response = await client.get<ApiResponse<BeliefsContent>>('/official/about/beliefs');
      const payload = response.data.data;
      return isBeliefsContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '? ì•™ê³ ë°± ?•ë³´ë¥?ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??'));
    }
  },
};

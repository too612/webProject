import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import type { CommunityIndexData } from './communityIndexModel';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isDestination(value: Record<string, unknown>): boolean {
  return typeof value.path === 'string'
    && /^\/community\/(group|facilities|saint|world)\/[a-z0-9]+$/.test(value.path)
    && typeof value.param === 'string';
}

function isStats(value: unknown): boolean {
  return isRecord(value)
    && ['totalPosts', 'contributors', 'currentMonthPosts', 'totalViews', 'periodPosts'].every(
      (key) => isCount(value[key]),
    );
}

function isCommunityIndexData(value: unknown): value is CommunityIndexData {
  if (!isRecord(value) || value.source !== 'LIVE'
    || !isDate(value.asOf) || !isDate(value.periodStart) || !isDate(value.periodEnd)
    || !isStats(value.stats)
    || !Array.isArray(value.monthlyPosts) || value.monthlyPosts.length !== 6
    || !value.monthlyPosts.every((item: unknown) => isRecord(item)
      && typeof item.month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(item.month) && isCount(item.count))
    || !Array.isArray(value.categories)
    || !value.categories.every((item: unknown) => isRecord(item) && isDestination(item)
      && typeof item.code === 'string' && typeof item.label === 'string'
      && isCount(item.count) && isCount(item.periodCount))
    || !Array.isArray(value.recentPosts)
    || !value.recentPosts.every((item: unknown) => isRecord(item) && isDestination(item)
      && typeof item.category === 'string' && typeof item.title === 'string'
      && (item.date === '' || isDate(item.date)) && isCount(item.views))) {
    return false;
  }
  return true;
}

export const communityIndexApi = {
  async getIndexData(): Promise<CommunityIndexData> {
    try {
      const response = await client.get<ApiResponse<unknown>>('/community/index');
      if (response.data.statusCode !== 200 || !response.data.success) {
        throw new Error(response.data.message || '커뮤니티 현황을 불러오지 못했습니다.');
      }
      if (!isCommunityIndexData(response.data.data)) {
        throw new Error('커뮤니티 대시보드 응답 형식이 올바르지 않습니다.');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '커뮤니티 현황을 불러오지 못했습니다.'));
    }
  },
};

import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_OFFICIAL_INDEX_DATA, type OfficialIndexData } from './officialIndexModel';

function isOfficialIndexItem(value: unknown): value is OfficialIndexData['recentSermons'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<OfficialIndexData['recentSermons'][number]>;
  return typeof candidate.id === 'string'
    && typeof candidate.title === 'string'
    && typeof candidate.date === 'string';
}

function isOfficialIndexData(value: unknown): value is OfficialIndexData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<OfficialIndexData>;
  return Array.isArray(candidate.recentSermons)
    && candidate.recentSermons.every((item) => isOfficialIndexItem(item))
    && Array.isArray(candidate.recentAnnouncements)
    && candidate.recentAnnouncements.every((item) => isOfficialIndexItem(item));
}

export const officialIndexApi = {
  async getIndexData(): Promise<OfficialIndexData> {
    try {
      const response = await client.get<ApiResponse<OfficialIndexData>>('/official/index');
      const payload = response.data.data;
      return isOfficialIndexData(payload) ? payload : EMPTY_OFFICIAL_INDEX_DATA;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '硫붿씤 ?붾㈃ ?뺣낫瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};


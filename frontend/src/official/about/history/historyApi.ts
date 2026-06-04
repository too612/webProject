import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { HistoryContent } from './historyModel';

function isHistoryTimelineItem(value: unknown): value is HistoryContent['timeline'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<HistoryContent['timeline'][number]>;
  const isEventItem = (event: unknown): boolean => {
    if (!event || typeof event !== 'object') {
      return false;
    }

    const eventCandidate = event as { date?: unknown; description?: unknown; images?: unknown };
    const validImages =
      eventCandidate.images === undefined
      || (Array.isArray(eventCandidate.images) && eventCandidate.images.every((image) => typeof image === 'string'));

    return typeof eventCandidate.date === 'string'
      && typeof eventCandidate.description === 'string'
      && validImages;
  };

  return typeof candidate.year === 'string'
    && Array.isArray(candidate.events)
    && candidate.events.every((event) => isEventItem(event));
}

function isHistoryContent(value: unknown): value is HistoryContent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<HistoryContent>;
  return (
    typeof candidate.headline === 'string'
    && typeof candidate.summary === 'string'
    && Array.isArray(candidate.timeline)
    && candidate.timeline.every((item) => isHistoryTimelineItem(item))
  );
}

export const historyApi = {
  async getHistoryContent(): Promise<HistoryContent | null> {
    try {
      const response = await client.get<ApiResponse<HistoryContent>>('/official/about/history');
      const payload = response.data.data;
      return isHistoryContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};



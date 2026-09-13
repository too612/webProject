import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { HistoryContent, HistoryRequest } from './historyModel';

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
    Array.isArray(candidate.timeline)
    && candidate.timeline.every((item) => isHistoryTimelineItem(item))
  );
}

export const historyApi = {
  async getHistoryContent(): Promise<HistoryContent | null> {
    try {
      const response = await client.get<ApiResponse<HistoryContent>>('/official/about/history/getInfo');
      const payload = response.data.data;
      return isHistoryContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async setCreate(request: HistoryRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/official/about/history/setCreate', request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '연혁 정보 등록에 실패했습니다.'));
    }
  },

  async setUpdate(request: HistoryRequest): Promise<void> {
    try {
      await client.put<ApiResponse<void>>('/official/about/history/setUpdate', request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '연혁 정보 수정에 실패했습니다.'));
    }
  },

  async delRemove(): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>('/official/about/history/delRemove');
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '연혁 정보 삭제에 실패했습니다.'));
    }
  },
};



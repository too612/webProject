import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import type { Pastor, PastorRequest } from './pastorModel';
import { getApiErrorMessage } from '../../../common/lib/apiError';

export const pastorApi = {
  async getPastorProfile(): Promise<Pastor | null> {
    try {
      const response = await client.get<ApiResponse<Pastor>>('/official/about/pastor');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?´ì„ëª©ì‚¬ ?•ë³´ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'));
    }
  },

  async createPastorProfile(request: PastorRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/official/about/pastor', request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?´ì„ëª©ì‚¬ ?•ë³´ ?±ë¡ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'));
    }
  },

  async updatePastorProfile(corpId: number, request: PastorRequest): Promise<void> {
    try {
      await client.put<ApiResponse<void>>(`/official/about/pastor/${corpId}`, request);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?´ì„ëª©ì‚¬ ?•ë³´ ?˜ì • ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'));
    }
  },

  async deletePastorProfile(corpId: number, updatedBy = 'system', updatedIp = '127.0.0.1'): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(`/official/about/pastor/${corpId}`, {
        params: { updatedBy, updatedIp },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '?´ì„ëª©ì‚¬ ?•ë³´ ?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'));
    }
  },
};

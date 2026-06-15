import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import type { CommentItem } from './CommentModel';

const BASE_URL = '/common/comment';

export const commentApi = {
  async getList(pgmId: string, refId: string | number) {
    const response = await client.get<ApiResponse<CommentItem[]>>(`${BASE_URL}`, { params: { pgmId, refId } });
    return response.data.data ?? [];
  },

  async save(payload: any) {
    const response = await client.post<ApiResponse<void>>(`${BASE_URL}/save`, payload);
    return response.data;
  },

  async vote(commentId: number | string, action: 'like' | 'dislike') {
    const response = await client.post<ApiResponse<{ likes: number; dislikes: number; userVote?: string }>>(
      `${BASE_URL}/vote`, { commentId, action }
    );
    return response.data.data;
  },

  /** 비밀댓글 비밀번호 확인 */
  async checkPassword(commentId: number | string, password: string): Promise<boolean> {
    try {
      const response = await client.post<ApiResponse<boolean>>(
        `${BASE_URL}/check-password`,
        { commentId: String(commentId), password }
      );
      return response.data.data ?? false;
    } catch {
      return false;
    }
  },
};

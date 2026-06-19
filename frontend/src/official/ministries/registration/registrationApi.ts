import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import type { BoardItem as BoardDto, CommentItem as CommentDto } from '../../../common/board/board.types';
import { REGISTRATION_API_BASE_PATH } from './registrationModel';

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type BoardViewPayload = {
  board: BoardDto;
  comments: CommentDto[];
  commentCount: number;
};

type BoardListQuery = {
  page?: number;
  searchType?: string;
  keyword?: string;
};

function appendIfPresent(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
}

export const registrationApi = {
  async getBoardList(query: BoardListQuery = {}) {
    const response = await client.get<ApiResponse<SpringPage<BoardDto>>>(REGISTRATION_API_BASE_PATH, {
      params: {
        page: query.page ?? 0,
        searchType: query.searchType,
        keyword: query.keyword,
      },
    });
    const page = response.data.data;
    return {
      items: page?.content ?? [],
      page: page?.number ?? 0,
      size: page?.size ?? 10,
      totalElements: page?.totalElements ?? 0,
      totalPages: page?.totalPages ?? 0,
      isFirst: page?.first ?? true,
      isLast: page?.last ?? true,
    };
  },

  async getBoardView(rqstNo: string) {
    const response = await client.get<ApiResponse<BoardViewPayload>>(`${REGISTRATION_API_BASE_PATH}/view`, { params: { rqstNo } });
    const data = response.data.data;
    return { board: data?.board ?? null, comments: data?.comments ?? [], commentCount: data?.commentCount ?? 0 };
  },

  async getWriteForm(rqstNo?: string) {
    const response = await client.get<ApiResponse<BoardDto>>(`${REGISTRATION_API_BASE_PATH}/write`, { params: rqstNo ? { rqstNo } : undefined });
    return response.data.data ?? null;
  },

  async getReplyForm(parentNo: string) {
    const response = await client.get<ApiResponse<BoardDto>>(`${REGISTRATION_API_BASE_PATH}/reply`, { params: { parentNo } });
    return response.data.data ?? null;
  },

  async saveComment(data: { boardNo: string; content: string; writer?: string; secret?: string; spoiler?: string; password?: string; parentCommentId?: number }) {
    const formData = new URLSearchParams();
    formData.set('boardNo', data.boardNo); formData.set('content', data.content);
    if (data.writer) formData.set('writer', data.writer);
    if (data.secret) formData.set('secret', data.secret);
    if (data.spoiler) formData.set('spoiler', data.spoiler);
    if (data.password) formData.set('password', data.password);
    if (data.parentCommentId != null) formData.set('parentCommentId', String(data.parentCommentId));
    const response = await client.post<ApiResponse<{ boardNo: string }>>(`${REGISTRATION_API_BASE_PATH}/comment/write`, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    return response.data;
  },

  async saveBoard(payload: Partial<BoardDto>, files: File[] = []) {
    const formData = new FormData();
    ['title','cont','rqstId','secret','password','boardType','rqstNo','parentNo','depth','orderNo'].forEach(k => { if (payload[k] !== undefined) formData.append(k, String(payload[k])); });
    files.forEach(f => formData.append('files', f));
    const response = await client.post<ApiResponse<{ basePath?: string; rqstNo?: string }>>(`${REGISTRATION_API_BASE_PATH}/write`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data.data ?? null;
  },

  async updateBoard(payload: Partial<BoardDto>, files: File[] = []) {
    const formData = new FormData();
    ['rqstNo','title','cont','rqstId','secret','password','boardType'].forEach(k => { if (payload[k] !== undefined) formData.append(k, String(payload[k])); });
    files.forEach(f => formData.append('files', f));
    const response = await client.post<ApiResponse<{ rqstNo?: string }>>(`${REGISTRATION_API_BASE_PATH}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data.data ?? null;
  },

  async deleteBoard(rqstNo: string) {
    await client.post(`${REGISTRATION_API_BASE_PATH}/delete`, new URLSearchParams({ rqstNo }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  },

  async checkPassword(rqstNo: string, password: string) {
    try {
      const response = await client.post<ApiResponse<BoardViewPayload>>(`${REGISTRATION_API_BASE_PATH}/view`, new URLSearchParams({ rqstNo, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      return response.data.success;
    } catch { return false; }
  },

  async voteComment(commentId: number | string, action: 'like' | 'dislike') {
    const response = await client.post<ApiResponse<{ likes: number; dislikes: number; userVote: string }>>(`${REGISTRATION_API_BASE_PATH}/comment/vote`, { commentId: String(commentId), action }, { headers: { 'Content-Type': 'application/json' } });
    return response.data.data ?? null;
  },
};
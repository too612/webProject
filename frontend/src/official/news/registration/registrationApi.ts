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
    const response = await client.get<ApiResponse<BoardViewPayload>>(`${REGISTRATION_API_BASE_PATH}/view`, {
      params: { rqstNo },
    });

    const data = response.data.data;
    return {
      board: data?.board ?? null,
      comments: data?.comments ?? [],
      commentCount: data?.commentCount ?? 0,
    };
  },

  async getWriteForm(rqstNo?: string) {
    const response = await client.get<ApiResponse<BoardDto>>(`${REGISTRATION_API_BASE_PATH}/write`, {
      params: rqstNo ? { rqstNo } : undefined,
    });
    return response.data.data ?? null;
  },

  async getReplyForm(parentNo: string) {
    const response = await client.get<ApiResponse<BoardDto>>(`${REGISTRATION_API_BASE_PATH}/reply`, {
      params: { parentNo },
    });
    return response.data.data ?? null;
  },

  async saveComment(data: {
    boardNo: string;
    content: string;
    writer?: string;
    secret?: string;
    spoiler?: string;
    password?: string;
    parentCommentId?: number;
  }) {
    const formData = new URLSearchParams();
    formData.set('boardNo', data.boardNo);
    formData.set('content', data.content);
    if (data.writer) formData.set('writer', data.writer);
    if (data.secret) formData.set('secret', data.secret);
    if (data.spoiler) formData.set('spoiler', data.spoiler);
    if (data.password) formData.set('password', data.password);
    if (data.parentCommentId != null) formData.set('parentCommentId', String(data.parentCommentId));

    const response = await client.post<ApiResponse<{ boardNo: string }>>(
      `${REGISTRATION_API_BASE_PATH}/comment/write`,
      formData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data;
  },

  async saveBoard(payload: Partial<BoardDto>, files: File[] = []) {
    const formData = new FormData();
    appendIfPresent(formData, 'title', payload.title);
    appendIfPresent(formData, 'cont', payload.cont);
    appendIfPresent(formData, 'rqstId', payload.rqstId);
    appendIfPresent(formData, 'secret', payload.secret);
    appendIfPresent(formData, 'password', payload.password);
    appendIfPresent(formData, 'boardType', payload.boardType);
    appendIfPresent(formData, 'rqstNo', payload.rqstNo);
    appendIfPresent(formData, 'parentNo', payload.parentNo);
    appendIfPresent(formData, 'depth', payload.depth);
    appendIfPresent(formData, 'orderNo', payload.orderNo);

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await client.post<ApiResponse<{ basePath?: string; rqstNo?: string }>>(
      `${REGISTRATION_API_BASE_PATH}/write`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data ?? null;
  },

  async updateBoard(payload: Partial<BoardDto>, files: File[] = []) {
    const formData = new FormData();
    appendIfPresent(formData, 'rqstNo', payload.rqstNo);
    appendIfPresent(formData, 'title', payload.title);
    appendIfPresent(formData, 'cont', payload.cont);
    appendIfPresent(formData, 'rqstId', payload.rqstId);
    appendIfPresent(formData, 'secret', payload.secret);
    appendIfPresent(formData, 'password', payload.password);
    appendIfPresent(formData, 'boardType', payload.boardType);

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await client.post<ApiResponse<{ rqstNo?: string }>>(
      `${REGISTRATION_API_BASE_PATH}/update`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data ?? null;
  },

  async deleteBoard(rqstNo: string) {
    const payload = new URLSearchParams();
    payload.set('rqstNo', rqstNo);

    await client.post(`${REGISTRATION_API_BASE_PATH}/delete`, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  async checkPassword(rqstNo: string, password: string) {
    const payload = new URLSearchParams();
    payload.set('rqstNo', rqstNo);
    payload.set('password', password);

    try {
      const response = await client.post<ApiResponse<BoardViewPayload>>(`${REGISTRATION_API_BASE_PATH}/view`, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.success;
    } catch {
      return false;
    }
  },

  async voteComment(commentId: number | string, action: 'like' | 'dislike') {
    const response = await client.post<ApiResponse<{ likes: number; dislikes: number; userVote: string }>>(
      `${REGISTRATION_API_BASE_PATH}/comment/vote`,
      { commentId: String(commentId), action },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.data ?? null;
  },
};

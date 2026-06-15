import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import type { BoardItem as BoardDto, CommentItem as CommentDto } from '../../../common/board/board.types';
import { SERMONS_API_BASE_PATH } from './sermonsModel';

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
  commentCount: number;
};

type BoardListQuery = {
  page?: number;
  searchType?: string;
  keyword?: string;
  worshipType?: string;
};

function appendIfPresent(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
}

export const sermonsApi = {
  async getBoardList(query: BoardListQuery = {}) {
    const response = await client.get<ApiResponse<SpringPage<BoardDto>>>(SERMONS_API_BASE_PATH, {
      params: {
        page: query.page ?? 0,
        searchType: query.searchType,
        keyword: query.keyword,
        worshipType: query.worshipType,
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

  async getBoardView(rqstNo: string, password?: string) {
    const response = await client.get<ApiResponse<BoardViewPayload>>(`${SERMONS_API_BASE_PATH}/view`, {
      params: { rqstNo, password },
    });

    const data = response.data.data;
    return {
      board: data?.board ?? null,
      commentCount: data?.commentCount ?? 0,
    };
  },

  async getWriteForm(rqstNo?: string) {
    const response = await client.get<ApiResponse<BoardDto>>(`${SERMONS_API_BASE_PATH}/write`, {
      params: rqstNo ? { rqstNo } : undefined,
    });
    return response.data.data ?? null;
  },

  async getReplyForm(parentNo: string) {
    const response = await client.get<ApiResponse<BoardDto>>(`${SERMONS_API_BASE_PATH}/reply`, {
      params: { parentNo },
    });
    return response.data.data ?? null;
  },

  async saveBoard(payload: Partial<BoardDto>) {
    const formData = new FormData();
    appendIfPresent(formData, 'title', payload.title);
    appendIfPresent(formData, 'cont', payload.cont);
    appendIfPresent(formData, 'rqstId', payload.rqstId);
    appendIfPresent(formData, 'preacherName', payload.preacherName);
    appendIfPresent(formData, 'scriptureReference', payload.scriptureReference);
    appendIfPresent(formData, 'sermonDate', payload.sermonDate);
    appendIfPresent(formData, 'worshipType', payload.worshipType);
    appendIfPresent(formData, 'secret', payload.secret);
    appendIfPresent(formData, 'password', payload.password);
    appendIfPresent(formData, 'boardType', payload.boardType);
    appendIfPresent(formData, 'rqstNo', payload.rqstNo);
    appendIfPresent(formData, 'parentNo', payload.parentNo);
    appendIfPresent(formData, 'depth', payload.depth);
    appendIfPresent(formData, 'orderNo', payload.orderNo);

    const response = await client.post<ApiResponse<{ basePath?: string; rqstNo?: string }>>(
      `${SERMONS_API_BASE_PATH}/write`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data ?? null;
  },

  async updateBoard(payload: Partial<BoardDto>) {
    const formData = new FormData();
    appendIfPresent(formData, 'rqstNo', payload.rqstNo);
    appendIfPresent(formData, 'title', payload.title);
    appendIfPresent(formData, 'cont', payload.cont);
    appendIfPresent(formData, 'rqstId', payload.rqstId);
    appendIfPresent(formData, 'preacherName', payload.preacherName);
    appendIfPresent(formData, 'scriptureReference', payload.scriptureReference);
    appendIfPresent(formData, 'sermonDate', payload.sermonDate);
    appendIfPresent(formData, 'worshipType', payload.worshipType);
    appendIfPresent(formData, 'secret', payload.secret);
    appendIfPresent(formData, 'password', payload.password);
    appendIfPresent(formData, 'boardType', payload.boardType);

    const response = await client.post<ApiResponse<{ rqstNo?: string }>>(
      `${SERMONS_API_BASE_PATH}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data ?? null;
  },

  async deleteBoard(rqstNo: string) {
    const payload = new URLSearchParams();
    payload.set('rqstNo', rqstNo);

    await client.post(`${SERMONS_API_BASE_PATH}/delete`, payload, {
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
      const response = await client.post<ApiResponse<BoardViewPayload>>(`${SERMONS_API_BASE_PATH}/view`, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.success;
    } catch {
      return false;
    }
  },

};

/**
 * File Name   : sermonsApi
 * Description : 설교 게시판 API 통신 모듈
 * -----------------------------------------------------------------------------
 * ERP 수준 정렬/필터를 지원하도록 getBoardList 확장됨
 * board.types 대신 sermonsModel의 타입 사용
 */

import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { SERMONS_API_BASE_PATH } from './sermonsModel';
import type { SermonItem, SermonFileItem } from './sermonsModel';

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
  board: SermonItem;
  commentCount: number;
};

/**
 * 목록 조회 쿼리 파라미터 (ERP 수준 확장)
 */
type BoardListQuery = {
  page?: number;
  size?: number;
  searchType?: string;
  keyword?: string;
  worshipType?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
};

function appendIfPresent(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
}

export const sermonsApi = {
  /**
   * 설교 목록 조회 (ERP 수준 정렬/필터 지원)
   */
  async getBoardList(query: BoardListQuery = {}) {
    const response = await client.get<ApiResponse<SpringPage<SermonItem>>>(SERMONS_API_BASE_PATH, {
      params: {
        page: query.page ?? 0,
        size: query.size ?? 10,
        searchType: query.searchType,
        keyword: query.keyword,
        worshipType: query.worshipType,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
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

  /**
   * 설교 상세 조회 (비밀번호 선택적 전달)
   */
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

  /**
   * 작성 폼 데이터 조회 (수정 시 기존 데이터 로드)
   */
  async getWriteForm(rqstNo?: string) {
    const response = await client.get<ApiResponse<SermonItem>>(`${SERMONS_API_BASE_PATH}/write`, {
      params: rqstNo ? { rqstNo } : undefined,
    });
    return response.data.data ?? null;
  },

  /**
   * 답글 작성 폼 데이터 조회 (부모 게시글 정보 로드)
   */
  async getReplyForm(parentNo: string) {
    const response = await client.get<ApiResponse<SermonItem>>(`${SERMONS_API_BASE_PATH}/reply`, {
      params: { parentNo },
    });
    return response.data.data ?? null;
  },

  /**
   * 게시글 저장 (신규 등록)
   */
  async saveBoard(payload: Partial<SermonItem>) {
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

  /**
   * 게시글 수정
   */
  async updateBoard(payload: Partial<SermonItem>) {
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

  /**
   * 게시글 삭제 (소프트 삭제)
   */
  async deleteBoard(rqstNo: string) {
    const payload = new URLSearchParams();
    payload.set('rqstNo', rqstNo);

    await client.post(`${SERMONS_API_BASE_PATH}/delete`, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  /**
   * 비밀번호 확인 (POST /view)
   */
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
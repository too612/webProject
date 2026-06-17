/**
 * File Name   : sermonsHook
 * Description : 설교 게시판 통합 비즈니스 로직 훅
 * -----------------------------------------------------------------------------
 * pastorHook 패턴을 따르며, sermonsModel의 타입을 사용합니다.
 */

import { useCallback, useState, useRef } from 'react';
import { sermonsApi } from './sermonsApi';
import type { SermonItem, SermonListItem } from './sermonsModel';

/****************************************************************************************************
 * 타입 정의
 ****************************************************************************************************/

/** 목록 검색 파라미터 */
export type SermonsListParams = {
  page: number;
  searchType?: string;
  keyword?: string;
  worshipType?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
};

/** 작성 폼 상태 */
export type SermonsWriteForm = {
  title: string;
  author: string;
  preacherName: string;
  scriptureReference: string;
  sermonDate: string;
  worshipType: string;
  content: string;
  secret: boolean;
  password: string;
  confirmPassword: string;
};

/** Hook 반환 타입 */
export type UseSermonsReturn = {
  // ===== 목록 관련 =====
  items: SermonItem[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  page: number;
  setPage: (page: number) => void;
  listLoading: boolean;
  listError: string | null;
  loadList: (params?: Partial<SermonsListParams>) => Promise<void>;

  // ===== 상세 관련 =====
  board: SermonItem | null;
  commentCount: number;
  viewLoading: boolean;
  viewError: string | null;
  loadView: (rqstNo: string, password?: string) => Promise<void>;
  checkPassword: (rqstNo: string, password: string) => Promise<boolean>;
  deleteBoard: (rqstNo: string) => Promise<void>;

  // ===== 작성 관련 =====
  form: SermonsWriteForm;
  setForm: React.Dispatch<React.SetStateAction<SermonsWriteForm>>;
  writeLoading: boolean;
  writeError: string | null;
  saveBoard: (payload: any, isEdit: boolean, isReply: boolean) => Promise<string | undefined>;
  resetWriteForm: () => void;

  // ===== 공통 =====
  globalLoading: boolean;
  globalError: string | null;
  clearError: () => void;
};

/****************************************************************************************************
 * 상수
 ****************************************************************************************************/

const INITIAL_FORM: SermonsWriteForm = {
  title: '',
  author: '',
  preacherName: '',
  scriptureReference: '',
  sermonDate: '',
  worshipType: 'SUNDAY',
  content: '',
  secret: false,
  password: '',
  confirmPassword: '',
};

/****************************************************************************************************
 * Hook 구현
 ****************************************************************************************************/

export function useSermons(): UseSermonsReturn {
  // ===== 목록 상태 =====
  const [items, setItems] = useState<SermonItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // ===== 상세 상태 =====
  const [board, setBoard] = useState<SermonItem | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // ===== 작성 상태 =====
  const [form, setForm] = useState<SermonsWriteForm>(INITIAL_FORM);
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);

  // ===== 공통 상태 =====
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const loadingRef = useRef<string | null>(null);

  /****************************************************************************************************
   * 목록 관련 메서드
   ****************************************************************************************************/

  const loadList = useCallback(async (params: Partial<SermonsListParams> = {}) => {
    const { page: pageParam, searchType, keyword, worshipType, sortField, sortOrder } = params;
    const currentPage = pageParam ?? page;

    setListLoading(true);
    setListError(null);

    try {
      const data = await sermonsApi.getBoardList({
        page: currentPage,
        size: 10,
        searchType,
        keyword,
        worshipType,
        sortField,
        sortOrder,
      });

      setItems(data.items ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
      setPageSize(data.size ?? 10);
      if (pageParam !== undefined) setPage(pageParam);
    } catch (err) {
      const message = err instanceof Error ? err.message : '목록을 불러오지 못했습니다.';
      setListError(message);
      setItems([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setListLoading(false);
    }
  }, [page]);

  /****************************************************************************************************
   * 상세 관련 메서드
   ****************************************************************************************************/

  const loadView = useCallback(async (rqstNo: string, password?: string) => {
    const key = password ? `${rqstNo}:${password}` : rqstNo;
    if (loadingRef.current === key) return;
    loadingRef.current = key;

    setViewLoading(true);
    setViewError(null);

    try {
      const data = await sermonsApi.getBoardView(rqstNo, password);
      setBoard(data.board ?? null);
      setCommentCount(data.commentCount ?? 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.';
      setViewError(message);
      setBoard(null);
      setCommentCount(0);
    } finally {
      setViewLoading(false);
      loadingRef.current = null;
    }
  }, []);

  const checkPassword = useCallback(async (rqstNo: string, password: string): Promise<boolean> => {
    try {
      return await sermonsApi.checkPassword(rqstNo, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : '비밀번호 확인 중 오류가 발생했습니다.';
      setViewError(message);
      return false;
    }
  }, []);

  const deleteBoard = useCallback(async (rqstNo: string) => {
    setViewLoading(true);
    setViewError(null);
    try {
      await sermonsApi.deleteBoard(rqstNo);
    } catch (err) {
      const message = err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.';
      setViewError(message);
      throw err;
    } finally {
      setViewLoading(false);
    }
  }, []);

  /****************************************************************************************************
   * 작성 관련 메서드
   ****************************************************************************************************/

  const saveBoard = useCallback(async (
    payload: any,
    isEdit: boolean,
    _isReply: boolean
  ): Promise<string | undefined> => {
    setWriteLoading(true);
    setWriteError(null);
    setGlobalLoading(true);

    try {
      let savedRqstNo: string | undefined;
      if (isEdit) {
        await sermonsApi.updateBoard(payload);
        savedRqstNo = payload.rqstNo;
      } else {
        const result = await sermonsApi.saveBoard(payload);
        savedRqstNo = result?.rqstNo ?? payload.rqstNo;
      }
      return savedRqstNo;
    } catch (err) {
      const message = err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.';
      setWriteError(message);
      throw err;
    } finally {
      setWriteLoading(false);
      setGlobalLoading(false);
    }
  }, []);

  const resetWriteForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setWriteError(null);
  }, []);

  /****************************************************************************************************
   * 공통 메서드
   ****************************************************************************************************/

  const clearError = useCallback(() => {
    setListError(null);
    setViewError(null);
    setWriteError(null);
    setGlobalError(null);
  }, []);

  /****************************************************************************************************
   * 반환
   ****************************************************************************************************/

  return {
    items,
    totalElements,
    totalPages,
    pageSize,
    page,
    setPage,
    listLoading,
    listError,
    loadList,
    board,
    commentCount,
    viewLoading,
    viewError,
    loadView,
    checkPassword,
    deleteBoard,
    form,
    setForm,
    writeLoading,
    writeError,
    saveBoard,
    resetWriteForm,
    globalLoading,
    globalError,
    clearError,
  };
}
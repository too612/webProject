/**
 * File Name   : bannerHook
 * Description : 배너 관리 상태 및 유스케이스
 */
import { useState, useCallback } from 'react';
import { bannerApi } from './bannerApi';
import type { BannerDto, BannerRequest, BannerType } from './bannerModel';

interface BannerHookState {
  list: BannerDto[];
  detail: BannerDto | null;
  loading: boolean;
  error: string | null;
}

export function useBanner() {
  const [state, setState] = useState<BannerHookState>({
    list: [],
    detail: null,
    loading: false,
    error: null,
  });

  const loadList = useCallback(async (boardType: BannerType) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const list = await bannerApi.getList(boardType);
      setState((prev) => ({ ...prev, list, loading: false }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message, loading: false }));
    }
  }, []);

  const loadDetail = useCallback(async (rqstNo: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const detail = await bannerApi.getDetail(rqstNo);
      setState((prev) => ({ ...prev, detail, loading: false }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message, loading: false }));
    }
  }, []);

  const save = useCallback(async (request: BannerRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await bannerApi.save(request);
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message, loading: false }));
      return false;
    }
  }, []);

  const remove = useCallback(async (rqstNo: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await bannerApi.remove(rqstNo);
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message, loading: false }));
      return false;
    }
  }, []);

  return { ...state, loadList, loadDetail, save, remove };
}
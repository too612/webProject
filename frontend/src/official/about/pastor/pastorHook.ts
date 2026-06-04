/**
 * File Name   : pastorHook
 * Description : 목회자소개 화면 상태 및 유스케이스 훅
 */

import { useCallback, useState } from 'react';
import { pastorApi } from './pastorApi';
import type { Pastor, PastorRequest } from './pastorModel';

/****************************************************************************************************
 * hook method (state, 공통 상태 초기화)
 ****************************************************************************************************/

export function usePastorProfile() {
  const [profile, setProfile] = useState<Pastor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /****************************************************************************************************
   * tran/data method (조회, 저장, 삭제 API 연동)
   ****************************************************************************************************/

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pastorApi.getInfo();
      setProfile(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (
    payload: PastorRequest,
    files: File[] = [],
    deletedFileIds: Array<string | number> = []
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (profile?.corpId) {
        const updateRequest: PastorRequest = {
          ...payload,
          deletedFileIds,
        };
        await pastorApi.setUpdate(profile.corpId, updateRequest, files);
      } else {
        await pastorApi.setCreate(payload, files);
      }
      const refreshed = await pastorApi.getInfo();
      setProfile(refreshed);
    } catch (e) {
      const message = e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [profile?.corpId]);

  const removeProfile = useCallback(async () => {
    if (!profile?.corpId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await pastorApi.delRemove(profile.corpId);
      setProfile(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [profile?.corpId]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    saveProfile,
    removeProfile,
  };
}

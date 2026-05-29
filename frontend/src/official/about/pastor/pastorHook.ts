import { useCallback, useState } from 'react';
import { pastorApi } from './pastorApi';
import type { Pastor, PastorRequest } from './pastorModel';

export function usePastorProfile() {
  const [profile, setProfile] = useState<Pastor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pastorApi.getPastorProfile();
      setProfile(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (payload: PastorRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (profile?.corpId) {
        await pastorApi.updatePastorProfile(profile.corpId, payload);
      } else {
        await pastorApi.createPastorProfile(payload);
      }
      const refreshed = await pastorApi.getPastorProfile();
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
      await pastorApi.deletePastorProfile(profile.corpId);
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

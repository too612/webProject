import { useCallback, useState } from 'react';
import { aboutApi, type Pastor, type PastorRequest } from '../api/aboutApi';

export function usePastorProfile() {
  const [profile, setProfile] = useState<Pastor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aboutApi.getPastorProfile();
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
        await aboutApi.updatePastorProfile(profile.corpId, payload);
      } else {
        await aboutApi.createPastorProfile(payload);
      }
      const refreshed = await aboutApi.getPastorProfile();
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
      await aboutApi.deletePastorProfile(profile.corpId);
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

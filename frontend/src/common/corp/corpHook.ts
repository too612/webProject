import { useCallback, useEffect, useState } from 'react';
import { corpApi } from './corpApi';
import type { CorpDto } from './corpModel';

export function useCorpInfo() {
  const [corpInfo, setCorpInfo] = useState<CorpDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCorpInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await corpApi.getCorpInfo();
      setCorpInfo(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '기관정보 조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCorpInfo();
  }, [loadCorpInfo]);

  return {
    corpInfo,
    addressLine1: corpInfo?.addressLine1 ?? '-',
    loading,
    error,
    reload: loadCorpInfo,
  };
}
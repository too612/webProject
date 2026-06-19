import { useCallback, useState } from 'react';
import { congregationApi } from './congregationApi';
import type { CongregationContent } from './congregationModel';

export function useCongregationContent() {
  const [congregationContent, setCongregationContent] = useState<CongregationContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCongregationContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await congregationApi.getCongregationContent();
      setCongregationContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    congregationContent,
    loading,
    error,
    loadCongregationContent,
  };
}
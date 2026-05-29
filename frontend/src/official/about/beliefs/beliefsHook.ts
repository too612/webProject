import { useCallback, useState } from 'react';
import { beliefsApi } from './beliefsApi';
import type { BeliefsContent } from './beliefsModel';

export function useBeliefsContent() {
  const [beliefsContent, setBeliefsContent] = useState<BeliefsContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBeliefsContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await beliefsApi.getBeliefsContent();
      setBeliefsContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    beliefsContent,
    loading,
    error,
    loadBeliefsContent,
  };
}

import { useCallback, useState } from 'react';
import { historyApi } from './historyApi';
import type { HistoryContent } from './historyModel';

export function useHistoryContent() {
  const [historyContent, setHistoryContent] = useState<HistoryContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistoryContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await historyApi.getHistoryContent();
      setHistoryContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    historyContent,
    loading,
    error,
    loadHistoryContent,
  };
}

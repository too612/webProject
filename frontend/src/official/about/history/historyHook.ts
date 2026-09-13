import { useCallback, useState } from 'react';
import { historyApi } from './historyApi';
import type { HistoryContent, HistoryRequest } from './historyModel';

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

  const hasExistingData = Boolean(
    historyContent && historyContent.timeline.length > 0,
  );

  const saveHistoryContent = useCallback(
    async (request: HistoryRequest): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        if (hasExistingData) {
          await historyApi.setUpdate(request);
        } else {
          await historyApi.setCreate(request);
        }
        const refreshed = await historyApi.getHistoryContent();
        setHistoryContent(refreshed);
      } catch (e) {
        const message = e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.';
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [hasExistingData],
  );

  const removeHistoryContent = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await historyApi.delRemove();
      setHistoryContent(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    historyContent,
    loading,
    error,
    loadHistoryContent,
    saveHistoryContent,
    removeHistoryContent,
  };
}

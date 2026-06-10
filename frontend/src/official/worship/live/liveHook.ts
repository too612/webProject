import { useCallback, useState } from 'react';
import { liveApi } from './liveApi';
import type { LiveItem } from './liveModel';

export function useLiveItems() {
  const [items, setItems] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLiveItems = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await liveApi.getLiveItems(category);
      setItems(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    error,
    loadLiveItems,
  };
}

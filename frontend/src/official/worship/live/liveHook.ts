import { useCallback, useRef, useState } from 'react';
import { liveApi } from './liveApi';
import type { LiveItem } from './liveModel';

export function useLiveItems() {
  const [items, setItems] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const loadLiveItems = useCallback(async (category: string) => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const data = await liveApi.getLiveItems(category);
      if (currentRequestId !== requestId.current) return;
      setItems(data);
    } catch (e) {
      if (currentRequestId !== requestId.current) return;
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
      setItems([]);
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  return {
    items,
    loading,
    error,
    loadLiveItems,
  };
}

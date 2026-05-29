import { useCallback, useState } from 'react';
import { worshipTimeApi } from './worshipTimeApi';
import type { WorshipTimeItem } from './worshipTimeModel';

export function useWorshipTimeItems() {
  const [items, setItems] = useState<WorshipTimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorshipTimeItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await worshipTimeApi.getWorshipTimeItems();
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
    loadWorshipTimeItems,
  };
}

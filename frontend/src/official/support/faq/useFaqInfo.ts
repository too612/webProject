import { useCallback, useState } from 'react';
import { faqApi } from './faqApi';
import type { FaqItem } from './FaqModel';

export function useFaqInfo() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFaqItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await faqApi.getFaqItems();
      setFaqItems(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    faqItems,
    loading,
    error,
    loadFaqItems,
  };
}

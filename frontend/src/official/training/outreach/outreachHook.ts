import { useCallback, useState } from 'react';
import { outreachApi } from './outreachApi';
import type { OutreachContent } from './outreachModel';

export function useOutreachContent() {
  const [outreachContent, setOutreachContent] = useState<OutreachContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOutreachContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await outreachApi.getOutreachContent();
      setOutreachContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { outreachContent, loading, error, loadOutreachContent };
}
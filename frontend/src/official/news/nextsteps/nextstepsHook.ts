import { useCallback, useState } from 'react';
import { nextstepsApi } from './nextstepsApi';
import type { NextstepsContent } from './nextstepsModel';

export function useNextstepsContent() {
  const [nextstepsContent, setNextstepsContent] = useState<NextstepsContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNextstepsContent = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await nextstepsApi.getNextstepsContent(); setNextstepsContent(data); }
    catch (e) { setError(e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.'); }
    finally { setLoading(false); }
  }, []);

  return { nextstepsContent, loading, error, loadNextstepsContent };
}
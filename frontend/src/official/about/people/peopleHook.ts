import { useCallback, useState } from 'react';
import { peopleApi } from './peopleApi';
import type { PeopleContent } from './peopleModel';

export function usePeopleContent() {
  const [peopleContent, setPeopleContent] = useState<PeopleContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPeopleContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await peopleApi.getPeopleContent();
      setPeopleContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    peopleContent,
    loading,
    error,
    loadPeopleContent,
  };
}
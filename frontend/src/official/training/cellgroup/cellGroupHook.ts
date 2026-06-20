import { useCallback, useState } from 'react';
import { cellGroupApi } from './cellGroupApi';
import type { CellGroupContent } from './cellGroupModel';

export function useCellGroupContent() {
  const [cellGroupContent, setCellGroupContent] = useState<CellGroupContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCellGroupContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cellGroupApi.getCellGroupContent();
      setCellGroupContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cellGroupContent,
    loading,
    error,
    loadCellGroupContent,
  };
}
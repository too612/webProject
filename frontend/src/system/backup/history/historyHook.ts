import { useCallback, useEffect, useState } from 'react';
import { systemBackupHistoryApi } from './historyApi';
import type { SystemBackupHistoryListQuery, SystemBackupHistoryListResult } from './historyApi';
import type { SystemBackupHistoryRow } from './historyModel';

export function useSystemBackupHistoryPage() {
  const [items, setItems] = useState<SystemBackupHistoryRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = useCallback(
    async (query: SystemBackupHistoryListQuery): Promise<SystemBackupHistoryListResult<SystemBackupHistoryRow>> => {
      return systemBackupHistoryApi.getHistoryList(query);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadHistory({ page })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '백업 이력 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, loadHistory]);

  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) => (prev >= totalPages - 1 ? prev : prev + 1));
  }, [totalPages]);

  return {
    items,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    handlePrevPage,
    handleNextPage,
  };
}

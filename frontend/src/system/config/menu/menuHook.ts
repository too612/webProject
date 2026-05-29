import { useCallback, useEffect, useState } from 'react';
import { systemConfigMenuApi } from './menuApi';
import type { SystemConfigMenuListQuery, SystemConfigMenuListResult } from './menuApi';
import type { SystemConfigMenuRow } from './menuModel';

export function useSystemConfigMenuPage() {
  const [items, setItems] = useState<SystemConfigMenuRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMenus = useCallback(
    async (query: SystemConfigMenuListQuery): Promise<SystemConfigMenuListResult<SystemConfigMenuRow>> => {
      return systemConfigMenuApi.getMenuList(query);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadMenus({ page })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '메뉴 권한 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, loadMenus]);

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

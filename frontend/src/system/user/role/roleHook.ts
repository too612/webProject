import { useCallback, useEffect, useState } from 'react';
import { systemUserRoleApi } from './roleApi';
import type { SystemUserRoleListQuery, SystemUserRoleListResult } from './roleApi';
import type { SystemUserRoleRow } from './roleModel';

export function useSystemUserRolePage() {
  const [items, setItems] = useState<SystemUserRoleRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRoles = useCallback(
    async (query: SystemUserRoleListQuery): Promise<SystemUserRoleListResult<SystemUserRoleRow>> => {
      return systemUserRoleApi.getRoleList(query);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadRoles({ page })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '역할 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, loadRoles]);

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

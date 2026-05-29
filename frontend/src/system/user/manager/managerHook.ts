import { FormEvent, useCallback, useEffect, useState } from 'react';
import { systemUserManagerApi } from './managerApi';
import type { SystemUserManagerListQuery, SystemUserManagerListResult } from './managerApi';
import type { SystemUserManagerRow } from './managerModel';

export function useSystemUserManagerPage() {
  const [items, setItems] = useState<SystemUserManagerRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(
    async (query: SystemUserManagerListQuery): Promise<SystemUserManagerListResult<SystemUserManagerRow>> => {
      return systemUserManagerApi.getUserList(query);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadUsers({ page, keyword: keyword || undefined })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '사용자 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, keyword, loadUsers]);

  const handleSearch = useCallback((event: FormEvent) => {
    event.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  }, [inputKeyword]);

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
    inputKeyword,
    loading,
    error,
    handleSearch,
    handleInputKeywordChange: setInputKeyword,
    handlePrevPage,
    handleNextPage,
  };
}

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { adminMinutesApi } from './minutesApi';
import type { MinutesListQuery, MinutesListResult } from './minutesApi';
import type { AdminMinutesRow } from './minutesModel';

export function useAdminMinutesPage() {
  const [items, setItems] = useState<AdminMinutesRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMinutesList = useCallback(async (query: MinutesListQuery): Promise<MinutesListResult<AdminMinutesRow>> => {
    return adminMinutesApi.getMinutesList(query);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadMinutesList({ page, keyword: keyword || undefined })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '회의록 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, keyword, loadMinutesList]);

  const handleSearch = useCallback((e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  }, [inputKeyword]);

  const handleInputKeywordChange = useCallback((value: string) => {
    setInputKeyword(value);
  }, []);

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
    handleInputKeywordChange,
    handlePrevPage,
    handleNextPage,
  };
}

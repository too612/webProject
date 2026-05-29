import { FormEvent, useCallback, useEffect, useState } from 'react';
import { systemConfigCodeApi } from './codeApi';
import type { SystemConfigCodeListQuery, SystemConfigCodeListResult } from './codeApi';
import type { SystemConfigCodeRow } from './codeModel';

export function useSystemConfigCodePage() {
  const [items, setItems] = useState<SystemConfigCodeRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCodes = useCallback(
    async (query: SystemConfigCodeListQuery): Promise<SystemConfigCodeListResult<SystemConfigCodeRow>> => {
      return systemConfigCodeApi.getCodeList(query);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadCodes({ page, keyword: keyword || undefined })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '공통 코드 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, keyword, loadCodes]);

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

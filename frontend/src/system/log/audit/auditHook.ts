import { FormEvent, useCallback, useEffect, useState } from 'react';
import { systemLogAuditApi } from './auditApi';
import type { SystemLogAuditListQuery, SystemLogAuditListResult } from './auditApi';
import type { SystemLogAuditRow } from './auditModel';

export function useSystemLogAuditPage() {
  const [items, setItems] = useState<SystemLogAuditRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAudits = useCallback(
    async (query: SystemLogAuditListQuery): Promise<SystemLogAuditListResult<SystemLogAuditRow>> => {
      return systemLogAuditApi.getAuditLogList(query);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadAudits({ page, keyword: keyword || undefined })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '감사 로그를 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, keyword, loadAudits]);

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

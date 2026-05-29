import { FormEvent, useCallback, useEffect, useState } from 'react';
import { accountExpenseApi } from './expenseApi';
import type { ExpenseListQuery, ExpenseListResult } from './expenseApi';
import type { AccountExpenseRow } from './expenseModel';

export function useAccountExpensePage() {
  const [items, setItems] = useState<AccountExpenseRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExpenseList = useCallback(async (query: ExpenseListQuery): Promise<ExpenseListResult<AccountExpenseRow>> => {
    return accountExpenseApi.getExpenseList(query);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    loadExpenseList({ page, keyword: keyword || undefined })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '지출 목록을 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, keyword, loadExpenseList]);

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

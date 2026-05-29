import { FormEvent, useCallback, useEffect, useState } from 'react';
import { communitySaintSalesApi } from './salesApi';
import type { CommunitySaintSalesListQuery, CommunitySaintSalesListResult } from './salesApi';
import type { CommunitySaintSalesRow } from './salesModel';

export function useCommunitySaintSalesPage() {
    const [items, setItems] = useState<CommunitySaintSalesRow[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [inputKeyword, setInputKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadSalesList = useCallback(
        async (query: CommunitySaintSalesListQuery): Promise<CommunitySaintSalesListResult<CommunitySaintSalesRow>> => {
            return communitySaintSalesApi.getSalesList(query);
        },
        []
    );

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        loadSalesList({ page, keyword: keyword || undefined })
            .then((result) => {
                if (!mounted) return;
                setItems(result.items);
                setTotalPages(result.totalPages);
                setTotalElements(result.totalElements);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '성도 나눔터 목록을 불러오지 못했습니다.';
                setError(message);
                setItems([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [page, keyword, loadSalesList]);

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
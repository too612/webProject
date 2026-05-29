import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ministryDepartmentApi } from './departmentApi';
import type { MinistryDepartmentListQuery, MinistryDepartmentListResult } from './departmentApi';
import type { MinistryDepartmentRow } from './departmentModel';

export function useMinistryDepartmentPage() {
    const [items, setItems] = useState<MinistryDepartmentRow[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [inputKeyword, setInputKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDepartmentList = useCallback(
        async (query: MinistryDepartmentListQuery): Promise<MinistryDepartmentListResult<MinistryDepartmentRow>> => {
            return ministryDepartmentApi.getDepartmentList(query);
        },
        []
    );

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        loadDepartmentList({ page, keyword: keyword || undefined })
            .then((result) => {
                if (!mounted) return;
                setItems(result.items);
                setTotalPages(result.totalPages);
                setTotalElements(result.totalElements);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '부서 목록을 불러오지 못했습니다.';
                setError(message);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [page, keyword, loadDepartmentList]);

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

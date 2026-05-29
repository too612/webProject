import { FormEvent, useEffect, useState } from 'react';
import { communityFacilitiesPrayerApi } from './prayerApi';
import type { CommunityFacilitiesPrayerRow } from './prayerModel';

function includesKeyword(row: CommunityFacilitiesPrayerRow, keyword: string): boolean {
    return [row.date, row.task, row.owner, row.status]
        .map((value) => String(value ?? '').toLowerCase())
        .some((value) => value.includes(keyword));
}

export function useCommunityFacilitiesPrayerPage() {
    const [allItems, setAllItems] = useState<CommunityFacilitiesPrayerRow[]>([]);
    const [page, setPage] = useState(0);
    const [inputKeyword, setInputKeyword] = useState('');
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        communityFacilitiesPrayerApi.getPrayerList()
            .then((items) => {
                if (!mounted) return;
                setAllItems(items);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '기도실 예약 데이터를 불러오지 못했습니다.';
                setError(message);
                setAllItems([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const filteredItems = keyword
        ? allItems.filter((row) => includesKeyword(row, keyword.toLowerCase()))
        : allItems;

    const totalElements = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / 10));
    const pagedItems = filteredItems.slice(page * 10, page * 10 + 10);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setPage(0);
        setKeyword(inputKeyword.trim());
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setPage((prev) => (prev >= totalPages - 1 ? prev : prev + 1));
    };

    return {
        items: pagedItems,
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
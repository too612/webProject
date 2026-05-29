import { FormEvent, useCallback, useEffect, useState } from 'react';
import { communityWorldChristianApi } from './christianApi';
import type { CommunityWorldChristianNewsRow } from './christianModel';

export function useCommunityWorldChristianPage() {
    const [items, setItems] = useState<CommunityWorldChristianNewsRow[]>([]);
    const [inputKeyword, setInputKeyword] = useState('');
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadNews = useCallback(async (keywordValue?: string) => {
        return communityWorldChristianApi.getChristianNews({ keyword: keywordValue || undefined });
    }, []);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        loadNews(keyword)
            .then((result) => {
                if (!mounted) return;
                setItems(result);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '기독교 소식 데이터를 불러오지 못했습니다.';
                setError(message);
                setItems([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [keyword, loadNews]);

    const handleSearch = useCallback((e: FormEvent) => {
        e.preventDefault();
        setKeyword(inputKeyword.trim());
    }, [inputKeyword]);

    const handleReset = useCallback(() => {
        setInputKeyword('');
        setKeyword('');
    }, []);

    return {
        items,
        inputKeyword,
        loading,
        error,
        handleSearch,
        handleReset,
        handleInputKeywordChange: setInputKeyword,
    };
}

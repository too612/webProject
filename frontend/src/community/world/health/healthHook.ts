import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { communityWorldHealthApi } from './healthApi';
import type { CommunityWorldHealthAgeGroup, CommunityWorldHealthDiseaseRow } from './healthModel';

export function useCommunityWorldHealthPage() {
    const [selectedAge, setSelectedAge] = useState<CommunityWorldHealthAgeGroup>('전체');
    const [allItems, setAllItems] = useState<CommunityWorldHealthDiseaseRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        communityWorldHealthApi.getHealthList()
            .then((result) => {
                if (!mounted) return;
                setAllItems(result);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '건강 정보 데이터를 불러오지 못했습니다.';
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

    const filteredItems = useMemo(() => {
        if (selectedAge === '전체') return allItems;
        return allItems.filter((item) => item.ageGroup === selectedAge);
    }, [allItems, selectedAge]);

    return {
        selectedAge,
        filteredItems,
        loading,
        error,
        handleAgeGroupSelect: setSelectedAge,
    };
}

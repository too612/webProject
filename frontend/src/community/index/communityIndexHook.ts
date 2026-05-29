import { useEffect, useState } from 'react';
import { communityIndexApi } from './communityIndexApi';
import { EMPTY_COMMUNITY_INDEX, type CommunityIndexData } from './communityIndexModel';

export function useCommunityIndex() {
    const [indexData, setIndexData] = useState<CommunityIndexData>(EMPTY_COMMUNITY_INDEX);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        communityIndexApi.getIndexData()
            .then((data) => {
                if (!mounted) return;
                setIndexData(data);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '커뮤니티 메인 데이터를 불러오지 못했습니다.';
                setError(message);
                setIndexData(EMPTY_COMMUNITY_INDEX);
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    return {
        indexData,
        loading,
        error,
    };
}
import { useCallback, useEffect, useState } from 'react';
import { communityIndexApi } from './communityIndexApi';
import type { CommunityIndexData } from './communityIndexModel';

export function useCommunityIndex() {
    const [indexData, setIndexData] = useState<CommunityIndexData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [requestVersion, setRequestVersion] = useState(0);
    const reload = useCallback(() => setRequestVersion((version) => version + 1), []);

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
                setIndexData(null);
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [requestVersion]);

    return {
        indexData,
        loading,
        error,
        reload,
    };
}
import { useCallback, useEffect, useState } from 'react';
import { communityWorldEconomicApi } from './economicApi';
import type { CommunityWorldEconomicData } from './economicModel';

export function useCommunityWorldEconomicPage() {
    const [data, setData] = useState<CommunityWorldEconomicData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = useCallback(() => {
        setLoading(true);
        setError('');

        communityWorldEconomicApi.getEconomicData()
            .then((result) => {
                setData(result);
            })
            .catch((e) => {
                const message = e instanceof Error ? e.message : '경제 정보 데이터를 불러오지 못했습니다.';
                setError(message);
                setData({});
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        loading,
        error,
        loadData,
    };
}

import { useEffect, useState } from 'react';
import { communityGroupB2Api } from './b2Api';
import type { CommunityGroupB2Row } from './b2Model';

export function useCommunityGroupB2Page() {
    const [items, setItems] = useState<CommunityGroupB2Row[]>([]);
    const [totalMembers, setTotalMembers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        communityGroupB2Api.getB2List()
            .then((result) => {
                if (!mounted) return;
                setItems(result.items);
                setTotalMembers(result.totalElements || result.items.length);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : 'B2 구역 목록을 불러오지 못했습니다.';
                setError(message);
                setItems([]);
                setTotalMembers(0);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return {
        items,
        totalMembers,
        loading,
        error,
    };
}
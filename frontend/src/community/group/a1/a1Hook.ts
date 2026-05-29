import { useEffect, useState } from 'react';
import { communityGroupA1Api } from './a1Api';
import type { CommunityGroupA1Row } from './a1Model';

export function useCommunityGroupA1Page() {
    const [items, setItems] = useState<CommunityGroupA1Row[]>([]);
    const [totalMembers, setTotalMembers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        communityGroupA1Api.getA1List()
            .then((result) => {
                if (!mounted) return;
                setItems(result.items);
                setTotalMembers(result.totalElements || result.items.length);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : 'A1 구역 목록을 불러오지 못했습니다.';
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
import { useEffect, useState } from 'react';
import { mypageActivityApi } from './activityApi';
import { EMPTY_MYPAGE_ACTIVITIES, type MypageActivityItem } from './activityModel';

export function useMypageActivityPage() {
  const [items, setItems] = useState<MypageActivityItem[]>(EMPTY_MYPAGE_ACTIVITIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    mypageActivityApi
      .getActivityList()
      .then((result) => {
        if (!mounted) return;
        setItems(result);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '내 활동 내역을 불러오지 못했습니다.';
        setError(message);
        setItems(EMPTY_MYPAGE_ACTIVITIES);
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
    loading,
    error,
  };
}

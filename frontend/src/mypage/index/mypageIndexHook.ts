import { useEffect, useState } from 'react';
import { mypageIndexApi } from './mypageIndexApi';
import { EMPTY_MYPAGE_INDEX, type MypageIndexData } from './mypageIndexModel';

export function useMypageIndexPage() {
  const [indexData, setIndexData] = useState<MypageIndexData>(EMPTY_MYPAGE_INDEX);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    mypageIndexApi
      .getIndexData()
      .then((data) => {
        if (!mounted) return;
        setIndexData(data);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '마이페이지 메인 데이터를 불러오지 못했습니다.';
        setError(message);
        setIndexData(EMPTY_MYPAGE_INDEX);
      })
      .finally(() => {
        if (mounted) setLoading(false);
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

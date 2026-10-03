import { useEffect, useState } from 'react';
import { mypageIndexApi } from './mypageIndexApi';
import type { MypageIndexData } from './mypageIndexModel';

export function useMypageIndexPage() {
  const [indexData, setIndexData] = useState<MypageIndexData | null>(null);
  const mode = 'DEMO' as const;
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    setIndexData(null);

    mypageIndexApi
      .getIndexData(mode)
      .then((data) => {
        if (!mounted) return;
        setIndexData(data);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '마이페이지 메인 데이터를 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [revision]);

  return {
    indexData: indexData?.source === mode ? indexData : null,
    loading: loading || (!error && indexData?.source !== mode),
    error,
    mode,
    retry: () => setRevision((value) => value + 1),
  };
}

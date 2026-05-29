import { useEffect, useState } from 'react';
import { systemIndexApi } from './systemIndexApi';
import { EMPTY_SYSTEM_INDEX, type SystemIndexData } from './systemIndexModel';

export function useSystemIndexPage() {
  const [indexData, setIndexData] = useState<SystemIndexData>(EMPTY_SYSTEM_INDEX);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    systemIndexApi
      .getIndexData()
      .then((data) => {
        if (!mounted) return;
        setIndexData(data);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '시스템 메인 데이터를 불러오지 못했습니다.';
        setError(message);
        setIndexData(EMPTY_SYSTEM_INDEX);
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

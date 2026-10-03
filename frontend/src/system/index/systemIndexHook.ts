import { useCallback, useEffect, useState } from 'react';
import { systemIndexApi } from './systemIndexApi';
import type { SystemIndexData } from './systemIndexModel';

export function useSystemIndexPage() {
  const [indexData, setIndexData] = useState<SystemIndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

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
        setIndexData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [revision]);

  return {
    indexData,
    loading,
    error,
    reload,
  };
}

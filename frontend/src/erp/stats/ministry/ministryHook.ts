import { useEffect, useState } from 'react';
import { statsMinistryApi } from './ministryApi';
import type { StatsMinistryRow } from './ministryModel';

export function useStatsMinistry() {
  const [rows, setRows] = useState<StatsMinistryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setError('');

    statsMinistryApi
      .getMinistryList()
      .then((result) => {
        if (mounted) {
          setRows(result);
        }
      })
      .catch((e) => {
        if (mounted) {
          const message = e instanceof Error ? e.message : '사역 통계 데이터를 불러오지 못했습니다.';
          setError(message);
        }
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

  return { rows, loading, error };
}

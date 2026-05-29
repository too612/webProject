import { useEffect, useState } from 'react';
import { statsOfferingApi } from './offeringApi';
import type { StatsOfferingRow } from './offeringModel';

export function useStatsOffering() {
  const [rows, setRows] = useState<StatsOfferingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setError('');

    statsOfferingApi
      .getOfferingList()
      .then((result) => {
        if (mounted) {
          setRows(result);
        }
      })
      .catch((e) => {
        if (mounted) {
          const message = e instanceof Error ? e.message : '헌금 통계 데이터를 불러오지 못했습니다.';
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

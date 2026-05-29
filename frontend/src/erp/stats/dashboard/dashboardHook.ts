import { useEffect, useState } from 'react';
import { statsDashboardApi } from './dashboardApi';
import type { StatsDashboardData } from './dashboardModel';

const EMPTY_DASHBOARD: StatsDashboardData = {};

export function useStatsDashboard() {
  const [data, setData] = useState<StatsDashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setError('');

    statsDashboardApi
      .getDashboard()
      .then((result) => {
        if (mounted) {
          setData(result);
        }
      })
      .catch((e) => {
        if (mounted) {
          const message = e instanceof Error ? e.message : '대시보드 데이터를 불러오지 못했습니다.';
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

  return { data, loading, error };
}

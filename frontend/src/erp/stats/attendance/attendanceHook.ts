import { useEffect, useState } from 'react';
import { statsAttendanceApi } from './attendanceApi';
import type { StatsAttendanceRow } from './attendanceModel';

export function useStatsAttendance() {
  const [rows, setRows] = useState<StatsAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setError('');

    statsAttendanceApi
      .getAttendanceList()
      .then((result) => {
        if (mounted) {
          setRows(result);
        }
      })
      .catch((e) => {
        if (mounted) {
          const message = e instanceof Error ? e.message : '출석 통계 데이터를 불러오지 못했습니다.';
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

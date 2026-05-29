import { useEffect, useState } from 'react';
import { accountReportApi } from './reportApi';
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  EMPTY_ACCOUNT_REPORT_DATA,
  type AccountReportData,
} from './reportModel';

export function useAccountReport() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [data, setData] = useState<AccountReportData>(EMPTY_ACCOUNT_REPORT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    accountReportApi.getReport(year, month)
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '데이터를 불러오지 못했습니다.';
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [year, month]);

  return {
    year,
    month,
    data,
    loading,
    error,
    setYear,
    setMonth,
  };
}

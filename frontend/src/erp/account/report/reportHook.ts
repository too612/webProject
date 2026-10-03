import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { accountReportApi } from './reportApi';
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  EMPTY_ACCOUNT_REPORT_DATA,
  type AccountReportData,
} from './reportModel';

export function useAccountReport() {
  const [searchParams] = useSearchParams();
  const requestedYear = searchParams.get('year');
  const requestedMonth = searchParams.get('month');
  const currentYear = Number(CURRENT_YEAR);
  const yearFromUrl = requestedYear && /^\d{4}$/.test(requestedYear)
    && Number(requestedYear) <= currentYear && Number(requestedYear) >= currentYear - 2
    ? requestedYear
    : CURRENT_YEAR;
  const monthFromUrl = requestedMonth && /^(0[1-9]|1[0-2])$/.test(requestedMonth)
    ? requestedMonth
    : CURRENT_MONTH;
  const [year, setYear] = useState(yearFromUrl);
  const [month, setMonth] = useState(monthFromUrl);
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

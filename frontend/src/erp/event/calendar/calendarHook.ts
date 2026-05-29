import { useCallback, useEffect, useState } from 'react';
import { eventCalendarApi } from './calendarApi';
import {
  EVENT_CALENDAR_CURRENT_MONTH,
  EVENT_CALENDAR_CURRENT_YEAR,
  type EventCalendarItem,
} from './calendarModel';

export function useEventCalendar() {
  const [year, setYear] = useState(EVENT_CALENDAR_CURRENT_YEAR);
  const [month, setMonth] = useState(EVENT_CALENDAR_CURRENT_MONTH);
  const [events, setEvents] = useState<EventCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleYearChange = useCallback((value: string) => {
    setYear(value);
  }, []);

  const handleMonthChange = useCallback((value: string) => {
    setMonth(value);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    eventCalendarApi
      .getCalendar({ year, month })
      .then((result) => {
        if (mounted) {
          setEvents(result);
        }
      })
      .catch((e) => {
        if (mounted) {
          const message = e instanceof Error ? e.message : '행사 달력 데이터를 불러오지 못했습니다.';
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
  }, [year, month]);

  return {
    year,
    month,
    events,
    loading,
    error,
    handleYearChange,
    handleMonthChange,
  };
}
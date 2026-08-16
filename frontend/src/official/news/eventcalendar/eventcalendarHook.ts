/**
 * File Name   : eventcalendarHook
 * Description : 행사달력 화면 상태 및 유스케이스 훅
 */

import { useCallback, useState } from "react";
import { eventCalendarApi } from "./eventcalendarApi";
import type {
  EventCalendar,
  EventCalendarRequest,
} from "./eventcalendarModel";

/****************************************************************************************************
 * hook method (state, 공통 상태 초기화)
 ****************************************************************************************************/

export function useEventCalendarInfo() {
  const [eventCalendar, setEventCalendar] = useState<EventCalendar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /****************************************************************************************************
   * tran/data method (조회, 저장 API 연동)
   ****************************************************************************************************/

  const loadInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventCalendarApi.getInfo();
      setEventCalendar(data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "조회 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveInfo = useCallback(
    async (payload: EventCalendarRequest) => {
      setLoading(true);
      setError(null);
      try {
        if (eventCalendar?.eventCalendarId) {
          await eventCalendarApi.setUpdate(
            eventCalendar.eventCalendarId,
            payload,
          );
        } else {
          await eventCalendarApi.setCreate(payload);
        }
        const refreshed = await eventCalendarApi.getInfo();
        setEventCalendar(refreshed);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [eventCalendar?.eventCalendarId],
  );

  return {
    eventCalendar,
    loading,
    error,
    loadInfo,
    saveInfo,
  };
}

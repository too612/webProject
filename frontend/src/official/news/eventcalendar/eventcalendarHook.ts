/**
 * File Name   : eventcalendarHook
 * Description : 행사달력 화면 상태 및 유스케이스 훅
 */

import { useCallback, useEffect, useState } from "react";
import { eventCalendarApi } from "./eventcalendarApi";
import type {
  ChurchEvent,
  ChurchEventCategory,
  ChurchEventRequest,
} from "./eventcalendarModel";

/****************************************************************************************************
 * hook method (state, 공통 상태 초기화)
 ****************************************************************************************************/

export function useEventCalendar() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [categories, setCategories] = useState<ChurchEventCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /****************************************************************************************************
   * tran/data method (조회, 저장, 삭제 API 연동)
   ****************************************************************************************************/

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventList, categoryList] = await Promise.all([
        eventCalendarApi.getList(),
        eventCalendarApi.getCategoryList(),
      ]);
      setEvents(eventList);
      setCategories(categoryList);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "조회 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const saveEvent = useCallback(
    async (request: ChurchEventRequest) => {
      setLoading(true);
      setError(null);
      try {
        if (request.eventKey) {
          await eventCalendarApi.setUpdate(request.eventKey, request);
        } else {
          await eventCalendarApi.setCreate(request);
        }
        await loadAll();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [loadAll],
  );

  const removeEvent = useCallback(
    async (eventKey: string) => {
      setLoading(true);
      setError(null);
      try {
        await eventCalendarApi.delRemove(eventKey);
        await loadAll();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "삭제 중 오류가 발생했습니다.";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [loadAll],
  );

  return {
    events,
    categories,
    loading,
    error,
    saveEvent,
    removeEvent,
  };
}

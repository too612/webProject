/**
 * File Name   : eventcalendarApi
 * Description : 행사달력 API 통신 모듈
 */

import client from "../../../common/api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import type {
  EventCalendar,
  EventCalendarRequest,
} from "./eventcalendarModel";
import { getApiErrorMessage } from "../../../common/api/apiError";

/****************************************************************************************************
 * api method (조회, 등록, 수정, 삭제)
 ****************************************************************************************************/

export const eventCalendarApi = {
  async getInfo(): Promise<EventCalendar | null> {
    try {
      const response = await client.get<ApiResponse<EventCalendar>>(
        "/official/news/eventcalendar/getInfo",
      );
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async setCreate(request: EventCalendarRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>(
        "/official/news/eventcalendar/setCreate",
        request,
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async setUpdate(
    eventCalendarId: number,
    request: EventCalendarRequest,
  ): Promise<void> {
    try {
      await client.put<ApiResponse<void>>(
        `/official/news/eventcalendar/setUpdate/${eventCalendarId}`,
        request,
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async delRemove(eventCalendarId: number): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(
        `/official/news/eventcalendar/delRemove/${eventCalendarId}`,
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },
};

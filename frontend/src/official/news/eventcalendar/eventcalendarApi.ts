/**
 * File Name   : eventcalendarApi
 * Description : 행사달력 API 통신 모듈
 */

import client from "../../../common/api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type {
  ChurchEvent,
  ChurchEventCategory,
  ChurchEventRequest,
} from "./eventcalendarModel";

/****************************************************************************************************
 * api method (조회, 등록, 수정, 삭제)
 ****************************************************************************************************/

export const eventCalendarApi = {
  async getList(): Promise<ChurchEvent[]> {
    try {
      const response = await client.get<ApiResponse<ChurchEvent[]>>(
        "/official/news/eventcalendar/getList",
      );
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async getCategoryList(): Promise<ChurchEventCategory[]> {
    try {
      const response = await client.get<ApiResponse<ChurchEventCategory[]>>(
        "/official/news/eventcalendar/getCategoryList",
      );
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async setCreate(request: ChurchEventRequest): Promise<void> {
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

  async setUpdate(eventKey: string, request: ChurchEventRequest): Promise<void> {
    try {
      await client.put<ApiResponse<void>>(
        `/official/news/eventcalendar/setUpdate/${eventKey}`,
        request,
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async delRemove(eventKey: string): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(
        `/official/news/eventcalendar/delRemove/${eventKey}`,
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },
};

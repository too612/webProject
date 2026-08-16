/**
 * File Name   : eventcalendarModel
 * Description : 행사달력 도메인 타입/요청 모델 정의
 */

/****************************************************************************************************
 * type method (도메인 타입, 요청/응답 계약)
 ****************************************************************************************************/

export type EventCalendar = {
  eventCalendarId: number;
  title: string;
  content: string;
  updatedAt?: string;
};

export type EventCalendarRequest = {
  eventCalendarId?: number;
  title: string;
  content: string;
  createdBy?: string;
  updatedBy?: string;
};

/****************************************************************************************************
 * config/constant method (비DB 기본값, 페이지 표시 콘텐츠)
 ****************************************************************************************************/

export const INITIAL_EVENT_CALENDAR_REQUEST: EventCalendarRequest = {
  title: "행사달력",
  content: "",
  updatedBy: "system",
};

export const DEFAULT_EVENT_CALENDAR_CONTENT = {
  headline: "행사달력",
  summary:
    "교회에서 진행되는 예배와 주요 행사 일정을 한눈에 확인할 수 있습니다.",
};

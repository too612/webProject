/**
 * File Name   : eventcalendarModel
 * Description : 행사달력 도메인 타입/요청 모델 및 달력 매핑 정의
 */

import type {
  CalendarCategory,
  CalendarEvent,
  EventColorId,
  EventFormValues,
} from "../../../common/ui/calendar";

/****************************************************************************************************
 * type method (도메인 타입, 요청/응답 계약)
 ****************************************************************************************************/

export type ChurchEvent = {
  eventKey: string;
  categoryCd: string;
  categoryName: string;
  title: string;
  description?: string;
  startDtm: string;
  endDtm: string;
  allDayYn: string;
  locationNm?: string;
  colorCd: string;
};

export type ChurchEventCategory = {
  code: string;
  codeName: string;
  color: string;
};

export type ChurchEventRequest = {
  eventKey?: string;
  categoryCd: string;
  title: string;
  description?: string;
  startDtm: string;
  endDtm: string;
  allDayYn: string;
  locationNm?: string;
  colorCd: string;
};

/****************************************************************************************************
 * config/constant method (달력 컴포넌트 타입으로 변환하는 매퍼)
 ****************************************************************************************************/

export function toCalendarEvent(event: ChurchEvent): CalendarEvent {
  return {
    id: event.eventKey,
    categoryCode: event.categoryCd,
    categoryName: event.categoryName,
    title: event.title,
    description: event.description,
    start: event.startDtm,
    end: event.endDtm,
    allDay: event.allDayYn === "Y",
    location: event.locationNm,
    color: (event.colorCd || "indigo") as EventColorId,
  };
}

export function toCalendarEvents(events: ChurchEvent[]): CalendarEvent[] {
  return events.map(toCalendarEvent);
}

export function toCalendarCategories(categories: ChurchEventCategory[]): CalendarCategory[] {
  return categories.map((c) => ({
    code: c.code,
    name: c.codeName,
    color: (c.color || "indigo") as EventColorId,
  }));
}

export function toChurchEventRequest(values: EventFormValues): ChurchEventRequest {
  return {
    eventKey: values.id,
    categoryCd: values.categoryCode,
    title: values.title,
    description: values.description,
    startDtm: values.start,
    endDtm: values.end,
    allDayYn: values.allDay ? "Y" : "N",
    locationNm: values.location,
    colorCd: values.color,
  };
}

export const DEFAULT_EVENT_CALENDAR_CONTENT = {
  headline: "행사달력",
  summary: "주일학교·청년부·장년부·교회 행사 일정을 한눈에 확인할 수 있습니다.",
};

/**
 * File Name   : calendarTypes
 * Description : 교회 행사 달력 도메인 타입/상수 정의
 */

export type CalendarViewType = "month" | "week" | "day" | "list";

/** 구분값 색상 팔레트 (구분값의 색상은 com_code.extra1 에 이 id 값을 저장) */
export const EVENT_COLORS = [
  { id: "red", label: "레드", hex: "#E5484D" },
  { id: "rose", label: "로즈", hex: "#F0908A" },
  { id: "orange", label: "오렌지", hex: "#E8590C" },
  { id: "yellow", label: "옐로우", hex: "#F2C94C" },
  { id: "mint", label: "민트", hex: "#3DD598" },
  { id: "green", label: "그린", hex: "#1E8E5A" },
  { id: "sky", label: "스카이", hex: "#2F9BE0" },
  { id: "indigo", label: "인디고", hex: "#4C5FD5" },
  { id: "lavender", label: "라벤더", hex: "#8B8FE8" },
  { id: "purple", label: "퍼플", hex: "#9B51E0" },
  { id: "gray", label: "그레이", hex: "#6B7280" },
] as const;

export type EventColorId = (typeof EVENT_COLORS)[number]["id"];

export function colorHex(id: string): string {
  return EVENT_COLORS.find((c) => c.id === id)?.hex ?? EVENT_COLORS[7].hex;
}

/** 배경색(hex) 기준으로 읽기 좋은 글자색을 반환 (밝은 배경=어두운 글자) */
export function textColorForHex(hex: string): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1f2937" : "#ffffff";
}

/** 행사 구분값 (com_code 기반, 추후 변동 가능) */
export interface CalendarCategory {
  code: string; // com_code.code
  name: string; // com_code.code_name
  color: EventColorId; // com_code.extra1
}

/** 행사 일정 (cal_event 테이블 대응) */
export interface CalendarEvent {
  id: string; // event_key
  categoryCode: string; // category_cd
  categoryName: string; // com_code.code_name
  title: string;
  description?: string;
  start: string; // start_dtm (ISO)
  end: string; // end_dtm (ISO)
  allDay: boolean; // all_day_yn
  location?: string; // location_nm
  color: EventColorId; // color_cd
}

/** 화면에 그릴 회차(occurrence). 실제 저장 단위가 아님 */
export interface CalendarEventOccurrence {
  event: CalendarEvent;
  occurrenceStart: Date;
  occurrenceEnd: Date;
  occurrenceIndex: number;
}

/** 생성/수정 다이얼로그 저장 시 전달되는 payload */
export interface EventFormValues {
  id?: string;
  categoryCode: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  location?: string;
  color: EventColorId;
}

export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

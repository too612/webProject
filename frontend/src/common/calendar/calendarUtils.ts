import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { CalendarEvent, CalendarEventOccurrence } from "./calendarTypes";

/** 주어진 달을 감싸는 주(일~토) 그리드의 날짜 배열 */
export function getMonthGridDays(monthDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

/** 주어진 날짜가 속한 주(일~토)의 날짜 배열 */
export function getWeekDays(anyDateInWeek: Date): Date[] {
  const start = startOfWeek(anyDateInWeek, { weekStartsOn: 0 });
  const end = endOfWeek(anyDateInWeek, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function isMultiDay(event: Pick<CalendarEvent, "start" | "end">): boolean {
  return !isSameDay(new Date(event.start), new Date(event.end));
}

/** 단일 이벤트를 [rangeStart, rangeEnd] 구간과 겹칠 때 occurrence 1개로 전개 */
export function expandEventToRange(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEventOccurrence[] {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const overlaps = start <= rangeEnd && end >= rangeStart;
  return overlaps
    ? [{ event, occurrenceStart: start, occurrenceEnd: end, occurrenceIndex: 0 }]
    : [];
}

export function expandEventsToRange(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEventOccurrence[] {
  return events.flatMap((e) => expandEventToRange(e, rangeStart, rangeEnd));
}

export function toDateTimeLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDateTimeLocalInput(value: string): string {
  return new Date(value).toISOString();
}

export const HOUR_ROW_HEIGHT = 48; // px, calendarTimeGridView 와 공유
export const DAY_START_HOUR = 0;
export const DAY_END_HOUR = 24;

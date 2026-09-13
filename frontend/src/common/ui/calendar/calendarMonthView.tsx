import { useMemo, useState } from "react";
import { endOfDay, isSameDay, isSameMonth, isToday } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover";
import type { CalendarEventOccurrence } from "./calendarTypes";
import { colorHex, textColorForHex, WEEKDAY_LABELS } from "./calendarTypes";
import { getMonthGridDays, isMultiDay } from "./calendarUtils";

interface MonthViewProps {
  monthDate: Date;
  occurrences: CalendarEventOccurrence[];
  onSelectDay: (day: Date) => void;
  onSelectOccurrence: (
    occ: CalendarEventOccurrence,
    anchor: HTMLElement,
  ) => void;
}

const MAX_VISIBLE_SINGLE_PER_DAY = 3;
const LANE_HEIGHT = 20; // px, 멀티데이 바 한 줄 높이

interface LanedOccurrence {
  occ: CalendarEventOccurrence;
  lane: number;
  isFirstOfSegment: boolean; // 이 주(週) 안에서 바가 시작되는 지점인지
  isLastOfSegment: boolean; // 이 주(週) 안에서 바가 끝나는 지점인지
}

export function CalendarMonthView({
  monthDate,
  occurrences,
  onSelectDay,
  onSelectOccurrence,
}: MonthViewProps) {
  const days = useMemo(() => getMonthGridDays(monthDate), [monthDate]);
  const weeks = useMemo(() => chunk(days, 7), [days]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-b-lg border-t">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`px-2 py-2 text-center text-xs font-medium ${
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 주(週) 단위 행 - 주 개수(5/6줄)에 맞춰 균등 분배해 마지막 줄이 작아지지 않게 함 */}
      <div
        className="grid flex-1 divide-y"
        style={{ gridTemplateRows: `repeat(${weeks.length}, minmax(0, 1fr))` }}
      >
        {weeks.map((week, wi) => (
          <WeekRow
            key={wi}
            week={week}
            monthDate={monthDate}
            occurrences={occurrences}
            onSelectDay={onSelectDay}
            onSelectOccurrence={onSelectOccurrence}
          />
        ))}
      </div>
    </div>
  );
}

function WeekRow({
  week,
  monthDate,
  occurrences,
  onSelectDay,
  onSelectOccurrence,
}: {
  week: Date[];
  monthDate: Date;
  occurrences: CalendarEventOccurrence[];
  onSelectDay: (day: Date) => void;
  onSelectOccurrence: (
    occ: CalendarEventOccurrence,
    anchor: HTMLElement,
  ) => void;
}) {
  const weekStart = week[0];
  const weekEnd = week[6];

  // 1) 이 주와 겹치는 멀티데이 이벤트에 레인(lane)을 배정 (같은 주 안에서는 모든 날짜 셀이 같은 레인 순서를 공유)
  const lanedMultiDay = useMemo(() => {
    const multiDay = occurrences
      .filter(
        (o) =>
          isMultiDay(o.event) &&
          o.occurrenceStart <= endOfDay(weekEnd) &&
          o.occurrenceEnd >= weekStart,
      )
      .sort(
        (a, b) => a.occurrenceStart.getTime() - b.occurrenceStart.getTime(),
      );

    const laneEndTimes: number[] = [];
    const result: LanedOccurrence[] = [];
    for (const occ of multiDay) {
      let lane = laneEndTimes.findIndex(
        (end) => end <= occ.occurrenceStart.getTime(),
      );
      if (lane === -1) {
        lane = laneEndTimes.length;
        laneEndTimes.push(occ.occurrenceEnd.getTime());
      } else {
        laneEndTimes[lane] = occ.occurrenceEnd.getTime();
      }
      result.push({
        occ,
        lane,
        isFirstOfSegment: occ.occurrenceStart >= weekStart,
        isLastOfSegment: occ.occurrenceEnd <= endOfDay(weekEnd),
      });
    }
    return result;
  }, [occurrences, weekStart, weekEnd]);

  const laneCount = lanedMultiDay.reduce(
    (max, l) => Math.max(max, l.lane + 1),
    0,
  );

  // 2) 단일 일자 이벤트는 각 날짜별로 독립 계산
  const singlesByDay = useMemo(() => {
    const map = new Map<string, CalendarEventOccurrence[]>();
    for (const day of week) {
      map.set(
        day.toDateString(),
        occurrences
          .filter(
            (o) => !isMultiDay(o.event) && isSameDay(o.occurrenceStart, day),
          )
          .sort(
            (a, b) => a.occurrenceStart.getTime() - b.occurrenceStart.getTime(),
          ),
      );
    }
    return map;
  }, [occurrences, week]);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-7 divide-x">
      {week.map((day) => {
        const dayLanes = lanedMultiDay.filter(
          (l) => l.occ.occurrenceStart <= endOfDay(day) && l.occ.occurrenceEnd >= day,
        );
        const singles = singlesByDay.get(day.toDateString()) ?? [];
        return (
          <DayCell
            key={day.toISOString()}
            day={day}
            monthDate={monthDate}
            laneCount={laneCount}
            dayLanes={dayLanes}
            weekStart={weekStart}
            singles={singles}
            onSelectDay={onSelectDay}
            onSelectOccurrence={onSelectOccurrence}
          />
        );
      })}
    </div>
  );
}

function DayCell({
  day,
  monthDate,
  laneCount,
  dayLanes,
  weekStart,
  singles,
  onSelectDay,
  onSelectOccurrence,
}: {
  day: Date;
  monthDate: Date;
  laneCount: number;
  dayLanes: LanedOccurrence[];
  weekStart: Date;
  singles: CalendarEventOccurrence[];
  onSelectDay: (day: Date) => void;
  onSelectOccurrence: (
    occ: CalendarEventOccurrence,
    anchor: HTMLElement,
  ) => void;
}) {
  const inMonth = isSameMonth(day, monthDate);
  const visibleSingles = singles.slice(0, MAX_VISIBLE_SINGLE_PER_DAY);
  const overflow = singles.length - visibleSingles.length;

  const dow = day.getDay();
  const dowClass = !inMonth
    ? ""
    : dow === 0
      ? "text-red-500"
      : dow === 6
        ? "text-blue-500"
        : "";
  const cellClass = isToday(day)
    ? "ring-1 ring-inset ring-primary/40 bg-primary/5"
    : inMonth
      ? ""
      : "bg-muted/5 text-muted-foreground/70";

  // 레인 순서대로 슬롯 배열 구성 (해당 날짜에 없는 레인은 빈 자리로 높이만 유지 → 다른 셀과 줄이 맞음)
  const laneSlots = Array.from(
    { length: laneCount },
    (_, i) => dayLanes.find((l) => l.lane === i) ?? null,
  );

  return (
    <div
      onClick={() => onSelectDay(day)}
      className={`group flex min-h-0 cursor-pointer flex-col overflow-hidden p-1 text-left transition-colors hover:bg-muted/40 ${cellClass}`}
    >
      <div className="mb-1 flex items-center justify-end gap-1 px-0.5">
        <span className="text-[11px] font-bold leading-none text-primary opacity-0 transition-opacity group-hover:opacity-100">
          +
        </span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
            isToday(day)
              ? "bg-primary font-semibold text-primary-foreground"
              : dowClass
          }`}
        >
          {day.getDate()}
        </span>
      </div>

      <div className="flex flex-col gap-[2px]">
        {laneSlots.map((laned, i) =>
          laned ? (
            <button
              key={`lane-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectOccurrence(laned.occ, e.currentTarget);
              }}
              title={laned.occ.event.title}
              style={{
                height: LANE_HEIGHT,
                backgroundColor: colorHex(laned.occ.event.color),
                color: textColorForHex(colorHex(laned.occ.event.color)),
              }}
              className={`truncate px-1.5 text-left text-[11px] font-medium leading-5 hover:opacity-90 ${
                laned.isFirstOfSegment ? "rounded-l" : ""
              } ${laned.isLastOfSegment ? "rounded-r" : ""}`}
            >
              {(laned.isFirstOfSegment ||
                day.getTime() === weekStart.getTime()) &&
                laned.occ.event.title}
            </button>
          ) : (
            <div key={`lane-${i}`} style={{ height: LANE_HEIGHT }} />
          ),
        )}

        {visibleSingles.map((occ, i) => (
          <button
            key={`${occ.event.id}-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectOccurrence(occ, e.currentTarget);
            }}
            className="flex items-center gap-1.5 truncate rounded px-1 py-[1px] text-left text-[11px] hover:bg-muted"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: colorHex(occ.event.color) }}
            />
            {!occ.event.allDay && (
              <span className="shrink-0 rounded bg-muted px-1 text-[10px] leading-4 text-muted-foreground">
                {occ.occurrenceStart.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            )}
            <span className="truncate">{occ.event.title}</span>
          </button>
        ))}

        {overflow > 0 && (
          <MoreEventsPopover
            day={day}
            occurrences={singles}
            overflowCount={overflow}
            onSelectOccurrence={onSelectOccurrence}
          />
        )}
      </div>
    </div>
  );
}

function MoreEventsPopover({
  day,
  occurrences,
  overflowCount,
  onSelectOccurrence,
}: {
  day: Date;
  occurrences: CalendarEventOccurrence[];
  overflowCount: number;
  onSelectOccurrence: (
    occ: CalendarEventOccurrence,
    anchor: HTMLElement,
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="px-1 text-left text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          +{overflowCount}개 더보기
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" onClick={(e) => e.stopPropagation()}>
        <p className="mb-1 px-1 text-xs font-semibold text-muted-foreground">
          {day.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </p>
        <div className="flex flex-col">
          {occurrences.map((occ, i) => (
            <button
              key={`${occ.event.id}-${i}`}
              onClick={(e) => {
                setOpen(false);
                onSelectOccurrence(occ, e.currentTarget);
              }}
              className="flex items-center gap-2 rounded px-1.5 py-1 text-left text-xs hover:bg-muted"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: colorHex(occ.event.color) }}
              />
              <span className="truncate">{occ.event.title}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

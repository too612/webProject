import { useMemo } from "react";
import { isSameDay, isToday } from "date-fns";
import type { CalendarEventOccurrence } from "./calendarTypes";
import { mutedColorHex, WEEKDAY_LABELS } from "./calendarTypes";
import { DAY_END_HOUR, DAY_START_HOUR, HOUR_ROW_HEIGHT, isMultiDay } from "./calendarUtils";

interface CalendarTimeGridViewProps {
  days: Date[];
  occurrences: CalendarEventOccurrence[];
  onSelectOccurrence: (occ: CalendarEventOccurrence, anchor: HTMLElement) => void;
  onSelectSlot: (start: Date) => void;
}

interface LaidOutBlock {
  occ: CalendarEventOccurrence;
  col: number;
  colCount: number;
}

const TIME_COL_WIDTH = 56; // px, 시간 라벨 컬럼 폭

/** week 배열에서 date의 요일 인덱스. 범위 밖이면 isEnd에 따라 양끝으로 클램프 */
function dayIndexInDays(days: Date[], date: Date, isEnd = false): number {
  for (let i = 0; i < days.length; i++) {
    if (isSameDay(days[i], date)) return i;
  }
  if (date.getTime() < days[0].getTime()) return isEnd ? -1 : 0;
  return days.length - 1;
}

export function CalendarTimeGridView({ days, occurrences, onSelectOccurrence, onSelectSlot }: CalendarTimeGridViewProps) {
  const gridColumns = `${TIME_COL_WIDTH}px repeat(${days.length}, minmax(0, 1fr))`;
  const hours = useMemo(
    () => Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i),
    [],
  );

  const allDayBars = occurrences.filter((o) => o.event.allDay || isMultiDay(o.event));

  // 종일/멀티데이 바를 요일 열에 걸쳐 배치 (lane + 컬럼 스팬)
  const allDayBarLayout = useMemo(() => {
    const weekStart = days[0];
    const weekEnd = days[days.length - 1];
    const relevant = allDayBars
      .filter((o) => o.occurrenceStart <= weekEnd && o.occurrenceEnd >= weekStart)
      .sort((a, b) => a.occurrenceStart.getTime() - b.occurrenceStart.getTime());

    const laneEndTimes: number[] = [];
    return relevant.map((occ) => {
      let lane = laneEndTimes.findIndex((end) => end <= occ.occurrenceStart.getTime());
      if (lane === -1) {
        lane = laneEndTimes.length;
        laneEndTimes.push(occ.occurrenceEnd.getTime());
      } else {
        laneEndTimes[lane] = occ.occurrenceEnd.getTime();
      }
      const startCol = Math.max(0, dayIndexInDays(days, occ.occurrenceStart));
      const endCol = Math.min(
        days.length - 1,
        dayIndexInDays(days, new Date(occ.occurrenceEnd.getTime() - 1), true),
      );
      return { occ, lane, startCol, endCol };
    });
  }, [allDayBars, days]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 요일 헤더 + 종일 바 + 시간 그리드가 같은 스크롤 컨테이너 안에 있어 세로줄 정렬이 유지됨 */}
      <div className="relative flex-1 overflow-y-auto">
        {/* 요일 헤더 (세로 스크롤 시 상단 고정) */}
        <div className="sticky top-0 z-20 grid border-b border-slate-200 bg-slate-50/90" style={{ gridTemplateColumns: gridColumns }}>
          <div className="px-2 py-2 text-xs font-medium text-slate-500" />
          {days.map((day) => {
            const dow = day.getDay();
            const labelClass =
              dow === 0 ? "text-rose-400" : dow === 6 ? "text-sky-500" : "text-slate-500";
            return (
              <div
                key={day.toISOString()}
                className={`border-r border-slate-100 px-1 py-2 text-center last:border-r-0 sm:px-2 ${isToday(day) ? "bg-slate-50" : ""}`}
              >
                <div className={`text-xs font-medium ${labelClass}`}>{WEEKDAY_LABELS[dow]}</div>
                <div
                  className={`mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    isToday(day) ? "bg-slate-200 font-semibold text-slate-700" : "text-slate-600"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* 종일 / 멀티데이 이벤트 바 (요일 열을 가로질러 연속 배치) */}
        {allDayBarLayout.length > 0 && (
          <div
            className="grid gap-y-[2px] border-b border-slate-200 bg-slate-50/50 py-1"
            style={{ gridTemplateColumns: gridColumns, gridAutoRows: "auto", gridAutoFlow: "row" }}
          >
            {allDayBarLayout.map(({ occ, lane, startCol, endCol }) => (
              <button
                key={`${occ.event.id}-${lane}`}
                onClick={(e) => onSelectOccurrence(occ, e.currentTarget)}
                className="flex min-w-0 items-center gap-1 overflow-hidden rounded-md border-l-2 px-1.5 text-left text-[11px] font-medium leading-[18px] text-slate-700 hover:brightness-[0.98]"
                style={{
                  gridColumn: `${startCol + 2} / ${endCol + 3}`,
                  gridRow: lane + 1,
                  marginLeft: startCol === 0 ? 0 : 2,
                  marginRight: endCol === days.length - 1 ? 0 : 2,
                  backgroundColor: `color-mix(in srgb, ${mutedColorHex(occ.event.color)} 14%, #f1f5f9)`,
                  borderLeftColor: mutedColorHex(occ.event.color),
                }}
              >
                <span className="min-w-0 flex-1 truncate">{occ.event.title}</span>
                {occ.event.categoryName && (
                  <span className="max-w-[40%] shrink-0 truncate text-[9px] opacity-90">
                    · {occ.event.categoryName}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="relative grid" style={{ gridTemplateColumns: gridColumns }}>
          <div className="border-r border-slate-200">
            {hours.map((h) => (
              <div
                key={h}
                style={{ height: HOUR_ROW_HEIGHT }}
                className="flex items-center justify-end border-b border-slate-100 pr-2 text-[11px] text-slate-400"
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {days.map((day) => {
            const dayOccs = occurrences.filter(
              (o) => !o.event.allDay && !isMultiDay(o.event) && isSameDay(o.occurrenceStart, day),
            );
            const blocks = layoutOverlaps(dayOccs);

            return (
              <div
                key={day.toISOString()}
                className={`relative border-r border-slate-100 last:border-r-0 ${isToday(day) ? "bg-slate-50/60" : ""}`}
              >
                {hours.map((h) => (
                  <button
                    key={h}
                    style={{ height: HOUR_ROW_HEIGHT }}
                    className="block w-full border-b border-slate-100 hover:bg-slate-100/70"
                    aria-label={`${day.toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })} ${String(h).padStart(2, "0")}시 일정 추가`}
                    onClick={() => {
                      const slotStart = new Date(day);
                      slotStart.setHours(h, 0, 0, 0);
                      onSelectSlot(slotStart);
                    }}
                  />
                ))}

                {blocks.map(({ occ, col, colCount }, i) => (
                  <EventBlock
                    key={`${occ.event.id}-${i}`}
                    occ={occ}
                    col={col}
                    colCount={colCount}
                    onClick={(anchor) => onSelectOccurrence(occ, anchor)}
                  />
                ))}
              </div>
            );
          })}

          <NowLine days={days} />
        </div>
      </div>
    </div>
  );
}

/** 현재 시간 위치에 표시하는 빨간 가로선 + 시각 배지 */
function NowLine({ days }: { days: Date[] }) {
  const now = new Date();
  const todayIndex = days.findIndex((day) => isSameDay(day, now));
  if (todayIndex < 0) return null;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const top = (minutes / 60) * HOUR_ROW_HEIGHT;
  const maxTop = (DAY_END_HOUR - DAY_START_HOUR) * HOUR_ROW_HEIGHT;
  if (top < 0 || top > maxTop) return null;
  const timeLabel = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{
        top,
        left: `calc(${(todayIndex / days.length) * 100}% + ${TIME_COL_WIDTH * (1 - todayIndex / days.length)}px)`,
        width: `calc(${100 / days.length}% - ${TIME_COL_WIDTH / days.length}px)`,
      }}
    >
      <div className="h-px bg-rose-400/80" />
      <span className="absolute left-0 top-0 -translate-y-1/2 rounded bg-rose-500 px-1 py-px text-[10px] font-semibold leading-3 text-white">
        {timeLabel}
      </span>
    </div>
  );
}

function EventBlock({
  occ,
  col,
  colCount,
  onClick,
}: {
  occ: CalendarEventOccurrence;
  col: number;
  colCount: number;
  onClick: (anchor: HTMLElement) => void;
}) {
  const startMinutes = occ.occurrenceStart.getHours() * 60 + occ.occurrenceStart.getMinutes();
  const durationMinutes = Math.max(
    20,
    (occ.occurrenceEnd.getTime() - occ.occurrenceStart.getTime()) / 60000,
  );
  const top = (startMinutes / 60) * HOUR_ROW_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_ROW_HEIGHT;
  const widthPct = 100 / colCount;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(e.currentTarget);
      }}
      className="absolute overflow-hidden rounded-md border-l-2 px-2 py-1 text-left shadow-sm"
      style={{
        top,
        height: Math.max(height, 20),
        left: `${col * widthPct}%`,
        width: `calc(${widthPct}% - 4px)`,
        backgroundColor: `color-mix(in srgb, ${mutedColorHex(occ.event.color)} 14%, #f1f5f9)`,
        borderLeftColor: mutedColorHex(occ.event.color),
        color: "#475569",
      }}
    >
      <div className="truncate text-[11px] font-semibold leading-tight">
        {occ.occurrenceStart.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}
        {" - "}
        {occ.occurrenceEnd.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </div>
      <div className="flex min-w-0 items-center gap-1 text-[11px] leading-tight">
        <span className="min-w-0 flex-1 truncate">{occ.event.title}</span>
        {occ.event.categoryName && (
          <span className="max-w-[40%] shrink-0 truncate text-[9px] opacity-90">
            {occ.event.categoryName}
          </span>
        )}
      </div>
    </button>
  );
}

/** 겹치는 이벤트들을 컬럼에 배치하는 간단한 알고리즘 */
function layoutOverlaps(occs: CalendarEventOccurrence[]): LaidOutBlock[] {
  const sorted = [...occs].sort((a, b) => a.occurrenceStart.getTime() - b.occurrenceStart.getTime());
  const clusters: CalendarEventOccurrence[][] = [];

  for (const occ of sorted) {
    const cluster = clusters.find((c) =>
      c.some((o) => o.occurrenceStart < occ.occurrenceEnd && o.occurrenceEnd > occ.occurrenceStart),
    );
    if (cluster) cluster.push(occ);
    else clusters.push([occ]);
  }

  const result: LaidOutBlock[] = [];
  for (const cluster of clusters) {
    const colEndTimes: number[] = [];
    const assigned: { occ: CalendarEventOccurrence; col: number }[] = [];
    for (const occ of cluster) {
      let col = colEndTimes.findIndex((end) => end <= occ.occurrenceStart.getTime());
      if (col === -1) {
        col = colEndTimes.length;
        colEndTimes.push(occ.occurrenceEnd.getTime());
      } else {
        colEndTimes[col] = occ.occurrenceEnd.getTime();
      }
      assigned.push({ occ, col });
    }
    const colCount = colEndTimes.length;
    for (const a of assigned) result.push({ occ: a.occ, col: a.col, colCount });
  }
  return result;
}

import { useMemo } from "react";
import type { CalendarEventOccurrence } from "./calendarTypes";
import { mutedColorHex } from "./calendarTypes";

interface CalendarListViewProps {
  occurrences: CalendarEventOccurrence[];
  onSelectOccurrence: (occ: CalendarEventOccurrence, anchor: HTMLElement) => void;
}

export function CalendarListView({ occurrences, onSelectOccurrence }: CalendarListViewProps) {
  const groups = useMemo(() => {
    const map = new Map<string, CalendarEventOccurrence[]>();
    for (const occ of occurrences) {
      const key = occ.occurrenceStart.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(occ);
    }
    return [...map.entries()]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([key, items]) => ({
        date: new Date(key),
        items: items.sort((a, b) => a.occurrenceStart.getTime() - b.occurrenceStart.getTime()),
      }));
  }, [occurrences]);

  if (groups.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        표시할 일정이 없습니다.
      </div>
    );
  }

  return (
    <div className="h-full divide-y divide-slate-200 overflow-y-auto bg-white">
      {groups.map(({ date, items }) => (
        <div key={date.toISOString()} className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:gap-6">
          <div className="w-32 shrink-0 text-sm font-semibold text-slate-700">
            {date.toLocaleDateString("ko-KR", { month: "long", day: "2-digit" })}
          </div>
          <div className="flex-1 space-y-1.5">
            {items.map((occ, i) => (
              <button
                key={`${occ.event.id}-${i}`}
                onClick={(e) => onSelectOccurrence(occ, e.currentTarget)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: mutedColorHex(occ.event.color) }} />
                <span className="w-28 shrink-0 text-xs tabular-nums text-slate-500">
                  {occ.event.allDay
                    ? "종일"
                    : `${occ.occurrenceStart.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })} - ${occ.occurrenceEnd.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}`}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{occ.event.title}</span>
                {occ.event.categoryName && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {occ.event.categoryName}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

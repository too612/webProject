import { useMemo } from "react";
import type { CalendarEventOccurrence } from "./calendarTypes";
import { colorHex } from "./calendarTypes";

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
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        표시할 일정이 없습니다.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto divide-y">
      {groups.map(({ date, items }) => (
        <div key={date.toISOString()} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:gap-6">
          <div className="w-32 shrink-0 text-sm font-medium text-foreground">
            {date.toLocaleDateString("ko-KR", { month: "long", day: "2-digit" })}
          </div>
          <div className="flex-1 space-y-1.5">
            {items.map((occ, i) => (
              <button
                key={`${occ.event.id}-${i}`}
                onClick={(e) => onSelectOccurrence(occ, e.currentTarget)}
                className="flex w-full items-center gap-3 rounded px-2 py-1 text-left hover:bg-muted"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colorHex(occ.event.color) }} />
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {occ.event.allDay
                    ? "종일"
                    : `${occ.occurrenceStart.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })} - ${occ.occurrenceEnd.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}`}
                </span>
                <span className="truncate text-sm">{occ.event.title}</span>
                {occ.event.categoryName && (
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
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

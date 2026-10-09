import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, addMonths, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { Search, X } from "lucide-react";
import { CalendarHeader } from "./calendarHeader";
import { CalendarMonthView } from "./calendarMonthView";
import { CalendarTimeGridView } from "./calendarTimeGridView";
import { CalendarListView } from "./calendarListView";
import { CalendarEventDialog } from "./calendarEventDialog";
import { CalendarEventDetailPopover } from "./calendarEventDetailPopover";
import { mutedColorHex } from "./calendarTypes";
import type {
  CalendarCategory,
  CalendarEvent,
  CalendarEventOccurrence,
  CalendarViewType,
  EventFormValues,
} from "./calendarTypes";
import { expandEventsToRange, getWeekDays } from "./calendarUtils";

export interface EventCalendarProps {
  categories: CalendarCategory[];
  events: CalendarEvent[];
  initialView?: CalendarViewType;
  initialDate?: Date;
  onCreateEvent?: (values: EventFormValues) => void | Promise<void>;
  onUpdateEvent?: (values: EventFormValues) => void | Promise<void>;
  onDeleteEvent?: (eventId: string) => void | Promise<void>;
  className?: string;
}

export function EventCalendar({
  categories,
  events,
  initialView = "month",
  initialDate,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  className,
}: EventCalendarProps) {
  const [view, setView] = useState<CalendarViewType>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate ?? new Date());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [dialogDefaultStart, setDialogDefaultStart] = useState<Date | null>(null);

  const [detailAnchor, setDetailAnchor] = useState<HTMLElement | null>(null);
  const [detailOccurrence, setDetailOccurrence] = useState<CalendarEventOccurrence | null>(null);
  const [search, setSearch] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.code)),
  );
  const filterInitializedRef = useRef(false);

  useEffect(() => {
    if (filterInitializedRef.current || categories.length === 0) return;
    setSelectedCategories(new Set(categories.map((c) => c.code)));
    filterInitializedRef.current = true;
  }, [categories]);

  function toggleCategory(code: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  const allSelected =
    categories.length > 0 && selectedCategories.size === categories.length;

  function toggleAllCategories() {
    if (allSelected) setSelectedCategories(new Set());
    else setSelectedCategories(new Set(categories.map((c) => c.code)));
  }

  function handleMonthSelect(year: number, month: number) {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  const { rangeStart, rangeEnd, headerTitle, gridDays } = useMemo(
    () => computeRange(view, currentDate),
    [view, currentDate],
  );

  const rangeOccurrences = useMemo(
    () => expandEventsToRange(events, rangeStart, rangeEnd),
    [events, rangeStart, rangeEnd],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const occurrence of rangeOccurrences) {
      counts.set(
        occurrence.event.categoryCode,
        (counts.get(occurrence.event.categoryCode) ?? 0) + 1,
      );
    }
    return counts;
  }, [rangeOccurrences]);

  const normalizedSearch = search.trim().toLocaleLowerCase("ko-KR");
  const visibleEvents = useMemo(
    () =>
      events.filter((event) => {
        if (!selectedCategories.has(event.categoryCode)) return false;
        if (!normalizedSearch) return true;
        const searchable = [
          event.title,
          event.description,
          event.location,
          event.categoryName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("ko-KR");
        return searchable.includes(normalizedSearch);
      }),
    [events, normalizedSearch, selectedCategories],
  );

  const occurrences = useMemo(
    () => expandEventsToRange(visibleEvents, rangeStart, rangeEnd),
    [visibleEvents, rangeStart, rangeEnd],
  );

  function goToday() {
    setCurrentDate(new Date());
  }
  function goPrev() {
    setCurrentDate((d) => shiftDate(view, d, -1));
  }
  function goNext() {
    setCurrentDate((d) => shiftDate(view, d, 1));
  }

  function openCreateDialog(defaultStart?: Date) {
    setEditingEvent(null);
    setDialogDefaultStart(defaultStart ?? currentDate);
    setDetailAnchor(null);
    setDetailOccurrence(null);
    setDialogOpen(true);
  }

  function openEditDialog(occ: CalendarEventOccurrence) {
    setEditingEvent(occ.event);
    setDialogDefaultStart(null);
    setDetailAnchor(null);
    setDetailOccurrence(null);
    setDialogOpen(true);
  }

  function handleSelectOccurrence(occ: CalendarEventOccurrence, anchor: HTMLElement) {
    setDetailOccurrence(occ);
    setDetailAnchor(anchor);
  }

  async function handleSubmit(values: EventFormValues) {
    if (editingEvent) await onUpdateEvent?.(values);
    else await onCreateEvent?.(values);
  }

  async function handleDelete(eventId: string): Promise<boolean> {
    const event = events.find((item) => item.id === eventId);
    if (
      !window.confirm(
        event
          ? `"${event.title}" 일정을 삭제하시겠습니까?`
          : "이 일정을 삭제하시겠습니까?",
      )
    ) {
      return false;
    }
    await onDeleteEvent?.(eventId);
    setDetailAnchor(null);
    setDetailOccurrence(null);
    return true;
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 shadow-sm ${className ?? ""}`}>
      <CalendarHeader
        title={headerTitle}
        view={view}
        currentDate={currentDate}
        onViewChange={setView}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onCreateEvent={() => openCreateDialog()}
        onMonthSelect={handleMonthSelect}
      />

      <div className="space-y-3 border-b border-slate-200 bg-slate-50/70 px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="행사 구분 필터">
          <button
            type="button"
            aria-pressed={allSelected}
            onClick={toggleAllCategories}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-1 ${
              allSelected
                ? "border-slate-300 bg-slate-200 text-slate-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            전체
          </button>
          {categories.map((c) => {
            const active = selectedCategories.has(c.code);
            const count = categoryCounts.get(c.code) ?? 0;
            return (
              <button
                key={c.code}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(c.code)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-1 ${
                  active
                    ? "border-slate-200 bg-white text-slate-700 shadow-sm"
                    : "border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: mutedColorHex(c.color) }} />
                {c.name}
                <span className="rounded-full bg-slate-100 px-1.5 text-[10px] tabular-nums text-slate-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <label className="relative block sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="행사명, 장소, 내용 검색"
            aria-label="행사 검색"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="검색어 지우기"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      <div className="relative min-h-0 flex-1">
        {view === "month" && (
          <CalendarMonthView
            monthDate={currentDate}
            occurrences={occurrences}
            onSelectDay={(day) => openCreateDialog(day)}
            onSelectOccurrence={handleSelectOccurrence}
          />
        )}
        {(view === "week" || view === "day") && (
          <CalendarTimeGridView
            days={gridDays}
            occurrences={occurrences}
            onSelectOccurrence={handleSelectOccurrence}
            onSelectSlot={(start) => openCreateDialog(start)}
          />
        )}
        {view === "list" && (
          <CalendarListView occurrences={occurrences} onSelectOccurrence={handleSelectOccurrence} />
        )}
        {view !== "list" && occurrences.length === 0 && (
          <p className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white/95 px-4 py-2 text-center text-sm text-slate-500 shadow-sm">
            선택한 조건에 해당하는 일정이 없습니다.
          </p>
        )}
      </div>

      <CalendarEventDetailPopover
        anchor={detailAnchor}
        occurrence={detailOccurrence}
        onClose={() => {
          setDetailAnchor(null);
          setDetailOccurrence(null);
        }}
        onEdit={openEditDialog}
        onDelete={(occ) => handleDelete(occ.event.id)}
      />

      <CalendarEventDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingEvent(null);
            setDialogDefaultStart(null);
          }
        }}
        categories={categories}
        initialEvent={editingEvent}
        defaultStart={dialogDefaultStart}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}

function computeRange(view: CalendarViewType, date: Date) {
  if (view === "month") {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
    return {
      rangeStart: start,
      rangeEnd: end,
      headerTitle: date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" }),
      gridDays: [] as Date[],
    };
  }
  if (view === "week") {
    const days = getWeekDays(date);
    return {
      rangeStart: days[0],
      rangeEnd: days[6],
      headerTitle: `${formatShort(days[0])} ~ ${formatShort(days[6])}`,
      gridDays: days,
    };
  }
  if (view === "day") {
    return {
      rangeStart: date,
      rangeEnd: date,
      headerTitle: date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
      gridDays: [date],
    };
  }
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return {
    rangeStart: start,
    rangeEnd: end,
    headerTitle: `${formatShort(start)} ~ ${formatShort(end)}`,
    gridDays: [] as Date[],
  };
}

function shiftDate(view: CalendarViewType, date: Date, dir: 1 | -1): Date {
  if (view === "month" || view === "list") return dir === 1 ? addMonths(date, 1) : subMonths(date, 1);
  if (view === "week") return addDays(date, 7 * dir);
  return addDays(date, dir);
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

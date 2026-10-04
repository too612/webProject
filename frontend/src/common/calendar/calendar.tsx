import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, addMonths, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { CalendarHeader } from "./calendarHeader";
import { CalendarMonthView } from "./calendarMonthView";
import { CalendarTimeGridView } from "./calendarTimeGridView";
import { CalendarListView } from "./calendarListView";
import { CalendarEventDialog } from "./calendarEventDialog";
import { CalendarEventDetailPopover } from "./calendarEventDetailPopover";
import { colorHex } from "./calendarTypes";
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

  const visibleEvents = useMemo(
    () => events.filter((e) => selectedCategories.has(e.categoryCode)),
    [events, selectedCategories],
  );

  const { rangeStart, rangeEnd, headerTitle, gridDays } = useMemo(
    () => computeRange(view, currentDate),
    [view, currentDate],
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

  async function handleDelete(eventId: string) {
    await onDeleteEvent?.(eventId);
    setDetailAnchor(null);
    setDetailOccurrence(null);
  }

  return (
    <div className={`flex h-full flex-col border-b bg-background ${className ?? ""}`}>
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

      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2">
        <button
          type="button"
          onClick={toggleAllCategories}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            allSelected
              ? "border-transparent bg-foreground text-background"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          전체
        </button>
        {categories.map((c) => {
          const active = selectedCategories.has(c.code);
          const count = events.filter((e) => e.categoryCode === c.code).length;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => toggleCategory(c.code)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-transparent bg-muted"
                  : "border-border text-muted-foreground opacity-60 hover:opacity-100"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorHex(c.color) }} />
              {c.name}
              <span className="rounded-full bg-background/70 px-1.5 text-[10px] tabular-nums text-muted-foreground">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1">
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

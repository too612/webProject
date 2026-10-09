import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/common/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover";
import type { CalendarViewType } from "./calendarTypes";

interface CalendarHeaderProps {
  title: string;
  view: CalendarViewType;
  currentDate: Date;
  onViewChange: (view: CalendarViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
  onMonthSelect: (year: number, month: number) => void;
}

const VIEW_OPTIONS: { value: CalendarViewType; label: string }[] = [
  { value: "month", label: "월" },
  { value: "week", label: "주" },
  { value: "day", label: "일" },
  { value: "list", label: "목록" },
];

export function CalendarHeader({
  title,
  view,
  currentDate,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onCreateEvent,
  onMonthSelect,
}: CalendarHeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <div className="flex min-w-0 items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={onToday} className="shrink-0 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
          오늘
        </Button>
        <div className="flex shrink-0 items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-600 hover:bg-slate-100" onClick={onPrev} aria-label="이전 기간">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-600 hover:bg-slate-100" onClick={onNext} aria-label="다음 기간">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Popover
          open={pickerOpen}
          onOpenChange={(v) => {
            setPickerOpen(v);
            if (v) setPickerYear(currentDate.getFullYear());
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="ml-1 truncate rounded-md px-1 text-left text-lg font-semibold tracking-tight text-slate-700 outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-300 sm:text-xl"
              title="연도/월 이동"
            >
              {title}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 rounded-xl border-slate-200 bg-white p-3 text-slate-700 shadow-lg" align="start">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPickerYear((y) => y - 1)}
                aria-label="이전 연도"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold">{pickerYear}년</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPickerYear((y) => y + 1)}
                aria-label="다음 연도"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const isCurrent =
                  currentDate.getFullYear() === pickerYear &&
                  currentDate.getMonth() + 1 === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onMonthSelect(pickerYear, m);
                      setPickerOpen(false);
                    }}
                    className={`rounded-md px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 ${
                      isCurrent
                        ? "bg-slate-200 font-semibold text-slate-800"
                        : ""
                    }`}
                  >
                    {m}월
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5" role="group" aria-label="달력 보기 선택">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={view === opt.value}
              onClick={() => onViewChange(opt.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                view === opt.value
                  ? "bg-white text-slate-700 shadow-sm"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={onCreateEvent} className="gap-1.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600">
          <Plus className="h-4 w-4" />
          새 일정
        </Button>
      </div>
    </div>
  );
}

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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          오늘
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrev} aria-label="이전">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext} aria-label="다음">
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
              className="ml-1 text-lg font-semibold tracking-tight hover:underline"
              title="연도/월 이동"
            >
              {title}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
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
                    className={`rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted ${
                      isCurrent
                        ? "bg-primary font-semibold text-primary-foreground"
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

      <div className="flex items-center gap-2">
        <div className="flex rounded-md border p-0.5">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onViewChange(opt.value)}
              className={`rounded-[4px] px-3 py-1.5 text-sm font-medium transition-colors ${
                view === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={onCreateEvent} className="gap-1.5">
          <Plus className="h-4 w-4" />
          새 일정
        </Button>
      </div>
    </div>
  );
}

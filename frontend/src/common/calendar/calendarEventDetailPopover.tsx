import { AlignLeft, MapPin, Pencil, Trash2, X } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/common/ui/popover";
import { Button } from "@/common/ui/button";
import type { CalendarEventOccurrence } from "./calendarTypes";
import { colorHex, textColorForHex } from "./calendarTypes";

interface CalendarEventDetailPopoverProps {
  anchor: HTMLElement | null;
  occurrence: CalendarEventOccurrence | null;
  onClose: () => void;
  onEdit: (occ: CalendarEventOccurrence) => void;
  onDelete: (occ: CalendarEventOccurrence) => void;
}

export function CalendarEventDetailPopover({
  anchor,
  occurrence,
  onClose,
  onEdit,
  onDelete,
}: CalendarEventDetailPopoverProps) {
  const open = Boolean(anchor && occurrence);

  return (
    <Popover open={open} onOpenChange={(v) => !v && onClose()}>
      <PopoverAnchor asChild>
        <span
          style={{
            position: "fixed",
            left: anchor?.getBoundingClientRect().left ?? 0,
            top: anchor?.getBoundingClientRect().top ?? 0,
            width: anchor?.getBoundingClientRect().width ?? 0,
            height: anchor?.getBoundingClientRect().height ?? 0,
            pointerEvents: "none",
          }}
        />
      </PopoverAnchor>
      {occurrence && (
        <PopoverContent className="w-80 p-4" side="right" align="start">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colorHex(occurrence.event.color) }}
              />
              <h3 className="text-base font-semibold leading-tight">{occurrence.event.title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(occurrence)} aria-label="수정">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete(occurrence)}
                aria-label="삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} aria-label="닫기">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="text-foreground">
              {occurrence.occurrenceStart.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}{" "}
              ·{" "}
              {occurrence.event.allDay
                ? "종일"
                : `${occurrence.occurrenceStart.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })} - ${occurrence.occurrenceEnd.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}`}
            </p>

            {occurrence.event.categoryName && (
              <p className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: colorHex(occurrence.event.color),
                    color: textColorForHex(colorHex(occurrence.event.color)),
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                  {occurrence.event.categoryName}
                </span>
              </p>
            )}

            {occurrence.event.location && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                {occurrence.event.location}
              </p>
            )}

            {occurrence.event.description && (
              <p className="flex items-start gap-2">
                <AlignLeft className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-foreground">{occurrence.event.description}</span>
              </p>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

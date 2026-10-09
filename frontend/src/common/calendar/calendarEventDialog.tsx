import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/dialog";
import { Input } from "@/common/ui/input";
import { Textarea } from "@/common/ui/textarea";
import { Label } from "@/common/ui/label";
import { Switch } from "@/common/ui/switch";
import { Button } from "@/common/ui/button";
import type {
  CalendarCategory,
  CalendarEvent,
  EventColorId,
  EventFormValues,
} from "./calendarTypes";
import { mutedColorHex } from "./calendarTypes";
import { fromDateTimeLocalInput, toDateTimeLocalInput } from "./calendarUtils";

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CalendarCategory[];
  initialEvent?: CalendarEvent | null;
  defaultStart?: Date | null;
  onSubmit: (values: EventFormValues) => void | Promise<void>;
  onDelete?: (eventId: string) => boolean | void | Promise<boolean | void>;
}

const DEFAULT_DURATION_MIN = 60;

export function CalendarEventDialog({
  open,
  onOpenChange,
  categories,
  initialEvent,
  defaultStart,
  onSubmit,
  onDelete,
}: CalendarEventDialogProps) {
  const isEditing = Boolean(initialEvent);

  const [title, setTitle] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCategoryCode(initialEvent.categoryCode);
      setDescription(initialEvent.description ?? "");
      setStart(toDateTimeLocalInput(initialEvent.start));
      setEnd(toDateTimeLocalInput(initialEvent.end));
      setAllDay(initialEvent.allDay);
      setLocation(initialEvent.location ?? "");
    } else {
      const base = defaultStart ?? new Date();
      const endDate = new Date(base.getTime() + DEFAULT_DURATION_MIN * 60000);
      setTitle("");
      setCategoryCode(categories[0]?.code ?? "");
      setDescription("");
      setStart(toDateTimeLocalInput(base.toISOString()));
      setEnd(toDateTimeLocalInput(endDate.toISOString()));
      setAllDay(false);
      setLocation("");
    }
  }, [open, initialEvent, defaultStart, categories]);

  const activeColor: EventColorId =
    categories.find((c) => c.code === categoryCode)?.color ?? "indigo";

  async function handleSubmit() {
    if (!title.trim()) {
      setFormError("제목을 입력해주세요.");
      return;
    }
    if (!categoryCode) {
      setFormError("구분값을 선택해주세요.");
      return;
    }
    if (!start || !end) {
      setFormError("시작/종료 일시를 입력해주세요.");
      return;
    }
    if (
      !Number.isFinite(new Date(start).getTime()) ||
      !Number.isFinite(new Date(end).getTime()) ||
      new Date(end).getTime() <= new Date(start).getTime()
    ) {
      setFormError("종료 일시는 시작 일시보다 늦어야 합니다.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await onSubmit({
        id: initialEvent?.id,
        categoryCode,
        title: title.trim(),
        description: description.trim() || undefined,
        start: fromDateTimeLocalInput(start),
        end: fromDateTimeLocalInput(end),
        allDay,
        location: location.trim() || undefined,
        color: activeColor,
      });
      onOpenChange(false);
    } catch {
      // 저장 실패 시 다이얼로그 유지 (에러는 부모 화면에서 노출)
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialEvent || !onDelete) return;
    setDeleting(true);
    try {
      const deleted = await onDelete(initialEvent.id);
      if (deleted === false) return;
      onOpenChange(false);
    } catch {
      // 삭제 실패 시 다이얼로그 유지
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
          <DialogTitle>{isEditing ? "일정 수정" : "새 일정"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4 text-slate-600 sm:px-6">
          <div className="space-y-1.5">
            <Label htmlFor="cal-event-title">제목</Label>
            <Input
              id="cal-event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="행사 제목을 입력하세요"
            />
          </div>

          <div className="space-y-1.5">
            <Label id="cal-event-category-label">구분</Label>
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cal-event-category-label">
                {categories.map((category) => {
                  const selected = categoryCode === category.code;
                  return (
                    <button
                      key={category.code}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCategoryCode(category.code)}
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                        selected
                          ? "border-slate-300 bg-slate-100 text-slate-700"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: mutedColorHex(category.color) }}
                      />
                      {category.name || category.code}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                선택 가능한 구분값이 없습니다. 관리자에게 문의해주세요.
              </p>
            )}
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: mutedColorHex(activeColor) }} />
              구분값에 따라 색상이 자동 지정됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cal-event-start">시작</Label>
              <Input
                id="cal-event-start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                disabled={allDay}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-event-end">종료</Label>
              <Input
                id="cal-event-end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                disabled={allDay}
                min={start || undefined}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={allDay} onCheckedChange={setAllDay} id="cal-event-allday" />
            <Label htmlFor="cal-event-allday">종일</Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cal-event-location">장소</Label>
            <Input
              id="cal-event-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 본당 1층"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cal-event-desc">내용</Label>
            <Textarea
              id="cal-event-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="행사 내용을 입력하세요"
            />
          </div>

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 px-5 py-4 sm:px-6">
          {isEditing && initialEvent && onDelete && (
            <Button variant="destructive" type="button" onClick={handleDelete} disabled={deleting || saving} className="mr-auto gap-1.5">
              <Trash2 className="h-4 w-4" />
              {deleting ? "삭제 중..." : "삭제"}
            </Button>
          )}
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving || deleting}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

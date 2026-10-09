/**
 * File Name   : eventcalendarPage
 * Description : 교회 행사달력 조회/등록/수정/삭제 화면
 * -----------------------------------------------------------------------------
 * common/calendar(EventCalendar)를 활용해 구분값(주일학교/청년부/장년부/교회)
 * 별로 색상 구분되는 행사 일정을 월/주/일/목록 뷰로 제공한다.
 */

import { DetailPageShell } from "../../../common/ui";
import { EventCalendar } from "../../../common/calendar";
import type { EventFormValues } from "../../../common/calendar";
import { useEventCalendar } from "./eventcalendarHook";
import {
  toCalendarCategories,
  toCalendarEvents,
  toChurchEventRequest,
} from "./eventcalendarModel";

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function EventCalendarPage() {
  const { events, categories, loading, error, loadAll, saveEvent, removeEvent } =
    useEventCalendar();

  const calendarEvents = toCalendarEvents(events);
  const calendarCategories = toCalendarCategories(categories);

  /****************************************************************************************************
   * logic method (달력 컴포넌트 콜백과 API 연동)
   ****************************************************************************************************/

  async function handleSave(values: EventFormValues) {
    await saveEvent(toChurchEventRequest(values));
  }

  async function handleDelete(eventId: string) {
    await removeEvent(eventId);
  }

  /****************************************************************************************************
   * render method (제목 섹션 / 달력 섹션 UI 렌더링)
   ****************************************************************************************************/

  return (
    <DetailPageShell contentClassName="space-y-3">
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadAll()}
            className="font-medium underline underline-offset-2 hover:text-rose-950"
          >
            다시 시도
          </button>
        </div>
      )}

      {loading && events.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          행사달력을 불러오는 중입니다...
        </p>
      ) : (
        <div className="h-[min(72vh,760px)] min-h-[420px] sm:min-h-[520px]">
          <EventCalendar
            categories={calendarCategories}
            events={calendarEvents}
            onCreateEvent={handleSave}
            onUpdateEvent={handleSave}
            onDeleteEvent={handleDelete}
          />
        </div>
      )}
    </DetailPageShell>
  );
}

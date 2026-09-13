/**
 * File Name   : eventcalendarPage
 * Description : 교회 행사달력 조회/등록/수정/삭제 화면
 * -----------------------------------------------------------------------------
 * common/ui/calendar(EventCalendar)를 활용해 구분값(주일학교/청년부/장년부/교회)
 * 별로 색상 구분되는 행사 일정을 월/주/일/목록 뷰로 제공한다.
 */

import { PageTitle } from "../../../common/ui";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import { EventCalendar } from "../../../common/ui/calendar";
import type { EventFormValues } from "../../../common/ui/calendar";
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
  const { currentMenu, loading: menuLoading } = useMenu();
  const { events, categories, loading, error, saveEvent, removeEvent } =
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
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <header className="space-y-6">
          <PageTitle
            title={getCurrentMenuPageContent(currentMenu, menuLoading).headline}
            description={
              getCurrentMenuPageContent(currentMenu, menuLoading).summary
            }
          />
        </header>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {loading && events.length === 0 ? (
          <p className="text-sm text-slate-500">
            행사달력을 불러오는 중입니다...
          </p>
        ) : (
          <div className="h-[640px]">
            <EventCalendar
              categories={calendarCategories}
              events={calendarEvents}
              onCreateEvent={handleSave}
              onUpdateEvent={handleSave}
              onDeleteEvent={handleDelete}
            />
          </div>
        )}
      </div>
    </section>
  );
}

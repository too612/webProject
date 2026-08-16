/**
 * File Name   : eventcalendarPage
 * Description : 행사달력 조회 화면
 * -----------------------------------------------------------------------------
 * React 단일 컴포넌트 기준으로 초기화, 라이프사이클, 로직, 렌더링 섹션을 구분한다.
 * 레이아웃 기준: official/about/pastorPage (제목 섹션 + 콘텐츠 섹션)
 */

import { useEffect } from "react";
import { PageTitle } from "../../../common/ui";
import { useEventCalendarInfo } from "./eventcalendarHook";
import { DEFAULT_EVENT_CALENDAR_CONTENT } from "./eventcalendarModel";

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function EventCalendarPage() {
  const { eventCalendar, loading, error, loadInfo } = useEventCalendarInfo();

  /****************************************************************************************************
   * initial/lifecycle method (onload 및 데이터 동기화)
   ****************************************************************************************************/

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  /****************************************************************************************************
   * render method (제목 섹션 / 콘텐츠 섹션 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <header className="space-y-6">
          <PageTitle
            title={DEFAULT_EVENT_CALENDAR_CONTENT.headline}
            description={DEFAULT_EVENT_CALENDAR_CONTENT.summary}
          />
        </header>

        <article className="rounded-none border border-slate-100 bg-slate-50/70 p-5 md:p-6">
          {loading ? (
            <p className="text-sm text-slate-500">
              행사달력을 불러오는 중입니다...
            </p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {eventCalendar?.content || "등록된 행사 일정이 없습니다."}
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

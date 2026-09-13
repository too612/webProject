import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";
import { useAuthPermission } from "../../../common/auth/authPermission";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import { useHistoryContent } from "./historyHook";
import { getHistoryRangeTabs, toYearNumber } from "./historyModel";

export default function HistoryPageView() {
  const navigate = useNavigate();
  const { currentMenu, loading: menuLoading } = useMenu();
  const { historyContent, loading, error, loadHistoryContent } =
    useHistoryContent();
  const { hasAction } = useAuthPermission("PROGRAM_HOME");
  const pageContent = getCurrentMenuPageContent(currentMenu, menuLoading);
  const canEdit = hasAction("edit");
  const [activeRangeKey, setActiveRangeKey] = useState("all");

  useEffect(() => {
    loadHistoryContent();
  }, [loadHistoryContent]);

  const content = historyContent ?? { timeline: [] };
  const rangeTabs = useMemo(
    () => getHistoryRangeTabs(content.timeline),
    [content.timeline],
  );
  const activeRange =
    rangeTabs.find((range) => range.key === activeRangeKey) ?? rangeTabs[0];
  const filteredTimeline = useMemo(
    () =>
      content.timeline.filter((item) => {
        const year = toYearNumber(item.year);
        return year === null
          ? activeRange.key === "all"
          : activeRange.matchYear(year);
      }),
    [activeRange, content.timeline],
  );

  useEffect(() => {
    if (!rangeTabs.some((range) => range.key === activeRangeKey)) {
      setActiveRangeKey("all");
    }
  }, [activeRangeKey, rangeTabs]);

  return (
    <section className="space-y-5">
      <div className="space-y-5 rounded-none border border-slate-200 bg-white p-6 shadow-panel md:p-7">
        <div className="flex items-start justify-between gap-3">
          <PageTitle
            title={pageContent.headline}
            description={pageContent.summary}
          />
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => navigate("/about/history/write")}
              className="shrink-0"
            >
              편집
            </Button>
          )}
        </div>

        {(loading || error) && (
          <div
            className={`border px-3 py-2 text-sm ${error ? "border-red-100 bg-red-50 text-red-700" : "border-blue-100 bg-blue-50 text-blue-700"}`}
          >
            {error ?? "연혁 정보를 불러오는 중입니다."}
          </div>
        )}

        <div className="space-y-4">
          <ul className="grid w-full grid-cols-2 md:grid-cols-6">
            {rangeTabs.map((range) => {
              const isActive = range.key === activeRange.key;
              return (
                <li key={range.key} className="w-full">
                  <button
                    type="button"
                    onClick={() => setActiveRangeKey(range.key)}
                    className={`w-full border border-slate-200 px-2 py-3 text-sm transition-colors ${
                      isActive
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {range.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="space-y-3">
            {filteredTimeline.map((item) => (
              <div
                key={item.year}
                className="border border-slate-200 bg-white p-4 md:p-5"
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[120px_minmax(0,1fr)] md:gap-5">
                  <div className="text-lg font-bold leading-none text-brand-primary md:text-xl">
                    {item.year}
                  </div>
                  <div className="space-y-2">
                    {item.events.map((event, eventIndex) => (
                      <div
                        key={`${item.year}-${event.date}-${eventIndex}`}
                        className="space-y-2 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0"
                      >
                        <p className="text-sm leading-relaxed text-gray-700">
                          <strong className="mr-2 font-bold text-slate-900">
                            {event.date}
                          </strong>
                          <span>{event.description}</span>
                        </p>
                        {event.images && event.images.length > 0 && (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {event.images.map((imagePath) => (
                              <img
                                key={imagePath}
                                src={imagePath}
                                alt={`${item.year} ${event.date} 연혁 사진`}
                                className="h-40 w-full border border-slate-200 bg-slate-100 object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filteredTimeline.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                선택한 기간에 표시할 연혁 데이터가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

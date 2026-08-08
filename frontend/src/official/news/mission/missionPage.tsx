import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import { Button } from "../../../common/ui";
import { useMissionContent } from "./missionHook";
import { DEFAULT_MISSION_CONTENT } from "./missionModel";

export default function MissionPage() {
  const { missionContent, loading, error, loadMissionContent } =
    useMissionContent();

  useEffect(() => {
    loadMissionContent();
  }, [loadMissionContent]);

  const content = missionContent
    ? { ...DEFAULT_MISSION_CONTENT, ...missionContent }
    : DEFAULT_MISSION_CONTENT;
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>("");

  useEffect(() => {
    if (!selectedGroupKey && content.missionaries.length > 0) {
      setSelectedGroupKey(content.missionaries[0].groupKey);
    }
  }, [content.missionaries, selectedGroupKey]);

  const selectedMissionary = useMemo(
    () =>
      content.missionaries.find((item) => item.groupKey === selectedGroupKey) ??
      null,
    [content.missionaries, selectedGroupKey],
  );

  const listQueryParams = useMemo(
    () =>
      selectedGroupKey
        ? { metadataKey: "groupKey", metadataValue: selectedGroupKey }
        : undefined,
    [selectedGroupKey],
  );

  return (
    <section className="space-y-5">
      {loading && (
        <div className="text-sm text-slate-500 py-4 text-center">
          불러오는 중입니다.
        </div>
      )}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              {content.headline}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              {content.summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              선교사 현황 (총 {content.missionaries.length}가정)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {content.missionaries.map((m) => (
                <button
                  type="button"
                  key={m.country}
                  onClick={() => setSelectedGroupKey(m.groupKey)}
                  className={`border rounded-lg bg-slate-50 p-4 space-y-2 text-left transition-colors ${selectedGroupKey === m.groupKey ? "border-brand-primary bg-brand-primary/5" : "border-slate-200 hover:border-brand-primary/30"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.countryFlag}</span>
                    <h4 className="font-bold text-brand-dark text-sm">
                      {m.country}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-700">{m.missionaryName}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>파송 {m.sentYear}년</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg md:text-xl font-extrabold text-brand-dark">
                  그룹별 활동 갤러리
                </h3>
                <p className="text-xs md:text-sm text-slate-600 mt-1">
                  {selectedMissionary
                    ? `${selectedMissionary.country} · ${selectedMissionary.missionaryName}`
                    : "카드를 선택하면 해당 그룹 갤러리가 표시됩니다."}
                </p>
              </div>
              <Button asChild>
                <Link to="/news/mission/write">이미지 등록</Link>
              </Button>
            </div>

            <div className="border border-slate-200 bg-white p-5 md:p-6">
              <ArticleList
                menuKey="MISSION_GALLERY"
                templateCode="MISSION_GALLERY"
                basePath="/news/mission"
                embedded
                queryParams={listQueryParams}
              />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

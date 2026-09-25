import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import { Button, CountryFlag, DetailPageShell } from "../../../common/ui";
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
    if (loading || content.missionaries.length === 0) {
      return;
    }

    const hasSelectedMissionary = content.missionaries.some(
      (item) => item.groupKey === selectedGroupKey,
    );
    if (!hasSelectedMissionary) {
      setSelectedGroupKey(content.missionaries[0].groupKey);
    }
  }, [content.missionaries, loading, selectedGroupKey]);

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

  const writeUrl = selectedGroupKey
    ? `/news/mission/write?groupKey=${encodeURIComponent(selectedGroupKey)}`
    : "/news/mission/write";

  return (
    <DetailPageShell>
      {loading && (
        <div className="py-4 text-center text-sm text-slate-500">
          불러오는 중입니다.
        </div>
      )}
      {error && (
        <div className="border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              선교사 현황 (총 {content.missionaries.length}가정)
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {content.missionaries.map((m) => (
                <button
                  type="button"
                  key={m.country}
                  onClick={() => setSelectedGroupKey(m.groupKey)}
                  className={`rounded-lg border bg-slate-50 p-4 text-left transition-colors ${selectedGroupKey === m.groupKey ? "border-brand-primary bg-brand-primary/5" : "border-slate-200 hover:border-brand-primary/30"}`}
                >
                  <div className="flex items-center gap-2">
                    <CountryFlag
                      code={m.countryFlag}
                      alt={m.country}
                      className="h-[17px] w-auto rounded-[2px] shadow-sm"
                    />
                    <h4 className="text-sm font-bold text-brand-dark">
                      {m.country}
                    </h4>
                  </div>
                  <p className="mt-2 text-xs text-gray-700">
                    {m.missionaryName}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <span>파송 {m.sentYear}년</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark md:text-xl">
                  활동 갤러리
                </h3>
                <p className="mt-1 text-xs text-slate-600 md:text-sm">
                  {selectedMissionary
                    ? `${selectedMissionary.country} · ${selectedMissionary.missionaryName}`
                    : "카드를 선택하면 해당 그룹 갤러리가 표시됩니다."}
                </p>
              </div>
              <Button asChild>
                <Link to={writeUrl}>이미지 등록</Link>
              </Button>
            </div>

            <div className="border border-slate-200 bg-white p-5 md:p-6">
              {selectedGroupKey ? (
                <ArticleList
                  key={selectedGroupKey}
                  menuKey="MISSION_GALLERY"
                  templateCode="MISSION_GALLERY"
                  basePath="/news/mission"
                  embedded
                  queryParams={listQueryParams}
                />
              ) : (
                <div className="py-8 text-center text-sm text-slate-500">
                  선교사 정보를 불러오는 중입니다.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </DetailPageShell>
  );
}

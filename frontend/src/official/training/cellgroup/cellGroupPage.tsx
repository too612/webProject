import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../common/ui";
import { useCellGroupContent } from "./cellGroupHook";
import { DEFAULT_CELL_GROUP_CONTENT } from "./cellGroupModel";

const IMAGE_FALLBACK_BY_CELL_CODE: Record<string, string> = {
  D000009: "/img/official/training/cellgroup/cellgroup_m01.png",
  D000010: "/img/official/training/cellgroup/cellgroup_m02.png",
  D000011: "/img/official/training/cellgroup/cellgroup_m03.png",
  D000012: "/img/official/training/cellgroup/cellgroup_m04.png",
  D000013: "/img/official/training/cellgroup/cellgroup_w01.png",
  D000014: "/img/official/training/cellgroup/cellgroup_w02.png",
  D000015: "/img/official/training/cellgroup/cellgroup_w03.png",
  D000016: "/img/official/training/cellgroup/cellgroup_w04.png",
  D000017: "/img/official/training/cellgroup/cellgroup_w05.png",
  D000018: "/img/official/training/cellgroup/cellgroup_w06.png",
  D000019: "/img/official/training/cellgroup/cellgroup_y01.png",
  D000020: "/img/official/training/cellgroup/cellgroup_y02.png",
};

export default function CellGroupPage() {
  const { cellGroupContent, loading, error, loadCellGroupContent } =
    useCellGroupContent();
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);

  useEffect(() => {
    loadCellGroupContent();
  }, [loadCellGroupContent]);

  const content = cellGroupContent
    ? { ...DEFAULT_CELL_GROUP_CONTENT, ...cellGroupContent }
    : DEFAULT_CELL_GROUP_CONTENT;

  const selectedGroup = useMemo(
    () =>
      content.groups.find(
        (group) => (group.subtitle ?? group.title) === selectedGroupKey,
      ) ?? null,
    [content.groups, selectedGroupKey],
  );

  useEffect(() => {
    if (
      selectedGroupKey &&
      !content.groups.some(
        (group) => (group.subtitle ?? group.title) === selectedGroupKey,
      )
    ) {
      setSelectedGroupKey(null);
    }
  }, [content.groups, selectedGroupKey]);

  const renderGroupImage = (
    group: (typeof content.groups)[number],
    sizeClass: string,
    titleClass: string,
    imageClass = "",
  ) => {
    const fallbackImageUrl = group.subtitle
      ? IMAGE_FALLBACK_BY_CELL_CODE[group.subtitle]
      : undefined;
    const imageUrl = group.imageUrl || fallbackImageUrl;

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={group.title}
          className={`${sizeClass} object-cover ${imageClass}`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] border-b border-slate-200 flex items-end`}
      >
        <div className="w-full bg-white/80 px-4 py-3 backdrop-blur-sm border-t border-slate-200">
          <div className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Cell Family
          </div>
          <div className={`${titleClass} mt-1`}>{group.title}</div>
        </div>
      </div>
    );
  };

  const isLeaderRole = (role: string) => /(셀장|리더|팀장|인도)/.test(role);

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            {content.headline}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {content.summary}
          </p>
        </div>

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
          <div className="space-y-6">
            {!selectedGroup && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {content.groups.map((group) => (
                  <article
                    key={group.subtitle ?? group.title}
                    className="text-left border border-slate-200 bg-white"
                  >
                    <div className="aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100">
                      {renderGroupImage(
                        group,
                        "w-full h-full",
                        "text-base font-bold text-brand-dark",
                      )}
                    </div>

                    <div className="space-y-3 px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-brand-dark">
                            {group.title}
                          </h3>
                          <div className="text-xs text-slate-500">
                            {group.members.length}명
                          </div>
                        </div>
                        <p
                          className="text-sm text-gray-600 leading-6 h-12 overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {group.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-3 text-sm">
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                            리더
                          </div>
                          <div className="mt-1 font-semibold text-slate-800">
                            {group.pastorName ?? group.elderName ?? "-"}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedGroupKey(group.subtitle ?? group.title);
                          }}
                        >
                          상세보기
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {selectedGroup && (
              <div className="space-y-5">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedGroupKey(null);
                  }}
                >
                  <ArrowLeft className="h-[18px] w-[18px] text-brand-primary" />
                  <span>돌아가기</span>
                </Button>

                {(() => {
                  const leaders = selectedGroup.members.filter((member) =>
                    isLeaderRole(member.role),
                  );
                  const members = selectedGroup.members.filter(
                    (member) => !isLeaderRole(member.role),
                  );
                  const leadByManager =
                    selectedGroup.pastorName ?? selectedGroup.elderName;
                  let displayLeaders = leaders;
                  if (displayLeaders.length === 0 && leadByManager) {
                    displayLeaders = [{ name: leadByManager, role: "셀장" }];
                  }
                  const teamRows = [...displayLeaders, ...members];

                  return (
                    <div className="space-y-5">
                      <div className="border border-slate-200 bg-white">
                        <div className="bg-slate-100 border-b border-slate-200">
                          <div className="h-[280px] md:h-[340px] overflow-hidden">
                            {renderGroupImage(
                              selectedGroup,
                              "w-full h-full",
                              "text-xl font-bold text-brand-dark",
                              "object-top",
                            )}
                          </div>
                        </div>
                        <div className="pl-3 pr-5 py-5 md:pl-4 md:pr-6 md:py-6 space-y-2">
                          <div className="inline-flex items-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">
                              {selectedGroup.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedGroup.description}
                          </p>
                        </div>
                      </div>

                      <div className="border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 pl-3 pr-5 py-4 md:pl-4 md:pr-6">
                          <h4 className="mt-1 text-lg font-bold text-brand-dark">
                            {selectedGroup.title} 팀 구성
                          </h4>
                        </div>
                        <div className="p-0">
                          <div className="border border-slate-200">
                            <div className="grid grid-cols-[120px_minmax(0,1fr)] border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                              <span className="text-center">이름</span>
                              <span className="text-center">역할</span>
                            </div>
                            {teamRows.length === 0 && (
                              <div className="px-4 py-3 text-sm text-slate-500">
                                등록된 팀원이 없습니다.
                              </div>
                            )}
                            {teamRows.map((member, index) => (
                              <div
                                key={`${member.name}-${member.role}`}
                                className={`grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 px-4 py-3 text-sm ${index > 0 ? "border-t border-slate-200" : ""}`}
                              >
                                <span className="text-center font-semibold text-brand-dark">
                                  {member.name}
                                </span>
                                <span className="text-center text-slate-700">
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden">
                        <div className="pl-0 pr-0 py-0 space-y-5">
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              <span>주요사역</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {selectedGroup.description}
                            </p>
                            <div className="text-sm text-slate-600">
                              사역시간: {selectedGroup.meetingInfo ?? "-"}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              <span>부서주요활동</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              셀가족별 운영 계획과 돌봄 흐름을 점검하고 참여를
                              독려합니다.
                            </p>
                            <div className="text-sm text-slate-600 leading-relaxed">
                              주요사역: 셀장/부원 교제, 기도제목 나눔, 말씀 적용
                              점검
                            </div>
                            <div className="text-sm text-slate-600">
                              사역시간: {selectedGroup.meetingInfo ?? "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

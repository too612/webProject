import { useEffect } from "react";
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

  useEffect(() => {
    loadCellGroupContent();
  }, [loadCellGroupContent]);

  const content = cellGroupContent
    ? { ...DEFAULT_CELL_GROUP_CONTENT, ...cellGroupContent }
    : DEFAULT_CELL_GROUP_CONTENT;

  const renderGroupImage = (group: (typeof content.groups)[number]) => {
    const fallbackImageUrl = group.subtitle
      ? IMAGE_FALLBACK_BY_CELL_CODE[group.subtitle]
      : undefined;
    const imageUrl = group.imageUrl || fallbackImageUrl;

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={group.title}
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <div className="w-full h-full bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] border-b border-slate-200 flex items-end">
        <div className="w-full bg-white/80 px-4 py-3 backdrop-blur-sm border-t border-slate-200">
          <div className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Cell Family
          </div>
          <div className="mt-1 text-base font-bold text-brand-dark">
            {group.title}
          </div>
        </div>
      </div>
    );
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {content.groups.map((group) => (
              <article
                key={group.title}
                className="text-left border border-slate-200 bg-white"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100">
                  {renderGroupImage(group)}
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
                    <div className="text-right text-xs text-slate-500">
                      {group.meetingInfo ?? "-"}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

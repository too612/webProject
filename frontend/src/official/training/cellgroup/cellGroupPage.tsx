import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Book,
  ChevronRight,
  Clock,
  Coffee,
  Compass,
  Dumbbell,
  Footprints,
  HandHeart,
  Heart,
  MapPin,
  MessageCircle,
  Puzzle,
  Send,
  Sparkles,
  Users,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  PageTitle,
} from "../../../common/ui";
import { useCellGroupContent } from "./cellGroupHook";
import {
  CELL_FILTER_TABS,
  CELL_GROUP_DETAIL_BY_CELL_CODE,
  DEFAULT_CELL_GROUP_CONTENT,
} from "./cellGroupModel";
import type { CellFilterTabKey, CellGroup } from "./cellGroupModel";

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

const KEYWORD_ICON_BY_KEY: Record<string, LucideIcon> = {
  talk: MessageCircle,
  care: HandHeart,
  exercise: Dumbbell,
  meal: Utensils,
  word: Book,
  coffee: Coffee,
  family: Heart,
  people: Users,
  growth: Sparkles,
  career: Compass,
  couple: Puzzle,
  walk: Footprints,
};

const resolveGroupImageUrl = (group: CellGroup) => {
  const fallbackImageUrl = group.subtitle
    ? IMAGE_FALLBACK_BY_CELL_CODE[group.subtitle]
    : undefined;
  return group.imageUrl || fallbackImageUrl;
};

const renderPhoto = (
  imageUrl: string | undefined,
  icon: LucideIcon,
  label: string,
  className: string,
  objectPosition = "object-center",
) => {
  const Icon = icon;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={label}
        draggable={false}
        className={cn(className, "object-cover", objectPosition)}
      />
    );
  }

  return (
    <div
      className={cn(
        className,
        "flex items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]",
      )}
    >
      <Icon className="h-8 w-8 text-slate-400" />
    </div>
  );
};

/* ============================================================
   ModalImageSlider — 모달 이미지 모바일 슬라이드 캐러셀
   - 메인홈 다사랑앨범 모바일 캐러셀 방식과 동일 (드래그 + 인디케이터)
   - PC에서는 사용하지 않음 (md 이상에서는 그리드 사용)
   ============================================================ */
function ModalImageSlider({
  imageUrl,
  icon,
  items,
}: Readonly<{
  imageUrl: string | undefined;
  icon: LucideIcon;
  items: { label: string; objectPosition: string }[];
}>) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [viewWidth, setViewWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const indexRef = useRef(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const len = items.length;
  const cardW = viewWidth > 0 ? viewWidth * 0.52 + 12 : 200;
  const clamped = Math.max(0, Math.min(index, len - 1));
  indexRef.current = clamped;
  const trackX = -clamped * cardW + (dragging ? dragX : 0);

  useEffect(function () {
    const el = viewRef.current;
    if (!el) return;
    const measure = function () {
      setViewWidth(el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return function () {
      ro.disconnect();
    };
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    dragXRef.current = 0;
    setDragging(true);
    setDragX(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;
    setDragX(dx);
  }

  function onPointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const dx = dragXRef.current;
    const cur = indexRef.current;
    let next = cur;
    if (dx < -50) next = Math.min(len - 1, cur + 1);
    else if (dx > 50) next = Math.max(0, cur - 1);
    setIndex(next);
    setDragging(false);
    setDragX(0);
    dragXRef.current = 0;
  }

  return (
    <div>
      <div
        ref={viewRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="touch-none select-none overflow-hidden"
      >
        <div
          className="flex gap-3 transition-transform duration-300"
          style={{
            transform: "translateX(" + trackX + "px)",
            transitionDuration: dragging ? "0ms" : "300ms",
          }}
        >
          {items.map(function (item, i) {
            return (
              <div
                key={i}
                className="relative w-[52%] shrink-0 overflow-hidden rounded-lg bg-slate-100"
              >
                <div className="aspect-video w-full overflow-hidden">
                  {renderPhoto(
                    imageUrl,
                    icon,
                    item.label,
                    "h-full w-full",
                    item.objectPosition,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {len > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map(function (_, i) {
            return (
              <button
                key={i}
                type="button"
                aria-label={i + 1 + "번째 이미지"}
                onClick={function () {
                  setIndex(i);
                }}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === clamped ? "w-5 bg-brand-primary" : "w-2 bg-slate-300",
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CellGroupPage() {
  const { currentMenu, loading: menuLoading } = useMenu();
  const { cellGroupContent, loading, error, loadCellGroupContent } =
    useCellGroupContent();
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CellFilterTabKey>("all");

  useEffect(() => {
    loadCellGroupContent();
  }, [loadCellGroupContent]);

  const content = cellGroupContent
    ? { ...DEFAULT_CELL_GROUP_CONTENT, ...cellGroupContent }
    : DEFAULT_CELL_GROUP_CONTENT;

  const selectedGroup = useMemo(
    () =>
      content.groups.find(
        (group) => (group.subtitle ?? group.title) === selectedCellKey,
      ) ?? null,
    [content.groups, selectedCellKey],
  );

  useEffect(() => {
    if (
      selectedCellKey &&
      !content.groups.some(
        (group) => (group.subtitle ?? group.title) === selectedCellKey,
      )
    ) {
      setSelectedCellKey(null);
    }
  }, [content.groups, selectedCellKey]);

  const filteredGroups = useMemo(() => {
    if (activeTab === "all") return content.groups;
    return content.groups.filter(
      (group) =>
        CELL_GROUP_DETAIL_BY_CELL_CODE[group.subtitle ?? ""]?.category ===
        activeTab,
    );
  }, [content.groups, activeTab]);

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <PageTitle
          title={getCurrentMenuPageContent(currentMenu, menuLoading).headline}
          description={
            getCurrentMenuPageContent(currentMenu, menuLoading).summary
          }
        />
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
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {CELL_FILTER_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key);
                    }}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      activeTab === tab.key
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-primary/50 hover:text-brand-primary",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredGroups.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
                조건에 맞는 셀을 찾지 못했습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredGroups.map((group) => {
                  const detail =
                    CELL_GROUP_DETAIL_BY_CELL_CODE[group.subtitle ?? ""];

                  return (
                    <article
                      key={group.subtitle ?? group.title}
                      className="group flex flex-col overflow-hidden rounded-none border border-slate-200 bg-white transition-colors hover:border-brand-primary/40 hover:shadow-panel"
                    >
                      <div className="relative flex h-36 items-center justify-center bg-[linear-gradient(160deg,#eef2ff_0%,#f8fafc_55%,#f1f5f9_100%)]">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
                          {renderPhoto(
                            resolveGroupImageUrl(group),
                            Users,
                            group.title,
                            "h-full w-full",
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {(detail?.tags ?? []).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="space-y-1 text-center">
                          <h3 className="text-lg font-bold text-brand-dark">
                            {group.title}셀
                          </h3>
                          <p className="line-clamp-2 min-h-10 text-sm text-slate-500">
                            {detail?.summary ?? group.description}
                          </p>
                        </div>

                        <div className="mt-auto border-t border-slate-100 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-center border-brand-primary/40 text-brand-primary hover:bg-brand-primary/5"
                            onClick={() =>
                              setSelectedCellKey(group.subtitle ?? group.title)
                            }
                          >
                            <span>모임 둘러보기</span>
                            <ChevronRight className="h-[18px] w-[18px] text-brand-primary" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={selectedCellKey !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCellKey(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed bottom-14 left-1/2 z-50 flex max-h-[80vh] w-[calc(100%-3rem)] max-w-[760px] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:bottom-4"
          >
            <div className="flex items-center justify-end border-b border-slate-100 px-4 py-2 md:px-6">
              <DialogPrimitive.Close className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            {selectedGroup &&
              (() => {
                const detail =
                  CELL_GROUP_DETAIL_BY_CELL_CODE[selectedGroup.subtitle ?? ""];
                const leader =
                  selectedGroup.members.find((member) =>
                    /(셀리더|리더|셀장|인도)/.test(member.role),
                  )?.name ??
                  selectedGroup.pastorName ??
                  selectedGroup.elderName ??
                  "-";
                const imageUrl = resolveGroupImageUrl(selectedGroup);

                return (
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="space-y-5 p-4 md:space-y-6 md:p-6">
                      {/* Header */}
                      <header className="rounded-2xl bg-[linear-gradient(160deg,#eef2ff_0%,#f8fafc_60%,#f1f5f9_100%)] px-5 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-brand-primary/10 text-lg font-bold text-brand-primary">
                              {leader !== "-" ? leader.charAt(0) : "셀"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <DialogTitle className="text-xl font-bold text-brand-dark">
                              {selectedGroup.title}셀
                            </DialogTitle>
                            <p className="mt-0.5 text-sm text-slate-600">
                              안녕하세요, {selectedGroup.title}셀 리더 {leader}
                              입니다.
                            </p>
                            {detail?.leaderNote && (
                              <p className="mt-0.5 text-xs text-slate-500">
                                {detail.leaderNote}
                              </p>
                            )}
                          </div>
                        </div>
                        {detail && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge
                              variant="secondary"
                              className="gap-1.5 px-2.5 py-1 font-normal text-slate-600"
                            >
                              <Clock className="h-3.5 w-3.5 text-brand-primary" />
                              {detail.meetingTime}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="gap-1.5 px-2.5 py-1 font-normal text-slate-600"
                            >
                              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                              {detail.meetingPlace}
                            </Badge>
                          </div>
                        )}
                      </header>

                      {detail && (
                        <>
                          {/* Block 1 - Keywords */}
                          <section>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              우리 셀의 키워드
                            </h4>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {detail.keywords.map((keyword) => {
                                const KeywordIcon =
                                  KEYWORD_ICON_BY_KEY[keyword.icon] ?? Heart;
                                return (
                                  <div
                                    key={keyword.label}
                                    className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-3.5"
                                  >
                                    <KeywordIcon className="h-5 w-5 text-brand-primary" />
                                    <span className="text-xs font-medium text-slate-700">
                                      {keyword.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </section>

                          {/* Block 2 - Schedule */}
                          <section>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              모임 흐름
                            </h4>
                            <ol className="relative mt-3 space-y-4 pl-1 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                              {detail.schedule.map((step, index) => (
                                <li
                                  key={step.title}
                                  className="relative flex gap-4"
                                >
                                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-primary/10 text-xs font-bold text-brand-primary">
                                    {index + 1}
                                  </span>
                                  <div className="pt-0.5">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-xs font-semibold text-slate-400">
                                        {step.time}
                                      </span>
                                      <span className="text-sm font-bold text-brand-dark">
                                        {step.title}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-sm text-slate-600">
                                      {step.description}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </section>

                          {/* Block 3 - Gallery */}
                          <section>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              현장 스냅
                            </h4>
                            {/* 모바일: 슬라이드 캐러셀 */}
                            <div className="mt-3 md:hidden">
                              <ModalImageSlider
                                imageUrl={imageUrl}
                                icon={Users}
                                items={[
                                  {
                                    label: `${selectedGroup.title} 모임 스냅 1`,
                                    objectPosition: "object-top",
                                  },
                                  {
                                    label: `${selectedGroup.title} 모임 스냅 2`,
                                    objectPosition: "object-center",
                                  },
                                  {
                                    label: `${selectedGroup.title} 모임 스냅 3`,
                                    objectPosition: "object-bottom",
                                  },
                                ]}
                              />
                            </div>
                            {/* PC: 3장 그리드 */}
                            <div className="mt-3 hidden grid-cols-3 gap-3 md:grid">
                              {[
                                "object-top",
                                "object-center",
                                "object-bottom",
                              ].map((objectPosition, index) => (
                                <div
                                  key={objectPosition}
                                  className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                                >
                                  {renderPhoto(
                                    imageUrl,
                                    Users,
                                    `${selectedGroup.title} 모임 스냅 ${index + 1}`,
                                    "h-full w-full",
                                    objectPosition,
                                  )}
                                </div>
                              ))}
                            </div>
                          </section>
                        </>
                      )}

                      {/* CTA */}
                      <div className="border-t border-slate-100 pt-4">
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() =>
                            toast("청강·구경 신청", {
                              description:
                                "부담 없이 방문하실 수 있도록 사무실로 연락 주시면 안내해 드리겠습니다.",
                            })
                          }
                        >
                          <Send className="h-4 w-4" />
                          부담 없이 청강·구경 신청하기
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </section>
  );
}

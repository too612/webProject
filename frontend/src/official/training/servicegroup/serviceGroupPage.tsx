import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Bus,
  ChevronRight,
  CircleCheck,
  Clock,
  HandHeart,
  Mail,
  MapPin,
  Megaphone,
  Music,
  Quote,
  Send,
  UsersRound,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import {
  Button,
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  PageTitle,
} from "../../../common/ui";
import { useServiceGroupContent } from "./serviceGroupHook";
import {
  DEFAULT_SERVICE_GROUP_CONTENT,
  SERVICE_GROUP_DETAIL_BY_DEPT_CODE,
} from "./serviceGroupModel";
import type { ServiceGroup } from "./serviceGroupModel";

const IMAGE_FALLBACK_BY_DEPT_CODE: Record<string, string> = {
  D000003: "/img/official/training/servicegroup/servicegroup_01.png",
  D000004: "/img/official/training/servicegroup/servicegroup_02.png",
  D000005: "/img/official/training/servicegroup/servicegroup_03.png",
  D000006: "/img/official/training/servicegroup/servicegroup_04.png",
  D000007: "/img/official/training/servicegroup/servicegroup_05.png",
  D000008: "/img/official/training/servicegroup/servicegroup_06.png",
};

const DEPARTMENT_ICON_BY_DEPT_CODE: Record<string, LucideIcon> = {
  D000003: Wallet,
  D000004: Megaphone,
  D000005: Bus,
  D000006: HandHeart,
  D000007: UsersRound,
  D000008: Music,
};

const resolveGroupImageUrl = (group: ServiceGroup) => {
  const fallbackImageUrl = group.deptCode
    ? IMAGE_FALLBACK_BY_DEPT_CODE[group.deptCode]
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
   - PC에서는 사용하지 않음 (md 이상에서는 4장 그리드 사용)
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

export default function ServiceGroupPage() {
  const { currentMenu, loading: menuLoading } = useMenu();
  const { serviceGroupContent, loading, error, loadServiceGroupContent } =
    useServiceGroupContent();
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | null>(null);

  useEffect(() => {
    loadServiceGroupContent();
  }, [loadServiceGroupContent]);

  const content = serviceGroupContent ?? DEFAULT_SERVICE_GROUP_CONTENT;
  const selectedGroup = useMemo(
    () =>
      content.groups.find((group) => group.deptCode === selectedDeptCode) ??
      null,
    [content.groups, selectedDeptCode],
  );

  useEffect(() => {
    if (
      selectedDeptCode &&
      !content.groups.some((group) => group.deptCode === selectedDeptCode)
    ) {
      setSelectedDeptCode(null);
    }
  }, [content.groups, selectedDeptCode]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {content.groups.map((group) => {
              const detail =
                SERVICE_GROUP_DETAIL_BY_DEPT_CODE[group.deptCode ?? ""];
              const DeptIcon =
                DEPARTMENT_ICON_BY_DEPT_CODE[group.deptCode ?? ""] ?? HandHeart;

              return (
                <article
                  key={group.deptCode ?? group.title}
                  className="group flex flex-col overflow-hidden rounded-none border border-slate-200 bg-white transition-colors hover:border-brand-primary/40 hover:shadow-panel"
                >
                  {/* Top: 원형 아이콘 + 부서 정보 텍스트 */}
                  <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                      <DeptIcon className="h-10 w-10" strokeWidth={1.4} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-brand-dark">
                        {group.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 min-h-10 text-sm text-slate-500">
                        {detail?.slogan ?? group.description}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {(detail?.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Middle: 사진 (기존 텍스트 영역에 사진 배치) */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    {renderPhoto(
                      resolveGroupImageUrl(group),
                      DeptIcon,
                      group.title,
                      "h-full w-full",
                    )}
                  </div>

                  {/* Bottom: 상세보기 버튼 */}
                  <div className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center border-brand-primary/40 text-brand-primary hover:bg-brand-primary/5"
                      onClick={() =>
                        setSelectedDeptCode(group.deptCode ?? null)
                      }
                    >
                      상세보기
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={selectedDeptCode !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDeptCode(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed bottom-4 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-3rem)] max-w-[1080px] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:max-h-[95vh]"
          >
            <div className="flex items-center justify-end border-b border-slate-100 px-4 py-2 md:px-6">
              <DialogPrimitive.Close className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            {selectedGroup &&
              (() => {
                const detail =
                  SERVICE_GROUP_DETAIL_BY_DEPT_CODE[
                    selectedGroup.deptCode ?? ""
                  ];
                const DeptIcon =
                  DEPARTMENT_ICON_BY_DEPT_CODE[selectedGroup.deptCode ?? ""] ??
                  HandHeart;
                const imageUrl = resolveGroupImageUrl(selectedGroup);
                const leaderName =
                  selectedGroup.leaderName ??
                  selectedGroup.pastorName ??
                  selectedGroup.elderName ??
                  "-";
                const leaderRole = selectedGroup.leaderRole ?? "";

                return (
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="flex min-h-full flex-col">
                      {/* Title */}
                      <div className="px-4 pb-4 pt-4 text-center md:px-6 md:pb-6 md:pt-5">
                        <DialogTitle className="text-xl font-bold text-brand-dark md:text-2xl">
                          {selectedGroup.title}
                        </DialogTitle>
                        <p className="mt-1 text-sm text-slate-500">
                          {detail?.slogan ?? selectedGroup.description}
                        </p>
                      </div>

                      {/* 이미지 + 부서장 한마디 */}
                      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                        {/* Left - Visual Area (모바일: 하단 슬라이드 / PC: 4장 그리드) */}
                        <div className="order-2 flex flex-col justify-center gap-3 bg-slate-50 p-4 md:order-1 md:p-5">
                          {/* 모바일: 이미지 슬라이드 캐러셀 */}
                          <div className="md:hidden">
                            <ModalImageSlider
                              imageUrl={imageUrl}
                              icon={DeptIcon}
                              items={[
                                {
                                  label: `${selectedGroup.title} 부서 현장`,
                                  objectPosition: "object-center",
                                },
                                {
                                  label: `${selectedGroup.title} 현장 스냅 1`,
                                  objectPosition: "object-top",
                                },
                                {
                                  label: `${selectedGroup.title} 현장 스냅 2`,
                                  objectPosition: "object-center",
                                },
                                {
                                  label: `${selectedGroup.title} 현장 스냅 3`,
                                  objectPosition: "object-bottom",
                                },
                              ]}
                            />
                          </div>
                          {/* PC: 4장 그리드 */}
                          <div className="hidden flex-col gap-3 md:flex">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              {renderPhoto(
                                imageUrl,
                                DeptIcon,
                                `${selectedGroup.title} 부서 현장`,
                                "h-full w-full",
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
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
                                    DeptIcon,
                                    `${selectedGroup.title} 현장 스냅 ${index + 1}`,
                                    "h-full w-full",
                                    objectPosition,
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right - 모임시간 및 장소 + 부서장 한마디 + 소개 섹션 */}
                        <div className="order-1 flex flex-col justify-center gap-4 px-4 py-4 md:order-2 md:gap-5 md:px-6 md:py-5">
                          {detail && (
                            <>
                              <section>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                                  <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                                  모임시간 및 장소
                                </h4>
                                {/* 시간·장소 개별 박스 (모바일: 나란히 한 줄) */}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 sm:px-4 sm:py-3 sm:text-sm">
                                    <Clock className="h-3.5 w-3.5 shrink-0 text-brand-primary/60 sm:h-4 sm:w-4" />
                                    <span className="truncate">
                                      {detail.meetingTime}
                                    </span>
                                  </div>
                                  <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 sm:px-4 sm:py-3 sm:text-sm">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-primary/60 sm:h-4 sm:w-4" />
                                    <span className="truncate">
                                      {detail.meetingPlace}
                                    </span>
                                  </div>
                                </div>
                              </section>

                              <section>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                                  <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                                  부서장 한마디
                                </h4>
                                <div className="relative mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                                  <Quote className="h-4 w-4 text-brand-primary/60" />
                                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                                    {detail.vision}
                                  </p>
                                  <div className="mt-2.5 text-xs text-slate-500">
                                    {leaderName}
                                    {leaderRole && ` · ${leaderRole}`}
                                  </div>
                                  <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-slate-50" />
                                </div>
                              </section>

                              <section>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                                  <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                                  주요 역할
                                </h4>
                                <ul className="mt-3 space-y-2">
                                  {detail.roles.map((role) => (
                                    <li
                                      key={role}
                                      className="flex items-center gap-2.5 text-sm text-slate-700"
                                    >
                                      <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                                      {role}
                                    </li>
                                  ))}
                                </ul>
                              </section>

                              <section>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                                  <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                                  이런 분을 찾습니다
                                </h4>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {detail.joinProfile.map((item) => (
                                    <span
                                      key={item}
                                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </section>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Lower: CTA */}
                      <div className="flex flex-col border-t border-slate-100 px-4 py-4 md:px-6 md:py-5">
                        <div className="flex flex-col-reverse gap-2 sm:flex-row">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              toast("부서 문의", {
                                description:
                                  "사무실로 연락 주시면 해당 부서와 연결해 드리겠습니다.",
                              })
                            }
                          >
                            <Mail className="h-4 w-4" />
                            문의하기
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() =>
                              toast("섬김 지원 신청", {
                                description:
                                  "상세 안내를 위해 교회 사무실로 문의해 주세요.",
                              })
                            }
                          >
                            <Send className="h-4 w-4" />
                            섬김 지원하기
                          </Button>
                        </div>
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

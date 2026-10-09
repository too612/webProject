/**
 * File Name   : livePage
 * Description : 오산 다사랑교회 TV 온라인 예배 안내 화면 (미사용 변수 제거 및 최적화 버전)
 * -----------------------------------------------------------------------------
 */

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Info, Play, RefreshCw, Video } from "lucide-react";
import { useLiveItems } from "./liveHook";
import { liveApi } from "./liveApi";
import { Button, DetailPageShell } from "../../../common/ui";
import {
  LIVE_CHANNEL_URL,
  LIVE_STREAM_EMBED_URL,
  LIVE_STREAM_TITLE,
  LIVE_TAB_LABELS,
  parseLiveSermonTitle,
} from "./liveModel";
import type { LiveItem, LiveStreamStatus, LiveTab } from "./liveModel";

const SERMON_TABS: Exclude<LiveTab, "live">[] = [
  "sunday_day",
  "sunday_evening",
  "wednesday",
  "friday",
];
const PAGE_TABS: LiveTab[] = [...SERMON_TABS, "live"];

function SermonVideoCard({ item }: Readonly<{ item: LiveItem }>) {
  const meta = parseLiveSermonTitle(item.title);
  const content = (
    <>
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        <Video
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-white/40"
          aria-hidden="true"
        />
        {item.thumbnailUrl && (
          <img
            src={item.thumbnailUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}
        {item.linkUrl && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/15">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg">
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            </span>
          </span>
        )}
      </div>
      <div className="space-y-2 px-4 py-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand-primary">
          {meta.title}
        </h3>
        {(meta.date || meta.scripture || meta.preacher) && (
          <dl className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {meta.date && (
              <div className="flex gap-1">
                <dt className="sr-only">예배일</dt>
                <dd>{meta.date}</dd>
              </div>
            )}
            {meta.scripture && (
              <div className="flex gap-1">
                <dt className="sr-only">성경본문</dt>
                <dd>{meta.scripture}</dd>
              </div>
            )}
            {meta.preacher && (
              <div className="flex gap-1">
                <dt className="sr-only">설교자</dt>
                <dd>{meta.preacher}</dd>
              </div>
            )}
          </dl>
        )}
        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {item.description}
          </p>
        )}
      </div>
    </>
  );

  if (!item.linkUrl) {
    return (
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {content}
      </article>
    );
  }

  return (
    <a
      href={item.linkUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`${meta.title} 영상 유튜브에서 재생`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      {content}
    </a>
  );
}

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function LivePage() {
  const [tab, setTab] = useState<LiveTab>("sunday_day");
  const tabButtons = useRef<Array<HTMLButtonElement | null>>([]);

  // 영상 목록(items)과 로딩 상태를 추가로 가져옵니다.
  const { items, loading, error, loadLiveItems } = useLiveItems();

  // 실시간 탭의 라이브 방송 상태 (null = 아직 조회 전)
  const [streamStatus, setStreamStatus] = useState<LiveStreamStatus | null>(
    null,
  );
  const [streamLoading, setStreamLoading] = useState(false);

  /****************************************************************************************************
   * initial/lifecycle method (onload 및 데이터 동기화)
   ****************************************************************************************************/

  useEffect(() => {
    if (tab !== "live") {
      loadLiveItems(tab);
    }
  }, [tab, loadLiveItems]);

  // 백엔드에서 현재 라이브 방송 상태를 조회합니다.
  const loadLiveStreamStatus = useCallback(() => {
    setStreamLoading(true);
    liveApi
      .getLiveStreamStatus()
      .then((status) => {
        setStreamStatus(status);
      })
      .catch(() => {
        // 조회 실패 시 기존 live_stream embed 방식으로 폴백
        setStreamStatus({ live: false, available: false });
      })
      .finally(() => {
        setStreamLoading(false);
      });
  }, []);

  // 실시간 탭에 진입할 때마다 라이브 방송 상태를 조회합니다.
  useEffect(() => {
    if (tab === "live") {
      loadLiveStreamStatus();
    }
  }, [tab, loadLiveStreamStatus]);

  /****************************************************************************************************
   * logic method (업무 검증 및 값 계산)
   ****************************************************************************************************/

  // 렌더링 성능 최적화를 위해 useCallback을 적용한 유튜브 채널 이동 핸들러
  const handleMoveToChannel = useCallback(() => {
    window.open(LIVE_CHANNEL_URL, "_blank", "noreferrer");
  }, []);

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % PAGE_TABS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + PAGE_TABS.length) % PAGE_TABS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = PAGE_TABS.length - 1;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      const nextTab = PAGE_TABS[nextIndex];
      setTab(nextTab);
      tabButtons.current[nextIndex]?.focus();
    }
  };

  const renderVideoContent = () => {
    if (tab === "live") {
      if (streamLoading) {
        return (
          <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200 animate-pulse" />
        );
      }

      if (streamStatus?.live && streamStatus.videoId) {
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"
                  aria-hidden="true"
                />
                <span>LIVE</span>
              </span>
              <span className="text-sm font-medium text-slate-700 truncate">
                {streamStatus.title ?? LIVE_STREAM_TITLE}
              </span>
            </div>
            <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
              <iframe
                className="w-full h-full"
                title={streamStatus.title ?? LIVE_STREAM_TITLE}
                src={`https://www.youtube.com/embed/${streamStatus.videoId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      }

      if (streamStatus?.available === false) {
        return (
          <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
            <iframe
              className="w-full h-full"
              title={LIVE_STREAM_TITLE}
              src={LIVE_STREAM_EMBED_URL}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      return (
        <div className="w-full aspect-video rounded-md overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-center p-8">
          <span className="text-3xl" aria-hidden="true">
            📺
          </span>
          <p className="text-sm font-semibold text-slate-700">
            지금은 실시간 방송 중이 아닙니다.
          </p>
          <p className="text-xs text-slate-400">
            예배 시간이 되면 이곳에서 실시간으로 시청하실 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Button variant="outline" onClick={loadLiveStreamStatus}>
              <RefreshCw className="h-4 w-4 mr-1" />
              방송 상태 확인
            </Button>
            <Button onClick={handleMoveToChannel}>유튜브 채널에서 보기</Button>
          </div>
        </div>
      );
    }

    return null;
  };

  /****************************************************************************************************
   * render method (조회 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <DetailPageShell
      actions={
        <Button
          onClick={handleMoveToChannel}
          className="self-start sm:self-auto"
        >
          유튜브 채널 바로가기
        </Button>
      }
      contentClassName="space-y-6"
    >
      {/* 메인 비디오 영역 및 통일된 탭 구조 */}
      <div className="space-y-5 pt-2">
        {/* 탭 네비게이션 */}
        <div className="-mx-4 overflow-x-auto border-b border-slate-200 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex min-w-max sm:w-full"
            role="tablist"
            aria-label="예배 영상 종류"
          >
            {PAGE_TABS.map((pageTab, index) => {
              const selected = tab === pageTab;
              return (
                <button
                  key={pageTab}
                  id={`worship-tab-${pageTab}`}
                  ref={(node) => {
                    tabButtons.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="worship-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(pageTab)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary sm:flex-1 sm:px-5 ${
                    selected
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {LIVE_TAB_LABELS[pageTab]}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="worship-panel"
          role="tabpanel"
          aria-labelledby={`worship-tab-${tab}`}
          tabIndex={0}
          className="min-h-[400px] outline-none"
        >
          {tab !== "live" ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {LIVE_TAB_LABELS[tab]}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    최근 업데이트된 예배 영상을 모아볼 수 있습니다.
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {loading ? "영상 불러오는 중" : `${items.length}개 영상`}
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={`skeleton-${index}-${tab}`}
                      className="overflow-hidden rounded-xl border border-slate-200"
                    >
                      <div className="aspect-video animate-pulse bg-slate-100" />
                      <div className="space-y-2 p-4">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div
                  role="alert"
                  className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-10 text-center"
                >
                  <p className="text-sm font-medium text-rose-700">{error}</p>
                  <Button variant="outline" onClick={() => loadLiveItems(tab)}>
                    <RefreshCw className="mr-1 h-4 w-4" />
                    다시 시도
                  </Button>
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item, index) => (
                    <SermonVideoCard
                      key={`${item.videoId ?? item.title ?? "sermon"}-${index}`}
                      item={item}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                  <Video
                    className="h-8 w-8 text-slate-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    아직 등록된 예배 영상이 없습니다.
                  </p>
                  <p className="text-sm text-slate-500">
                    다사랑교회 유튜브 채널에서 최신 영상을 확인해 주세요.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleMoveToChannel}
                    className="mt-2"
                  >
                    유튜브 채널에서 보기
                  </Button>
                </div>
              )}
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <Info className="h-4 w-4 shrink-0" />
                해당 재생목록의 최신 영상이 자동으로 업데이트되어 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderVideoContent()}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <Info className="h-4 w-4 shrink-0" />
                  방송이 시작되면 실시간 영상이 자동으로 표시됩니다. 방송
                  종료 후에는 예배 영상 탭에서 다시 보실 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DetailPageShell>
  );
}

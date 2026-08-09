/**
 * File Name   : livePage
 * Description : 오산 다사랑교회 TV 온라인 예배 안내 화면 (미사용 변수 제거 및 최적화 버전)
 * -----------------------------------------------------------------------------
 */

import { useEffect, useCallback, useState } from "react";
import { Info, RefreshCw } from "lucide-react";
import { useLiveItems } from "./liveHook";
import { liveApi } from "./liveApi";
import { Button, PageTitle } from "../../../common/ui";
import {
  LIVE_CHANNEL_URL,
  LIVE_PAGE_DESCRIPTION,
  LIVE_PAGE_TITLE,
  LIVE_STREAM_EMBED_URL,
  LIVE_STREAM_TITLE,
  LIVE_TAB_LABELS,
} from "./liveModel";
import type { LiveStreamStatus, LiveTab } from "./liveModel";

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function LivePage() {
  const [tab, setTab] = useState<LiveTab>("sunday_day");

  // 영상 목록(items)과 로딩 상태를 추가로 가져옵니다.
  const { items, loading, error, loadLiveItems } = useLiveItems();

  // 실시간 탭의 라이브 방송 상태 (null = 아직 조회 전)
  const [streamStatus, setStreamStatus] = useState<LiveStreamStatus | null>(null);
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

  /****************************************************************************************************
   * render method (조회 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        {/* 헤더 섹션: 정돈된 레이아웃 및 우측 디자인 통일 버튼 배치 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageTitle
            title={LIVE_PAGE_TITLE}
            description={LIVE_PAGE_DESCRIPTION}
          />

          {/* 요청하신 편집 버튼 디자인 체계와 일치하는 채널 바로가기 버튼 */}
          <Button
            onClick={handleMoveToChannel}
            className="self-start sm:self-auto"
          >
            유튜브 체널 바로가기
          </Button>
        </div>

        {/* 에러 피드백 영역 */}
        {error && (
          <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 메인 비디오 영역 및 통일된 탭 구조 */}
        <div className="space-y-5 pt-2">
          {/* 탭 네비게이션 */}
          <div className="flex gap-0 border-b border-slate-200" role="tablist">
            <button
              className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === "sunday_day" ? "border-b-2 border-brand-primary text-brand-primary -mb-px" : "text-slate-500 hover:text-slate-800"}`}
              type="button"
              onClick={() => setTab("sunday_day")}
            >
              {LIVE_TAB_LABELS.sunday_day}
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === "sunday_evening" ? "border-b-2 border-brand-primary text-brand-primary -mb-px" : "text-slate-500 hover:text-slate-800"}`}
              type="button"
              onClick={() => setTab("sunday_evening")}
            >
              {LIVE_TAB_LABELS.sunday_evening}
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === "wednesday" ? "border-b-2 border-brand-primary text-brand-primary -mb-px" : "text-slate-500 hover:text-slate-800"}`}
              type="button"
              onClick={() => setTab("wednesday")}
            >
              {LIVE_TAB_LABELS.wednesday}
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === "friday" ? "border-b-2 border-brand-primary text-brand-primary -mb-px" : "text-slate-500 hover:text-slate-800"}`}
              type="button"
              onClick={() => setTab("friday")}
            >
              {LIVE_TAB_LABELS.friday}
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === "live" ? "border-b-2 border-brand-primary text-brand-primary -mb-px" : "text-slate-500 hover:text-slate-800"}`}
              type="button"
              onClick={() => setTab("live")}
            >
              {LIVE_TAB_LABELS.live}
            </button>
          </div>

          {/* 1. 영상 목록 탭 (주일낮/저녁/금요 공통 그리드 사용) */}
          {tab !== "live" && (
            <div className="space-y-6 min-h-[400px]">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={`skeleton-${i}-${tab}`}
                      className="aspect-video bg-slate-100 rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {items && items.length > 0 ? (
                    items.map((item, index) => (
                      <a
                        key={`${item.title}-${index}`}
                        href={item.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group block space-y-3"
                      >
                        <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-brand-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center bg-slate-50 rounded-md border border-dashed border-slate-200">
                      <p className="text-sm text-slate-500">
                        불러올 수 있는 영상이 없습니다.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        유튜브 채널에서 직접 확인해 주세요.
                      </p>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Info className="h-4 w-4" />
                해당 재생목록의 최신 영상이 자동으로 업데이트되어 표시됩니다.
              </p>
            </div>
          )}

          {/* 3. 실시간 탭 (실시간 라이브 송출 전용) */}
          {tab === "live" && (
            <div className="space-y-4">
              {streamLoading ? (
                <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200 animate-pulse" />
              ) : streamStatus?.live && streamStatus.videoId ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
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
              ) : streamStatus?.available === false ? (
                // API 조회 실패 시: 기존 live_stream?channel= embed로 폴백 (방송 중이면 자동 로드)
                <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                  <iframe
                    className="w-full h-full"
                    title={LIVE_STREAM_TITLE}
                    src={LIVE_STREAM_EMBED_URL}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                // 방송이 아닐 때: 안내 화면 표시
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
                    <Button onClick={handleMoveToChannel}>
                      유튜브 채널에서 보기
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  방송이 시작되면 실시간 영상이 자동으로 표시됩니다. 방송 종료 후에는
                  예배 영상 탭에서 다시 보실 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

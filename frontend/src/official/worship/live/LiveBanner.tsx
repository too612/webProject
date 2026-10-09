/**
 * File Name   : LiveBanner
 * Description : 실시간 방송 중일 때 메인페이지 주일설교 섹션 상단에 노출되는 라이브 배너
 *
 * ------------------------------------------------------------------
 *
 * - 백엔드(/official/worship/live/stream)에서 라이브 상태를 조회합니다.
 * - 방송 중(live=true)일 때만 배너를 렌더링하고, 클릭 시 해당 라이브 영상으로 이동합니다.
 * - 방송이 아니거나 조회에 실패하면 화면에 아무것도 표시하지 않습니다.
 * - 디자인: 얇은 회색 테두리의 라운드 카드와 LIVE 상태 안내
 */

import { useEffect, useState } from "react";

import { liveApi } from "./liveApi";
import { LIVE_CHANNEL_URL, type LiveStreamStatus } from "./liveModel";

export default function LiveBanner() {
  const [status, setStatus] = useState<LiveStreamStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    liveApi
      .getLiveStreamStatus()
      .then((data) => {
        if (!cancelled) {
          setStatus(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({ live: false, available: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 방송 중이 아니면 렌더링하지 않음
  if (!status?.live) {
    return null;
  }

  const href = status?.videoId
    ? `https://youtube.com/live/${status.videoId}`
    : (status?.channelUrl ?? LIVE_CHANNEL_URL);

  return (
    <div className="bg-white px-4 py-4 sm:py-5">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="유튜브 실시간 예배 방송 시청하기"
        className="
          mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3
          rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center
          shadow-sm transition-colors hover:border-slate-300
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#5C6BC0] focus-visible:ring-offset-2
          sm:gap-2 sm:px-8 sm:py-5
        "
      >
        <div className="flex items-center justify-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-60 motion-reduce:animate-none"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          </span>
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold tracking-wide text-rose-600">
            LIVE
          </span>
          <span className="text-lg font-semibold text-slate-900 sm:text-xl">
            지금은 방송 중입니다
          </span>
        </div>

        <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
          클릭하여 실시간 예배 시청하기
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9.5" />
            <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
          </svg>
        </span>
      </a>
    </div>
  );
}

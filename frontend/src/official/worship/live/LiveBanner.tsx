/**
 * File Name   : LiveBanner
 * Description : 실시간 방송 중일 때 메인페이지 주일설교 섹션 상단에 노출되는 라이브 배너
 *
 * ------------------------------------------------------------------
 *
 * - 백엔드(/official/worship/live/stream)에서 라이브 상태를 조회합니다.
 * - 방송 중(live=true)일 때만 배너를 렌더링하고, 클릭 시 해당 라이브 영상으로 이동합니다.
 * - 방송이 아니거나 조회에 실패하면 화면에 아무것도 표시하지 않습니다.
 * - 디자인: 흰색 스트립 + LIVE 배지 + 원형 재생 아이콘 + 2줄 안내 문구
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
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="유튜브 실시간 예배 방송 시청하기"
      className="
        flex w-full flex-col items-center justify-center gap-1
        bg-white
        px-3 py-3
        text-center
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#5C6BC0]
        focus-visible:ring-offset-2
      "
    >
      {/* 첫 번째 줄 */}
      <div className="flex items-center justify-center gap-2 whitespace-nowrap sm:gap-3">
        {/* 빨간 점 (점멸) */}
        <span className="relative flex h-[15px] w-[15px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2D55] opacity-70"></span>
          <span className="relative inline-flex h-[15px] w-[15px] rounded-full bg-[#FF2D55]"></span>
        </span>

        {/* LIVE 배지 */}
        <span className="inline-flex items-center rounded bg-[#FF2D55] px-3 py-1 text-lg font-bold text-white">
          LIVE
        </span>

        {/* 메인 문구 */}
        <span className="text-xl font-bold text-gray-900 sm:text-2xl">
          지금은 방송 중입니다
        </span>

        {/* 원형 + 채워진 삼각형 재생 아이콘 */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="shrink-0"
        >
          {/* 원형 테두리 */}
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="white"
            stroke="#5C6BC0"
            strokeWidth="2"
          />

          {/* 채워진 재생 삼각형 */}
          <path d="M10 8L17 12L10 16V8Z" fill="#5C6BC0" />
        </svg>
      </div>

      {/* 두 번째 줄 */}
      <p className="text-lg text-gray-500">클릭하여 실시간 예배 시청하기</p>
    </a>
  );
}

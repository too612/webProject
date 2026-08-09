export type LiveTab = 'sunday_day' | 'sunday_evening' | 'wednesday' | 'friday' | 'live';

export type LiveItem = {
  tabType?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  cta?: string;
  thumbnailUrl?: string;
  videoId?: string;
  orderNo?: number;
};

/** 실시간 라이브 방송 상태 (백엔드 /official/worship/live/stream 응답) */
export type LiveStreamStatus = {
  /** 현재 실시간 라이브 방송 중인지 여부 */
  live?: boolean;
  /** API 조회 성공 여부 (false면 기존 live_stream embed로 폴백) */
  available?: boolean;
  /** 현재 라이브 영상 ID */
  videoId?: string;
  /** 라이브 영상 제목 */
  title?: string;
  /** 채널 URL */
  channelUrl?: string;
};

export const LIVE_TAB_LABELS: Record<LiveTab, string> = {
  sunday_day: '주일낮예배',
  sunday_evening: '주일저녁예배',
  wednesday: '수요예배',
  friday: '금요심야기도회',
  live: '실시간',
};

export const LIVE_PAGE_TITLE = '온라인 예배';
export const LIVE_PAGE_DESCRIPTION =
  '유튜브 채널에서 예배 영상과 실시간 예배를 시청하실 수 있습니다.';
export const LIVE_CHANNEL_URL = 'https://www.youtube.com/@dsr87450';
export const LIVE_STREAM_EMBED_URL =
  'https://www.youtube.com/embed/live_stream?channel=UCkGtpE-xZYg4X6HWTEnH89w';
export const LIVE_STREAM_TITLE = '다사랑교회 TV 실시간 예배';

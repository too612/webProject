export type CommunityIndexCategory = {
  code: string;
  label: string;
  path: string;
  param: string;
  count: number;
  periodCount: number;
};

export type CommunityIndexPostItem = {
  category: string;
  path: string;
  param: string;
  title: string;
  date: string;
  views: number;
};

export type CommunityIndexData = {
  source: 'LIVE';
  asOf: string;
  periodStart: string;
  periodEnd: string;
  stats: {
    totalPosts: number;
    contributors: number;
    currentMonthPosts: number;
    totalViews: number;
    periodPosts: number;
  };
  monthlyPosts: { month: string; count: number }[];
  categories: CommunityIndexCategory[];
  recentPosts: CommunityIndexPostItem[];
};

export const COMMUNITY_INDEX_METRICS = [
  { key: 'totalPosts', label: '공개 콘텐츠', unit: '건', note: '공개·비밀번호 없는 게시글 전체' },
  { key: 'currentMonthPosts', label: '이번 달 새 글', unit: '건', note: '게시판 등록일 기준' },
  { key: 'contributors', label: '작성 참여자', unit: '명', note: '공개 글의 고유 작성 계정 · 회원 수 아님' },
  { key: 'totalViews', label: '누적 조회', unit: '회', note: '공개 게시글의 누적 조회수 합계' },
] as const;

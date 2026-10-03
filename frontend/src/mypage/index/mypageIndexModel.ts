export type MypageIndexActivityItem = {
  title: string;
  type: string;
  date: string;
};

export type MypageIndexData = {
  source: 'LIVE' | 'DEMO';
  asOf: string;
  periodStart: string;
  periodEnd: string;
  stats: {
    totalActivities: number;
    periodActivities: number;
    currentMonthActivities: number;
    inquiryCount: number;
  };
  monthlyActivities: { month: string; count: number }[];
  categories: { label: '게시글' | '문의'; count: number }[];
  recentActivities: MypageIndexActivityItem[];
};

export const MYPAGE_INDEX_METRICS = [
  { key: 'totalActivities', label: '전체 작성 기록', note: '내가 작성한 게시글과 문의', icon: 'records', color: 'text-emerald-600 bg-emerald-50' },
  { key: 'periodActivities', label: '최근 6개월 활동', note: '이번 달을 포함한 6개월', icon: 'activity', color: 'text-sky-600 bg-sky-50' },
  { key: 'currentMonthActivities', label: '이번 달 작성', note: '작성일 기준 · 월 시작부터 월 말까지', icon: 'calendar', color: 'text-violet-600 bg-violet-50' },
  { key: 'inquiryCount', label: '내 문의', note: '전체 기간 QNA 게시글', icon: 'inquiry', color: 'text-amber-600 bg-amber-50' },
] as const;

export const MYPAGE_INDEX_LINKS = [
  { to: '/mypage/user/profile', title: '내 정보 관리', desc: '프로필 입력 화면', icon: 'profile' },
  { to: '/mypage/user/password', title: '비밀번호 변경', desc: '비밀번호 입력 화면', icon: 'password' },
  { to: '/mypage/user/notifications', title: '알림 설정', desc: '알림 환경 입력 화면', icon: 'notifications' },
] as const;

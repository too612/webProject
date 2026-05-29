export type MypageIndexActivityItem = {
  id: string;
  title: string;
  type: string;
  date: string;
};

export type MypageIndexData = {
  activityCount: number;
  inquiryCount: number;
  notificationCount: number;
  recentActivities: MypageIndexActivityItem[];
};

export const EMPTY_MYPAGE_INDEX: MypageIndexData = {
  activityCount: 0,
  inquiryCount: 0,
  notificationCount: 0,
  recentActivities: [],
};

export const MYPAGE_INDEX_LINKS = [
  { to: '/mypage/user/profile', icon: '👤', title: '내 정보 관리', desc: '프로필 정보를 수정하세요' },
  { to: '/mypage/user/password', icon: '🔐', title: '비밀번호 변경', desc: '계정 보안을 관리하세요' },
  { to: '/mypage/user/activity', icon: '📋', title: '내 활동 내역', desc: '나의 활동을 확인하세요' },
  { to: '/mypage/user/inquiry', icon: '💬', title: '내 문의 내역', desc: '작성한 문의를 관리하세요' },
  { to: '/mypage/user/notifications', icon: '🔔', title: '알림 설정', desc: '알림 환경을 설정하세요' },
  { to: '/mypage/user/withdraw', icon: '🚪', title: '회원 탈퇴', desc: '회원 탈퇴를 신청하세요' },
] as const;

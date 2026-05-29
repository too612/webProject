export type MypageNotificationSettings = {
  email: boolean;
  sms: boolean;
  push: boolean;
  newsletter: boolean;
};

export type MypageNotificationItem = {
  key: keyof MypageNotificationSettings;
  title: string;
  desc: string;
};

export const EMPTY_MYPAGE_NOTIFICATION_SETTINGS: MypageNotificationSettings = {
  email: true,
  sms: false,
  push: true,
  newsletter: true,
};

export const MYPAGE_NOTIFICATION_ITEMS: MypageNotificationItem[] = [
  { key: 'email', title: '이메일 알림', desc: '중요한 소식을 이메일로 받습니다' },
  { key: 'sms', title: 'SMS 알림', desc: '긴급 소식을 문자로 받습니다' },
  { key: 'push', title: '푸시 알림', desc: '실시간 알림을 받습니다' },
  { key: 'newsletter', title: '뉴스레터', desc: '주간 뉴스레터를 구독합니다' },
];

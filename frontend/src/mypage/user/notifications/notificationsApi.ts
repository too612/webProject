import { EMPTY_MYPAGE_NOTIFICATION_SETTINGS, type MypageNotificationSettings } from './notificationsModel';

export const mypageNotificationsApi = {
  async getNotificationSettings(): Promise<MypageNotificationSettings> {
    return EMPTY_MYPAGE_NOTIFICATION_SETTINGS;
  },

  async updateNotificationSettings(_settings: MypageNotificationSettings): Promise<void> {
    return;
  },
};

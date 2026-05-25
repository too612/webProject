import client from './client';
import type { ApiResponse } from '../types';

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

export const mypageApi = {
  async getIndexData(): Promise<MypageIndexData> {
    const response = await client.get<ApiResponse<MypageIndexData>>('/mypage/index');
    return response.data.data ?? {
      activityCount: 0,
      inquiryCount: 0,
      notificationCount: 0,
      recentActivities: [],
    };
  },
};

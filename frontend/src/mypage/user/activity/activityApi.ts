import type { MypageActivityItem } from './activityModel';

const DEFAULT_ACTIVITIES: MypageActivityItem[] = [
  { id: 1, type: '로그인', description: '웹사이트에 로그인했습니다', date: '2026-05-04 14:30' },
  { id: 2, type: '정보수정', description: '프로필 정보를 수정했습니다', date: '2026-05-03 10:15' },
  { id: 3, type: '게시물작성', description: '게시물을 작성했습니다', date: '2026-05-02 09:45' },
  { id: 4, type: '로그인', description: '웹사이트에 로그인했습니다', date: '2026-05-01 13:20' },
];

export const mypageActivityApi = {
  async getActivityList(): Promise<MypageActivityItem[]> {
    return DEFAULT_ACTIVITIES;
  },
};

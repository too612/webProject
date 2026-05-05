import CommunityListPage from '../shared/CommunityListPage';
import type { CommunityListQuery, CommunityListResult } from '../../../api/communityApi';
import { communityApi } from '../../../api/communityApi';

type PrayerRow = {
  date: string;
  task: string;
  owner: string;
  status: string;
  [key: string]: unknown;
};

export default function FacilitiesPrayerPage() {
  const fetchFn = async (q: CommunityListQuery): Promise<CommunityListResult<PrayerRow>> => {
    const rooms = await communityApi.facilities.getPrayer();
    const items = (rooms as unknown as PrayerRow[]).slice(
      (q.page ?? 0) * (q.size ?? 10),
      ((q.page ?? 0) + 1) * (q.size ?? 10)
    );
    return { items, page: q.page ?? 0, size: q.size ?? 10, totalElements: rooms.length, totalPages: Math.ceil(rooms.length / (q.size ?? 10)) };
  };

  return (
    <CommunityListPage<PrayerRow>
      title="기도실 예약"
      description="기도 공간 예약 및 새벽기도 일정을 관리합니다."
      searchable
      columns={[
        { key: 'date', label: '일정' },
        { key: 'task', label: '업무' },
        { key: 'owner', label: '담당자' },
        { key: 'status', label: '상태' },
      ]}
      fetchFn={fetchFn}
    />
  );
}

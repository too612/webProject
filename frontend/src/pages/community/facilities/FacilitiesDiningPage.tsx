import CommunityListPage from '../shared/CommunityListPage';
import { communityApi } from '../../../api/communityApi';

export default function FacilitiesDiningPage() {
  return (
    <CommunityListPage
      title="식당 현황"
      description="식당 봉사 일정과 담당자 편성 정보를 공유합니다."
      searchable
      columns={[
        { key: 'date', label: '일정' },
        { key: 'task', label: '업무' },
        { key: 'owner', label: '담당자' },
        { key: 'status', label: '상태' },
      ]}
      fetchFn={communityApi.facilities.getDining}
    />
  );
}

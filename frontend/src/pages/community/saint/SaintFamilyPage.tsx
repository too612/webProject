import CommunityListPage from '../shared/CommunityListPage';
import { communityApi } from '../../../api/communityApi';

export default function SaintFamilyPage() {
  return (
    <CommunityListPage
      title="성도 가정"
      description="가정 단위 돌봄 정보와 심방 이력을 관리합니다."
      searchable
      columns={[
        { key: 'name', label: '가정/성도' },
        { key: 'type', label: '유형' },
        { key: 'date', label: '일정' },
        { key: 'contact', label: '연락처' },
      ]}
      fetchFn={communityApi.saint.getFamily}
    />
  );
}

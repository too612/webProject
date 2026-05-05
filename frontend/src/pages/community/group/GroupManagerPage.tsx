import CommunityListPage from '../shared/CommunityListPage';
import { communityApi } from '../../../api/communityApi';

export default function GroupManagerPage() {
  return (
    <CommunityListPage
      title="구역 관리자"
      description="구역 구성 및 담당자 정보를 관리합니다."
      searchable
      columns={[
        { key: 'district', label: '구역' },
        { key: 'leader', label: '리더' },
        { key: 'members', label: '인원' },
        { key: 'attendance', label: '출석률' },
        { key: 'status', label: '상태' },
      ]}
      fetchFn={communityApi.group.getList}
    />
  );
}

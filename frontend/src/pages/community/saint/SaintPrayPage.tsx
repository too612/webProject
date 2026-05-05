import CommunityListPage from '../shared/CommunityListPage';
import { communityApi } from '../../../api/communityApi';

export default function SaintPrayPage() {
  return (
    <CommunityListPage
      title="성도 기도"
      description="성도 개인/가정 기도 요청을 공유합니다."
      searchable
      columns={[
        { key: 'name', label: '이름' },
        { key: 'type', label: '유형' },
        { key: 'request', label: '기도 제목' },
        { key: 'date', label: '등록일' },
        { key: 'status', label: '상태' },
      ]}
      fetchFn={communityApi.saint.getPray}
    />
  );
}

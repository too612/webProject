import CommunityListPage from '../shared/CommunityListPage';
import { communityApi } from '../../../api/communityApi';

export default function SaintJobPage() {
  return (
    <CommunityListPage
      title="성도 일자리"
      description="채용/구직 정보를 커뮤니티 내에서 공유합니다."
      searchable
      columns={[
        { key: 'title', label: '제목' },
        { key: 'company', label: '업체/개인' },
        { key: 'type', label: '유형' },
        { key: 'date', label: '등록일' },
        { key: 'status', label: '상태' },
      ]}
      fetchFn={communityApi.saint.getJob}
    />
  );
}

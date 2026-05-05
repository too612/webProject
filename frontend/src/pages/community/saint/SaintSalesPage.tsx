import CommunityListPage from '../shared/CommunityListPage';
import { communityApi } from '../../../api/communityApi';

export default function SaintSalesPage() {
  return (
    <CommunityListPage
      title="성도 나눔터"
      description="성도 간 물건 나눔 활동을 기록하고 공유합니다."
      searchable
      columns={[
        { key: 'item', label: '물건' },
        { key: 'seller', label: '판매자' },
        { key: 'price', label: '가격' },
        { key: 'status', label: '상태' },
      ]}
      fetchFn={communityApi.saint.getSales}
    />
  );
}

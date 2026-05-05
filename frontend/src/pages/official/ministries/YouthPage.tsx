import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function YouthPage() {
  return (
    <OfficialBoardListPage
      title="청년부"
      breadcrumb="홈 > 사역 > 청년부"
      viewPath="/ministries/youth/view"
      writePath="/ministries/youth/write"
    />
  );
}

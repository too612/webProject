import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function MissionPage() {
  return (
    <OfficialBoardListPage
      title="선교부"
      breadcrumb="홈 > 사역 > 선교부"
      viewPath="/ministries/mission/view"
      writePath="/ministries/mission/write"
    />
  );
}

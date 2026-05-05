import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function ChildrenPage() {
  return (
    <OfficialBoardListPage
      title="유초등부"
      breadcrumb="홈 > 사역 > 유초등부"
      viewPath="/ministries/children/view"
      writePath="/ministries/children/write"
    />
  );
}

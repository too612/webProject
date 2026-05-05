import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function BulletinPage() {
  return (
    <OfficialBoardListPage
      title="교회 소식"
      breadcrumb="홈 > 소식 > 교회 소식"
      viewPath="/news/bulletin/view"
      writePath="/news/bulletin/write"
    />
  );
}

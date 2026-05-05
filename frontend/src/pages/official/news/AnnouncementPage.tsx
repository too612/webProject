import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function AnnouncementPage() {
  return (
    <OfficialBoardListPage
      title="공지사항"
      breadcrumb="홈 > 소식 > 공지사항"
      viewPath="/news/announcement/view"
      writePath="/news/announcement/write"
    />
  );
}

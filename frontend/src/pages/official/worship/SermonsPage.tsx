import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function SermonsPage() {
  return (
    <OfficialBoardListPage
      title="설교"
      breadcrumb="홈 > 예배 > 설교"
      listPath="/worship/sermons"
      viewPath="/worship/sermons/view"
      writePath="/worship/sermons/write"
    />
  );
}

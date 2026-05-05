import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function QnaPage() {
  return (
    <OfficialBoardListPage
      title="문의사항"
      breadcrumb="홈 > 지원 > 문의사항"
      listPath="/support/qna"
      viewPath="/support/qna/view"
      writePath="/support/qna/write"
    />
  );
}

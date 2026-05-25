import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function QnaPage() {
  return (
    <OfficialBoardListPage
      title="Q&A"
      breadcrumb="홈 > 문의사항 > Q&A"
      listPath="/support/qna"
      viewPath="/support/qna/view"
      writePath="/support/qna/write"
    />
  );
}

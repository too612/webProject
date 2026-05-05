import OfficialBoardListPage from '../../official/shared/OfficialBoardListPage';

export default function SupportBoardPage() {
  return (
    <OfficialBoardListPage
      title="커뮤니티 게시판"
      breadcrumb="커뮤니티 게시판"
      viewPath="/community/support/boardView"
      writePath="/community/support/boardWrite"
    />
  );
}

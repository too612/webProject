import OfficialBoardListPage from '../shared/OfficialBoardListPage';

export default function RegistrationPage() {
  return (
    <OfficialBoardListPage
      title="신청하기"
      breadcrumb="홈 > 소식 > 신청하기"
      viewPath="/news/registration/view"
      writePath="/news/registration/write"
    />
  );
}

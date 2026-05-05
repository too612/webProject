import { Link } from 'react-router-dom';

export default function MypageIndexPage() {
  return (
    <div className="space-y-6">
      <div className="bg-brand-primary text-white rounded-panel p-6 space-y-1">
        <h2 className="text-xl font-bold">마이페이지</h2>
        <p className="text-sm text-white/80">내 정보와 활동을 관리하세요</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { to: '/mypage/user/profile', icon: '👤', title: '내 정보 관리', desc: '프로필 정보를 수정하세요' },
          { to: '/mypage/user/password', icon: '🔐', title: '비밀번호 변경', desc: '계정 보안을 관리하세요' },
          { to: '/mypage/user/activity', icon: '📋', title: '내 활동 내역', desc: '나의 활동을 확인하세요' },
          { to: '/mypage/user/inquiry', icon: '💬', title: '내 문의 내역', desc: '작성한 문의를 관리하세요' },
          { to: '/mypage/user/notifications', icon: '🔔', title: '알림 설정', desc: '알림 환경을 설정하세요' },
          { to: '/mypage/user/withdraw', icon: '🚪', title: '회원 탈퇴', desc: '회원 탈퇴를 신청하세요' },
        ].map((item) => (
          <Link to={item.to} key={item.title} className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 hover:shadow-card hover:border-brand-primary/30 transition-all space-y-2">
            <div className="text-2xl">{item.icon}</div>
            <h3 className="font-semibold text-brand-dark text-sm">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

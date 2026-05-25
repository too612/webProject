import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mypageApi, type MypageIndexData } from '../../api/mypageApi';

export default function MypageIndexPage() {
  const [indexData, setIndexData] = useState<MypageIndexData>({
    activityCount: 0,
    inquiryCount: 0,
    notificationCount: 0,
    recentActivities: [],
  });

  useEffect(() => {
    mypageApi.getIndexData()
      .then((data) => setIndexData(data))
      .catch(() => {
        setIndexData({
          activityCount: 0,
          inquiryCount: 0,
          notificationCount: 0,
          recentActivities: [],
        });
      });
  }, []);

  const summaryCards = [
    { label: '내 활동', value: indexData.activityCount },
    { label: '내 문의', value: indexData.inquiryCount },
    { label: '알림', value: indexData.notificationCount },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-brand-primary text-white rounded-panel p-6 space-y-1">
        <h2 className="text-xl font-bold">마이페이지</h2>
        <p className="text-sm text-white/80">내 정보와 활동을 관리하세요</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((item) => (
          <article key={item.label} className="bg-white rounded-panel shadow-panel border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-xl font-bold text-brand-dark mt-1">{item.value}</p>
          </article>
        ))}
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

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-3">
        <h3 className="font-semibold text-brand-dark">최근 활동</h3>
        {(indexData.recentActivities.length > 0
          ? indexData.recentActivities
          : [{ id: 'empty', title: '최근 활동이 없습니다.', type: '-', date: '-' }]
        ).map((activity) => (
          <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 last:border-b-0 py-2">
            <div className="min-w-0">
              <p className="text-sm text-gray-700 truncate">{activity.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.type}</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0 ml-3">{activity.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

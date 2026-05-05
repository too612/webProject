import { Link } from 'react-router-dom';

const quickLinks = [
  { label: '사용자계정관리', to: '/system/user/manager' },
  { label: '권한역할관리', to: '/system/user/role' },
  { label: '공통코드관리', to: '/system/config/code' },
  { label: '메뉴권한관리', to: '/system/config/menu' },
  { label: '시스템로그조회', to: '/system/log/system' },
  { label: '감사추적관리', to: '/system/log/audit' },
  { label: '백업정책관리', to: '/system/backup/policy' },
  { label: '복구이력관리', to: '/system/backup/history' },
];

const groups = [
  { title: '사용자/권한관리', links: quickLinks.slice(0, 2) },
  { title: '운영설정관리', links: quickLinks.slice(2, 4) },
  { title: '로그/감사관리', links: quickLinks.slice(4, 6) },
  { title: '백업/복구관리', links: quickLinks.slice(6, 8) },
];

export default function SystemIndexPage() {
  return (
    <section className="space-y-6">
      <header className="bg-brand-dark text-white rounded-panel shadow-panel px-6 py-5 flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">System Control Center</p>
          <h1 className="text-2xl font-bold">시스템관리 대시보드</h1>
          <p className="text-white/70 text-sm mt-1">권한, 코드, 로그, 백업 운영 상태를 한 곳에서 관리합니다.</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-white/50 mb-0.5">오늘 점검 상태</p>
          <p className="text-lg font-bold text-emerald-300">정상 운영중</p>
          <p className="text-xs text-white/50 mt-0.5">마지막 점검 09:30</p>
        </div>
      </header>

      <div className="bg-white rounded-panel shadow-panel border px-6 py-5">
        <h2 className="font-bold text-gray-800 mb-4">핵심 운영 지표</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '활성 계정', value: '142' },
            { label: '오늘 경고 로그', value: '3' },
            { label: '백업 성공률', value: '99.2%' },
            { label: '미반영 권한요청', value: '5' },
          ].map(({ label, value }) => (
            <article key={label} className="border rounded-card p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-brand-dark">{value}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(({ title, links }) => (
          <article key={title} className="bg-white rounded-panel shadow-panel border px-6 py-5">
            <h2 className="font-bold text-gray-800 mb-3">{title}</h2>
            <div className="grid grid-cols-2 gap-2">
              {links.map((item) => (
                <Link key={item.to} to={item.to}
                  className="block border rounded px-3 py-2.5 text-sm text-gray-700 hover:bg-brand-primary hover:text-white transition-colors text-center">
                  {item.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

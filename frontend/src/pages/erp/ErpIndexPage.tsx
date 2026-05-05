import { Link } from 'react-router-dom';

const tasks = [
  { title: '주일대예배 설교 미작성', status: '긴급', color: 'bg-red-100 text-red-700' },
  { title: '저녁찬양예배 설교 작성 필요', status: '진행중', color: 'bg-amber-100 text-amber-700' },
  { title: '수요예배 본문 검토', status: '검토완료', color: 'bg-emerald-100 text-emerald-700' },
  { title: '새벽기도회 설교 개요 등록', status: '대기', color: 'bg-gray-100 text-gray-600' },
];

const shortcuts = [
  { label: '유튜브', to: '/erp/stats/dashboard' },
  { label: '네이버', to: '/erp/account/report' },
  { label: 'Gmail', to: '/erp/comm/message' },
  { label: 'Google Calendar', to: '/erp/event/calendar' },
  { label: 'Google Docs', to: '/erp/sermon/write' },
  { label: 'Canva', to: '/erp/ministry/report' },
];

export default function ErpIndexPage() {
  return (
    <section className="space-y-6">
      <header className="bg-brand-dark text-white rounded-panel shadow-panel px-6 py-5">
        <h1 className="text-2xl font-bold">ERP 관리자 업무 대시보드</h1>
        <p className="text-white/70 text-sm mt-1">오늘 처리해야 할 교회 운영 업무를 한눈에 확인하세요.</p>
      </header>

      <div className="bg-white rounded-panel shadow-panel border px-6 py-5">
        <h2 className="font-bold text-gray-800 mb-4">핵심 지표</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '총성도', value: '1,284명' },
            { label: '이번주 설교 미작성', value: '2건' },
            { label: '이번달 헌금 집계', value: '₩48,320,000' },
          ].map(({ label, value }) => (
            <article key={label} className="border rounded-card p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-brand-dark">{value}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-white rounded-panel shadow-panel border px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">성도관리</h2>
            <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary text-white font-bold hover:opacity-90" to="/erp/humen/manager" aria-label="성도관리로 이동">+</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '총성도', value: '1,284명' },
              { label: '재직성도', value: '1,120명' },
              { label: '탈퇴성도', value: '164명' },
            ].map(({ label, value }) => (
              <article key={label} className="border rounded-card p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-lg font-bold text-brand-dark">{value}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="bg-white rounded-panel shadow-panel border px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">설교관리</h2>
            <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary text-white font-bold hover:opacity-90" to="/erp/sermon/manager" aria-label="설교관리로 이동">+</Link>
          </div>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.title} className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-700 truncate">{task.title}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${task.color}`}>{task.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-white rounded-panel shadow-panel border px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">헌금 추이</h2>
            <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary text-white font-bold hover:opacity-90" to="/erp/account/manager" aria-label="헌금관리로 이동">+</Link>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />예산</span>
            <span className="flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />수입</span>
            <span className="flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-full bg-red-400" />지출</span>
          </div>
          <svg viewBox="0 0 360 160" className="w-full" aria-label="헌금 추이 그래프">
            <line x1="36" y1="140" x2="340" y2="140" stroke="#e5e7eb" strokeWidth="1" />
            <polyline fill="none" stroke="#10b981" strokeWidth="2" points="40,100 110,80 180,60 250,50 320,40" />
            <polyline fill="none" stroke="#f87171" strokeWidth="2" points="40,115 110,110 180,105 250,98 320,90" />
          </svg>
        </article>

        <article className="bg-white rounded-panel shadow-panel border px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">빠른 메뉴</h2>
            <Link className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary text-white font-bold hover:opacity-90" to="/system" aria-label="바로가기 관리로 이동">+</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {shortcuts.map((item) => (
              <Link key={item.to} to={item.to}
                className="block border rounded px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary hover:text-white transition-colors text-center">
                {item.label}
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

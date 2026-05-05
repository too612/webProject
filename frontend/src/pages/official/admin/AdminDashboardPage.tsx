import { Link } from 'react-router-dom';

const stats = [
  { label: '전체 회원수', value: '1,234', color: 'text-blue-600' },
  { label: '오늘 방문자', value: '89', color: 'text-green-600' },
  { label: '신규 게시글', value: '15', color: 'text-sky-500' },
  { label: '미처리 문의', value: '7', color: 'text-amber-500' },
];

const recentUsers = [
  { id: 'user123', name: '홍길동', email: 'hong@example.com', joined: '2024-01-15', status: '활성' },
  { id: 'user124', name: '김철수', email: 'kim@example.com', joined: '2024-01-14', status: '대기' },
  { id: 'user125', name: '이영희', email: 'lee@example.com', joined: '2024-01-13', status: '활성' },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-brand-dark">관리자 대시보드</h2>
          <p className="text-sm text-gray-500">회원, 게시판, 시스템 운영 현황을 통합 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/login" className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">관리자 로그인</Link>
          <Link to="/admin/register" className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">관리자 등록</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((item) => (
          <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-4 space-y-1" key={item.label}>
            <span className="text-xs text-gray-500">{item.label}</span>
            <strong className={`block text-2xl font-bold ${item.color}`}>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-brand-dark">최근 가입 회원</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID', '이름', '이메일', '가입일', '상태'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{user.id}</td>
                  <td className="px-4 py-3 text-gray-700">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-gray-500">{user.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${user.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

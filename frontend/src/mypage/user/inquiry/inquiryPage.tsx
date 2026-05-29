import { useMypageInquiryPage } from './inquiryHook';

export default function InquiryPage() {
  const { items, loading, error } = useMypageInquiryPage();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">내 문의 내역</h2>
        <p className="text-sm text-gray-500">작성한 문의 사항을 관리하세요</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">제목</th>
              <th className="px-4 py-3 text-left font-medium">상태</th>
              <th className="px-4 py-3 text-left font-medium">작성일</th>
              <th className="px-4 py-3 text-left font-medium">답변</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">문의 내역이 없습니다.</td></tr>
            ) : (
              items.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{inquiry.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${inquiry.status === '답변완료' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{inquiry.date}</td>
                  <td className="px-4 py-3 text-gray-500">{inquiry.reply || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

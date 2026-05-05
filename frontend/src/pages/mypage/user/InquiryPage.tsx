export default function InquiryPage() {
  const inquiries = [
    { id: 1, title: '문의 제목1', status: '답변완료', date: '2026-05-01', reply: '감사합니다' },
    { id: 2, title: '문의 제목2', status: '답변대기', date: '2026-04-28', reply: '' },
    { id: 3, title: '문의 제목3', status: '답변완료', date: '2026-04-25', reply: '안내드립니다' },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">내 문의 내역</h2>
        <p className="text-sm text-gray-500">작성한 문의 사항을 관리하세요</p>
      </div>

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
            {inquiries.map((inquiry) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

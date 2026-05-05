const schedules = [
  { time: '매주 오전 5시', title: '새벽예배', note: '하루를 말씀으로 시작합니다.' },
  { time: '매주 수요일 오후 8시', title: '저녁예배', note: '주중 말씀과 기도의 시간입니다.' },
  { time: '매주 금요일 오후 10시', title: '찬양예배', note: '찬양과 기도 중심의 예배입니다.' },
  { time: '매주 토요일 오후 2시', title: '전도모임', note: '지역과 이웃을 섬기는 모임입니다.' },
  { time: '매주 일요일 오전 9시', title: '주일학교예배', note: '다음 세대를 위한 예배입니다.' },
  { time: '매주 일요일 오전 11시', title: '대예배', note: '온 성도가 함께 드리는 예배입니다.' },
  { time: '매주 일요일 오후 7시', title: '저녁예배', note: '주일을 마무리하는 예배입니다.' },
];

export default function WorshipTimePage() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">예배 시간 안내</h2>
        <p className="text-sm text-gray-500">정기 예배 및 모임 일정을 안내드립니다.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((item) => (
          <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={`${item.time}-${item.title}`}>
            <span className="text-xs text-brand-primary font-medium">{item.time}</span>
            <h3 className="font-semibold text-brand-dark">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">구분</th>
              <th className="px-4 py-3 text-left font-medium">시간</th>
              <th className="px-4 py-3 text-left font-medium">비고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="px-4 py-3 text-gray-700">새벽예배</td><td className="px-4 py-3 text-gray-700">매주 오전 5시</td><td className="px-4 py-3 text-gray-500">본당</td></tr>
            <tr><td className="px-4 py-3 text-gray-700">수요 저녁예배</td><td className="px-4 py-3 text-gray-700">매주 수요일 오후 8시</td><td className="px-4 py-3 text-gray-500">본당</td></tr>
            <tr><td className="px-4 py-3 text-gray-700">찬양예배</td><td className="px-4 py-3 text-gray-700">매주 금요일 오후 10시</td><td className="px-4 py-3 text-gray-500">본당</td></tr>
            <tr><td className="px-4 py-3 text-gray-700">전도모임</td><td className="px-4 py-3 text-gray-700">매주 토요일 오후 2시</td><td className="px-4 py-3 text-gray-500">교육관</td></tr>
            <tr><td className="px-4 py-3 text-gray-700">주일학교예배</td><td className="px-4 py-3 text-gray-700">매주 일요일 오전 9시</td><td className="px-4 py-3 text-gray-500">교육관</td></tr>
            <tr><td className="px-4 py-3 text-gray-700">대예배</td><td className="px-4 py-3 text-gray-700">매주 일요일 오전 11시</td><td className="px-4 py-3 text-gray-500">본당</td></tr>
            <tr><td className="px-4 py-3 text-gray-700">주일 저녁예배</td><td className="px-4 py-3 text-gray-700">매주 일요일 오후 7시</td><td className="px-4 py-3 text-gray-500">본당</td></tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">예배 시간은 교회 일정에 따라 변경될 수 있습니다. 변경 시 공지사항을 확인해 주세요.</p>
    </section>
  );
}

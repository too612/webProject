export default function ActivityPage() {
  const activities = [
    { id: 1, type: '로그인', description: '웹사이트에 로그인했습니다', date: '2026-05-04 14:30' },
    { id: 2, type: '정보수정', description: '프로필 정보를 수정했습니다', date: '2026-05-03 10:15' },
    { id: 3, type: '게시물작성', description: '게시물을 작성했습니다', date: '2026-05-02 09:45' },
    { id: 4, type: '로그인', description: '웹사이트에 로그인했습니다', date: '2026-05-01 13:20' },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">내 활동 내역</h2>
        <p className="text-sm text-gray-500">나의 활동 기록을 확인하세요</p>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
            <span className="shrink-0 bg-brand-primary/10 text-brand-primary text-xs font-medium px-2.5 py-1 rounded-full">{activity.type}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

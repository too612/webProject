import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    newsletter: true,
  });

  const handleChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: 'email' as const, title: '이메일 알림', desc: '중요한 소식을 이메일로 받습니다' },
    { key: 'sms' as const, title: 'SMS 알림', desc: '긴급 소식을 문자로 받습니다' },
    { key: 'push' as const, title: '푸시 알림', desc: '실시간 알림을 받습니다' },
    { key: 'newsletter' as const, title: '뉴스레터', desc: '주간 뉴스레터를 구독합니다' },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">알림 설정</h2>
        <p className="text-sm text-gray-500">알림 방식과 주기를 설정하세요</p>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0">
            <div>
              <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={notifications[item.key]}
              onClick={() => handleChange(item.key)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${notifications[item.key] ? 'bg-brand-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button className="bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">저장</button>
          <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">취소</button>
        </div>
      </div>
    </div>
  );
}

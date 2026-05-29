import { useMypageNotificationsPage } from './notificationsHook';
import { MYPAGE_NOTIFICATION_ITEMS } from './notificationsModel';

export default function NotificationsPage() {
  const {
    settings,
    loading,
    saving,
    error,
    message,
    handleToggle,
    handleSave,
    handleReset,
  } = useMypageNotificationsPage();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">알림 설정</h2>
        <p className="text-sm text-gray-500">알림 방식과 주기를 설정하세요</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}
      {message && <div className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">{message}</div>}

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-4">
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-8">불러오는 중...</p>
        ) : (
          MYPAGE_NOTIFICATION_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                role="switch"
                aria-checked={settings[item.key]}
                onClick={() => handleToggle(item.key)}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${settings[item.key] ? 'bg-brand-primary' : 'bg-gray-300'} disabled:opacity-50`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={loading || saving} className="bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
            {saving ? '저장 중...' : '저장'}
          </button>
          <button onClick={handleReset} disabled={loading || saving} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

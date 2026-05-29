import { useMypageProfilePage } from './profileHook';

export default function ProfilePage() {
    const { form, loading, saving, error, message, handleChange, handleSubmit, handleReset } = useMypageProfilePage();

    return (
        <div className="space-y-5">
            <div className="space-y-1">
                <h2 className="text-lg font-bold text-brand-dark">내 정보 관리</h2>
                <p className="text-sm text-gray-500">프로필 정보를 수정하고 관리하세요</p>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}
            {message && <div className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">{message}</div>}

            <form className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-4" onSubmit={handleSubmit}>
                {[
                    { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요' },
                    { id: 'email', label: '이메일', type: 'email', placeholder: '이메일을 입력하세요' },
                    { id: 'phone', label: '전화번호', type: 'tel', placeholder: '전화번호를 입력하세요' },
                    { id: 'address', label: '주소', type: 'text', placeholder: '주소를 입력하세요' },
                ].map((field) => (
                    <div key={field.id} className="space-y-1">
                        <label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                            type={field.type}
                            id={field.id}
                            placeholder={field.placeholder}
                            value={form[field.id as keyof typeof form]}
                            onChange={(event) => handleChange(field.id as keyof typeof form, event.target.value)}
                            disabled={loading || saving}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary disabled:bg-gray-50"
                        />
                    </div>
                ))}
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading || saving} className="bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
                        {saving ? '저장 중...' : '저장'}
                    </button>
                    <button type="button" onClick={handleReset} disabled={loading || saving} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

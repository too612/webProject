export default function PasswordPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">비밀번호 변경</h2>
        <p className="text-sm text-gray-500">계정의 비밀번호를 변경하세요</p>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="current-password" className="text-sm font-medium text-gray-700">현재 비밀번호</label>
          <input type="password" id="current-password" placeholder="현재 비밀번호를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary" />
        </div>
        <div className="space-y-1">
          <label htmlFor="new-password" className="text-sm font-medium text-gray-700">새 비밀번호</label>
          <input type="password" id="new-password" placeholder="새 비밀번호를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary" />
          <p className="text-xs text-gray-400">8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다</p>
        </div>
        <div className="space-y-1">
          <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">새 비밀번호 확인</label>
          <input type="password" id="confirm-password" placeholder="새 비밀번호를 다시 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary" />
        </div>
        <div className="flex gap-3 pt-2">
          <button className="bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">변경</button>
          <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">취소</button>
        </div>
      </div>
    </div>
  );
}

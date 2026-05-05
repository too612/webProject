export default function WithdrawPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">회원 탈퇴</h2>
        <p className="text-sm text-gray-500">신중하게 생각 후 진행해주세요</p>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-bold text-red-700">⚠️ 중요 안내</h3>
          <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
            <li>회원 탈퇴 후 계정과 모든 데이터는 복구할 수 없습니다</li>
            <li>작성한 게시물과 댓글은 삭제되지 않을 수 있습니다</li>
            <li>탈퇴 후 같은 이메일로 재가입할 수 없습니다</li>
            <li>진행 전에 반드시 개인정보를 백업해주세요</li>
          </ul>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="accent-brand-primary w-4 h-4" />
            <span>위의 모든 안내 사항을 확인했습니다</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="accent-brand-primary w-4 h-4" />
            <span>회원 탈퇴 후 복구가 불가능함을 동의합니다</span>
          </label>
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input type="password" id="password" placeholder="비밀번호를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400" />
          <p className="text-xs text-gray-400">탈퇴를 위해 비밀번호 확인이 필요합니다</p>
        </div>

        <div className="flex gap-3 pt-1">
          <button className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">회원 탈퇴</button>
          <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">취소</button>
        </div>
      </div>
    </div>
  );
}

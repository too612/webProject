export default function ProfilePage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">내 정보 관리</h2>
        <p className="text-sm text-gray-500">프로필 정보를 수정하고 관리하세요</p>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-4">
        {[
          { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요' },
          { id: 'email', label: '이메일', type: 'email', placeholder: '이메일을 입력하세요' },
          { id: 'phone', label: '전화번호', type: 'tel', placeholder: '전화번호를 입력하세요' },
          { id: 'address', label: '주소', type: 'text', placeholder: '주소를 입력하세요' },
        ].map((field) => (
          <div key={field.id} className="space-y-1">
            <label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</label>
            <input type={field.type} id={field.id} placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary" />
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

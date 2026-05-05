export default function BeliefsPage() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">성도들의 신앙고백</h2>
        <p className="text-sm text-gray-500">
          우리 교회는 성경을 신앙과 삶의 최종 권위로 고백하며,
          아래의 내용에 함께 동의합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
          <h3 className="font-semibold text-brand-dark">성경</h3>
          <p className="text-sm text-gray-600">성경은 하나님의 영감으로 기록된 말씀이며 신앙의 기준입니다.</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
          <h3 className="font-semibold text-brand-dark">하나님</h3>
          <p className="text-sm text-gray-600">성부, 성자, 성령 삼위일체 하나님을 믿고 예배합니다.</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
          <h3 className="font-semibold text-brand-dark">예수 그리스도</h3>
          <p className="text-sm text-gray-600">예수 그리스도는 우리의 구주이시며 부활하신 주님이십니다.</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
          <h3 className="font-semibold text-brand-dark">구원</h3>
          <p className="text-sm text-gray-600">구원은 은혜로 주어지며 믿음으로 받아들이는 선물입니다.</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
          <h3 className="font-semibold text-brand-dark">교회</h3>
          <p className="text-sm text-gray-600">교회는 그리스도의 몸이며 서로 사랑하고 섬기는 공동체입니다.</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
          <h3 className="font-semibold text-brand-dark">삶</h3>
          <p className="text-sm text-gray-600">매일의 삶 속에서 하나님 나라의 가치와 사랑을 실천합니다.</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">이 내용은 기본 골격이므로 교회 상황에 맞게 자유롭게 수정하실 수 있습니다.</p>
    </section>
  );
}

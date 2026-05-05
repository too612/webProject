export default function HistoryPage() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">하나님이 인도하신 길</h2>
        <p className="text-sm text-gray-500">
          작은 모임으로 시작한 교회가 오늘에 이르기까지의 여정을
          연도별로 정리했습니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 flex gap-5">
          <div className="shrink-0 font-bold text-brand-primary text-sm w-16">2025년</div>
          <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
            <li>새 성전 리모델링 및 예배 공간 확장</li>
            <li>다음 세대 교육관 개관</li>
          </ul>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 flex gap-5">
          <div className="shrink-0 font-bold text-brand-primary text-sm w-16">2023년</div>
          <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
            <li>지역 돌봄 사역 센터 설립</li>
            <li>전 교인 성경통독 캠페인 진행</li>
          </ul>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 flex gap-5">
          <div className="shrink-0 font-bold text-brand-primary text-sm w-16">2018년</div>
          <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
            <li>해외 단기 선교팀 파송</li>
            <li>청년부 및 직장인 소그룹 확대</li>
          </ul>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 flex gap-5">
          <div className="shrink-0 font-bold text-brand-primary text-sm w-16">2010년</div>
          <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
            <li>교회 창립 및 첫 예배 드림</li>
            <li>지역사회 섬김 사역 시작</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

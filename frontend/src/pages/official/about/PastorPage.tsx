export default function PastorPage() {
  return (
    <section className="space-y-6">
      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">담임목사</h2>
            <p className="text-base font-semibold text-brand-primary mt-1">홍길동</p>
          </div>

          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>안녕하십니까. 저희 홈페이지를 방문해 주신 여러분께 감사드립니다.</p>

            <p>
              2001년 설립 이후 저희는 성도들의 필요를 정확히 이해하고 실제적인 신앙 여정을 돕는 사역에 집중해 왔습니다.
              그 결과 지금까지 수많은 가정과 다음 세대가 함께 성장하는 공동체를 이루어 왔습니다.
            </p>

            <p>
              최근 몇 년간 교회와 사회의 환경은 빠르게 변화하고 있습니다. 저희는 변화에 수동적으로 반응하는 것을 넘어,
              말씀 중심의 본질을 지키면서도 시대와 소통하는 사역을 준비하고 있습니다.
            </p>

            <div className="bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-lg px-4 py-3 text-sm text-brand-dark">
              특히 다음 세대 양육과 지역 섬김 사역에서 축적된 경험을 바탕으로,
              건강하고 지속 가능한 공동체 전환을 지원하고 있습니다.
            </div>

            <p>
              작은 걸음처럼 보일지라도 매주, 매 사역마다 최선을 다하고 있으며,
              예배 이후에도 지속적인 돌봄과 동행으로 성도들의 삶을 섬기기 위해 노력하고 있습니다.
            </p>

            <p>앞으로도 변함없이 하나님과 성도 앞에 신실한 교회가 되겠습니다. 감사합니다.</p>

            <div className="text-right text-sm text-gray-500 space-y-0.5 pt-2">
              <p>2026년 2월</p>
              <p className="font-semibold text-brand-dark">담임목사 홍길동</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex justify-center md:justify-end">
          <img src="/img/pastor-profile.svg" alt="담임목사 홍길동" className="w-48 h-auto rounded-lg object-cover" />
        </div>
      </div>
    </section>
  );
}

export default function VisionPage() {
  return (
    <section className="space-y-6">
      <div className="bg-brand-primary text-white rounded-panel p-6 text-center space-y-2">
        <h2 className="text-2xl font-bold">하나님을 기쁘시게 하는 교회</h2>
        <p className="text-sm text-white/80">
          우리 교회는 예배와 말씀, 사랑과 섬김을 통해 도시와 다음 세대를
          세워가는 공동체가 되기를 꿈꿉니다.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-brand-dark mb-3">핵심 비전</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
            <h4 className="font-semibold text-brand-dark">예배</h4>
            <p className="text-sm text-gray-600">진리와 영으로 드리는 예배가 삶의 중심이 되도록 돕습니다.</p>
          </div>
          <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
            <h4 className="font-semibold text-brand-dark">제자훈련</h4>
            <p className="text-sm text-gray-600">말씀과 삶을 통합하는 성숙한 제자를 세우는 데 집중합니다.</p>
          </div>
          <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
            <h4 className="font-semibold text-brand-dark">공동체</h4>
            <p className="text-sm text-gray-600">서로 사랑하고 돌보는 가족 같은 공동체를 지향합니다.</p>
          </div>
          <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
            <h4 className="font-semibold text-brand-dark">선교와 섬김</h4>
            <p className="text-sm text-gray-600">지역과 열방을 향한 복음 전파와 섬김에 힘씁니다.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-brand-dark mb-3">사역 방향</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2 items-start"><span className="text-brand-primary mt-0.5">•</span><span>균형 잡힌 예배와 교육을 통해 신앙의 기초를 세웁니다.</span></li>
          <li className="flex gap-2 items-start"><span className="text-brand-primary mt-0.5">•</span><span>가정과 일터에서도 신앙이 살아 움직이도록 돕습니다.</span></li>
          <li className="flex gap-2 items-start"><span className="text-brand-primary mt-0.5">•</span><span>다음 세대가 꿈과 소명을 발견하도록 함께 동행합니다.</span></li>
          <li className="flex gap-2 items-start"><span className="text-brand-primary mt-0.5">•</span><span>지역사회와 협력하여 따뜻한 변화를 만들어갑니다.</span></li>
        </ul>
      </div>

      <blockquote className="border-l-4 border-brand-primary pl-4 italic text-sm text-gray-500">
        &quot;너희는 가서 모든 민족을 제자로 삼아... 내가 너희와 항상 함께 있으리라&quot; (마 28:19-20)
      </blockquote>
    </section>
  );
}

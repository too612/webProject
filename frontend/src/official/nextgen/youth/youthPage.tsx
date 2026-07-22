import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";

const YOUTH_PAGE_CONTENT = {
  headline: "중고등부/청년부",
  summary:
    "중고등부와 청년부가 말씀 안에서 정체성을 세우고, 일상 속에서 복음을 살아내는 다음세대로 자라가도록 함께합니다.",
  departments: [
    {
      title: "중고등부",
      target: "중1-고3 학생",
      vision: "세상에서 빛과 소금이 되는 청소년",
      description:
        "중1부터 고3까지, 말씀 안에서 정체성을 발견하고 학교와 일상에서 신앙으로 살아가는 법을 배웁니다.",
      worshipTime: "매주 주일 오전 11시",
      worshipPlace: "본당 3층 중고등부실",
    },
    {
      title: "청년부",
      target: "20-30대 청년",
      vision: "하나님 나라를 꿈꾸는 다음 세대 리더",
      description:
        "2030 청년들이 함께 예배하고 교제하며 각자의 삶의 자리에서 그리스도의 제자로 살아가도록 훈련합니다.",
      worshipTime: "매주 주일 오후 2시",
      worshipPlace: "본당 지하 청년부실",
    },
  ],
  weeklyPrograms: [
    "주일 연합예배 및 부서별 나눔",
    "주중 소그룹 모임(학년/또래별)",
    "월 1회 기도회 및 리더 모임",
    "학기별 말씀훈련/봉사 프로젝트",
  ],
  firstVisitGuide: [
    "예배 10분 전 로비 안내 데스크에서 첫 방문 등록",
    "담당 교역자/리더와 부서 안내 및 좌석 배정",
    "예배 후 또래 소그룹 인도자와 간단한 환영 모임",
  ],
  recentHighlights: [
    "상반기 연합수련회 진행",
    "지역 섬김 봉사활동 참여",
    "분기별 찬양/간증 예배 운영",
  ],
  contacts: [
    { label: "문의", value: "다음세대 사역팀" },
    { label: "연락처", value: "교회 사무실 (평일 09:00-18:00)" },
    { label: "비고", value: "처음 방문 시 안내 데스크로 오세요" },
  ],
};

export default function YouthPage() {
  const content = YOUTH_PAGE_CONTENT;

  return (
    <section className="space-y-0">
      <article className="border border-slate-200 bg-white shadow-panel overflow-hidden">
        <header className="p-6 md:p-7 space-y-6">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              {content.headline}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              {content.summary}
            </p>
          </div>

          <figure className="space-y-3">
            <div className="aspect-[16/6] w-full border border-slate-200 bg-slate-100 overflow-hidden">
              <img
                src="/img/official/nextgen/youth/youth_01.png"
                alt="중고등부 청년부 메인 이미지"
                className="w-full h-full object-cover"
              />
            </div>
          </figure>

          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            aria-label="중고등부와 청년부 소개"
          >
            {content.departments.map((department) => (
              <article key={department.title} className="space-y-2">
                <h3 className="text-base md:text-lg font-bold text-brand-dark">
                  {department.title}
                </h3>
                <div className="border border-slate-200 bg-white p-5 space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {department.description}
                  </p>
                  <dl className="text-sm text-gray-600 divide-y divide-slate-200 border-t border-slate-200">
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="font-semibold text-slate-500">대상</dt>
                      <dd className="text-brand-dark text-right">
                        {department.target}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="font-semibold text-slate-500">비전</dt>
                      <dd className="text-brand-dark text-right">
                        {department.vision}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="font-semibold text-slate-500">
                        예배 시간
                      </dt>
                      <dd className="text-brand-dark text-right">
                        {department.worshipTime}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="font-semibold text-slate-500">
                        예배 장소
                      </dt>
                      <dd className="text-brand-dark text-right">
                        {department.worshipPlace}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </section>

          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            aria-label="중고등부와 청년부 운영 정보"
          >
            <section className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                주중/월간 프로그램
              </h3>
              <div className="border border-slate-200 bg-white p-5">
                <ul
                  className="text-sm text-gray-600 space-y-3"
                  aria-label="주중 및 월간 프로그램"
                >
                  {content.weeklyPrograms.map((program) => (
                    <li key={program} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                      <span>{program}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                처음 방문 가이드
              </h3>
              <div className="border border-slate-200 bg-white p-5">
                <ol
                  className="text-sm text-gray-600 space-y-3"
                  aria-label="처음 방문 가이드"
                >
                  {content.firstVisitGuide.map((guide, index) => (
                    <li key={guide} className="flex items-start gap-2">
                      <span className="font-semibold text-slate-500 min-w-5 text-right">
                        {index + 1}.
                      </span>
                      <span>{guide}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </section>

          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            aria-label="최근 사역과 문의 안내"
          >
            <section className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                최근 사역 하이라이트
              </h3>
              <div className="border border-slate-200 bg-white p-5">
                <ul
                  className="text-sm text-gray-600 space-y-3"
                  aria-label="최근 사역 하이라이트"
                >
                  {content.recentHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                문의 안내
              </h3>
              <div className="border border-slate-200 bg-white p-5">
                <dl className="text-sm text-gray-600 divide-y divide-slate-200 border-t border-slate-200">
                  {content.contacts.map((contact) => (
                    <li
                      key={contact.label}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <dt className="font-semibold text-slate-500">
                        {contact.label}
                      </dt>
                      <dd className="text-brand-dark text-right">
                        {contact.value}
                      </dd>
                    </li>
                  ))}
                </dl>
              </div>
            </section>
          </section>
        </header>

        <footer className="p-6 md:p-7 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-brand-dark">활동 갤러리</h3>
            <Link
              to="/nextgen/youth/write"
              className="inline-flex items-center bg-brand-primary !text-white px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
            >
              글 등록
            </Link>
          </div>
          <ArticleList
            menuKey="YOUTH_GALLERY"
            templateCode="YOUTH_GALLERY"
            basePath="/nextgen/youth"
            embedded
          />
        </footer>
      </article>
    </section>
  );
}

import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";
import { DEFAULT_YOUTH_CONTENT } from "./youthModel";

export default function YouthPage() {
  const content = DEFAULT_YOUTH_CONTENT;

  return (
    <section className="space-y-0">
      <article className="border border-slate-200 bg-white shadow-panel overflow-hidden">
        <header className="p-6 md:p-7 space-y-6">
          <PageTitle title={content.headline} description={content.summary} />

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
            <Button asChild size="sm">
              <Link to="/nextgen/youth/write">글 등록</Link>
            </Button>
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

import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";
import { DEFAULT_SCHOOL_PAGE_CONTENT } from "./schoolModel";

export default function SchoolPromoPage() {
  const content = DEFAULT_SCHOOL_PAGE_CONTENT;

  return (
    <section className="space-y-0">
      <article className="border border-slate-200 bg-white shadow-panel overflow-hidden">
        <header className="p-6 md:p-7 space-y-6">
          <PageTitle title={content.headline} description={content.summary} />

          <figure className="space-y-3">
            <div className="aspect-[16/6] w-full border border-slate-200 bg-slate-100 overflow-hidden">
              <img
                src={content.mainImageUrl}
                alt={content.mainImageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </figure>

          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            aria-label="주일학교 안내"
          >
            <section className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                주일 진행 안내
              </h3>
              <div className="border border-slate-200 bg-white p-5">
                <ol
                  className="text-sm text-gray-600 divide-y divide-slate-200"
                  aria-label="주일 진행 일정"
                >
                  {content.schedule.map((item) => (
                    <li
                      key={item.time}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <span className="font-semibold text-slate-500">
                        {item.time}
                      </span>
                      <strong className="text-brand-dark text-right">
                        {item.title}
                      </strong>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                연령별 반 소개
              </h3>
              <div className="border border-slate-200 bg-white p-5">
                <ul
                  className="text-sm text-gray-600 space-y-3"
                  aria-label="연령별 반 소개"
                >
                  {content.classes.map((item) => (
                    <li key={item.grade} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                      <p>
                        <strong className="text-brand-dark">
                          {item.grade}
                        </strong>
                        : {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </section>

          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            aria-label="주일학교 주제와 방문 안내"
          >
            <section className="space-y-2">
              <h3 className="text-lg font-bold text-brand-dark">
                이번 달 주제
              </h3>
              <div className="border border-slate-200 bg-white p-5 md:p-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-brand-dark">주제</span>:
                  {content.monthlyTheme.subtitle}
                </p>
                <ul
                  className="mt-4 text-sm text-gray-600 divide-y divide-slate-200 border-t border-slate-200"
                  aria-label="이번 달 주제 세부 항목"
                >
                  {content.monthlyTheme.items.map((item) => (
                    <li
                      key={item.week}
                      className="py-2.5 flex items-start gap-3"
                    >
                      <span className="font-semibold text-slate-500 min-w-9">
                        {item.week}
                      </span>
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-bold text-brand-dark">
                처음 온 가정 안내
              </h3>
              <div className="border border-slate-200 bg-white p-5 md:p-6">
                <ol
                  className="text-sm text-gray-600 space-y-3"
                  aria-label="처음 온 가정 안내"
                >
                  {content.visitGuide.map((guide, index) => (
                    <li key={guide} className="flex items-start gap-1.5">
                      <span className="font-semibold text-slate-500 min-w-4 text-right">
                        {index + 1}.
                      </span>
                      <p>{guide}</p>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-slate-500">
                  {content.visitGuideNotice}
                </p>
              </div>
            </section>
          </section>
        </header>

        <footer className="p-6 md:p-7 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-brand-dark">활동 갤러리</h3>
            <Button asChild size="sm">
              <Link to="/nextgen/school/write">글 등록</Link>
            </Button>
          </div>
          <ArticleList
            menuKey="SCHOOL_GALLERY"
            templateCode="SCHOOL_GALLERY"
            basePath="/nextgen/school"
            embedded
          />
        </footer>
      </article>
    </section>
  );
}

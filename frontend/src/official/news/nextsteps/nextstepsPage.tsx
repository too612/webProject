import { DEFAULT_NEXTSTEPS_CONTENT } from "./nextstepsModel";
import { PageTitle } from "../../../common/ui";

export default function NextstepsPage() {
  const content = DEFAULT_NEXTSTEPS_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-8">
        <header className="space-y-6">
          <PageTitle title={content.headline} description={content.summary} />
        </header>

        <article className="overflow-hidden">
          <div className="relative">
            <img
              src={content.mainImageUrl}
              alt={content.mainImageAlt}
              className="w-full min-h-[300px] md:min-h-[420px] object-cover"
            />
          </div>
        </article>

        <article className="space-y-8">
          <section className="space-y-3">
            <div className="h-1 w-7 bg-brand-primary" aria-hidden="true" />
            <h3 className="text-xl md:text-2xl font-bold text-brand-dark">
              등록 안내
            </h3>
            <p className="text-base md:text-lg font-semibold text-brand-dark">
              {content.registrationSubtitle}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {content.registrationText}
            </p>
          </section>

          <section className="space-y-5">
            <div className="h-1 w-7 bg-brand-primary" aria-hidden="true" />
            <h3 className="text-xl md:text-2xl font-bold text-brand-dark">
              등록 절차
            </h3>

            <div className="bg-slate-50 border border-slate-200 p-4 md:p-6">
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-3 px-2 lg:px-4 overflow-visible">
                {content.registrationFlow.map((item, index) => (
                  <li key={item.step} className="overflow-visible">
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-full bg-brand-primary text-white flex flex-col items-center justify-center text-center shadow-[0_8px_18px_rgba(15,23,42,0.22)]">
                        <span className="text-xl md:text-2xl font-bold leading-none">
                          {item.step}
                        </span>
                        <span className="mt-1.5 text-xs md:text-sm font-semibold leading-tight px-2">
                          {item.title}
                        </span>
                      </div>

                      {index < content.registrationFlow.length - 1 ? (
                        <span className="hidden lg:inline-flex ml-2 xl:ml-3 text-brand-primary text-xl xl:text-2xl font-bold leading-none">
                          »
                        </span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <ol className="space-y-4">
              {content.registrationFlow.map((item) => (
                <li key={`${item.step}-detail`} className="space-y-1">
                  <p className="text-xl md:text-2xl font-bold text-brand-dark">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-base bg-brand-primary text-white mr-2 align-middle">
                      {item.step}
                    </span>
                    <span className="align-middle">{item.title}</span>
                  </p>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed pl-10">
                    : {item.detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <div className="h-1 w-7 bg-brand-primary" aria-hidden="true" />
            <h3 className="text-xl md:text-2xl font-bold text-brand-dark">
              새가족교육 안내
            </h3>

            <div className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
              {content.educationGuide.map((item) => (
                <p key={item.label}>
                  <span className="font-semibold text-brand-dark">
                    {item.label}:
                  </span>{" "}
                  {item.value}
                </p>
              ))}
              <p className="pl-0 md:pl-14 text-gray-600">
                {content.educationNote}
              </p>
            </div>

            <div className="space-y-2 text-sm md:text-base text-gray-700">
              <p className="font-semibold text-brand-dark">내용</p>
              <ul className="space-y-2">
                {content.educationContents.map((title, index) => (
                  <li key={title} className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}

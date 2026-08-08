type RegistrationFlow = {
  step: string;
  title: string;
  detail: string;
};

const REGISTRATION_FLOW: RegistrationFlow[] = [
  {
    step: "01",
    title: "등록카드 작성",
    detail: "4층, 5층 예배실 입구(3분 소요). 새가족팀에서 등록카드 작성.",
  },
  {
    step: "02",
    title: "사진 촬영",
    detail:
      "4층 대예배실 입구(1분 소요). 교역자와 담당자들의 원활한 등록과정과 확인을 위해 촬영.",
  },
  {
    step: "03",
    title: "주일예배/새가족 환영",
    detail:
      "대예배실(1시간 소요). 대예배실에서 예배 드림, 예배 중 광고 시간에 새가족 소개 및 환영 시간.",
  },
  {
    step: "04",
    title: "담임목사님 접견",
    detail:
      "3층 새가족영접실(301호)(약 20~30분 소요). 예배 후 안내로 접견, 교회안내문 증정.",
  },
  {
    step: "05",
    title: "점심 식사",
    detail:
      "1층 식당(약 30분 소요). 식사 가능 시간에 따라 2부, 3부 예배 등록한 분에 한함.",
  },
];

export default function NextstepsPage() {
  return (
    <section className="space-y-8">
      <article className="overflow-hidden">
        <header className="px-1 md:px-2 space-y-6">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              새가족 안내
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              처음 오신 분이 교회의 분위기와 메시지를 한 화면에서 편안하게 느낄
              수 있도록 구성했습니다.
            </p>
          </div>
        </header>
      </article>

      <article className="overflow-hidden">
        <div className="relative">
          <img
            src="/img/official/news/nextsteps/nextsteps_01.png"
            alt="새가족 안내 메인 이미지"
            className="w-full min-h-[300px] md:min-h-[420px] object-cover"
          />

          <div className="absolute left-[6%] top-[30%] md:top-[31%] w-[66%] md:w-[52%] p-4 md:p-6 bg-white/74 backdrop-blur-[1px] border border-white/75 space-y-3 md:space-y-5">
            <p className="text-base md:text-[2rem] font-semibold leading-relaxed md:leading-[1.45] text-slate-900">
              평신도 사역자를 세우는 교회,
              <br className="hidden md:block" />
              오산교회에 오신 것을 환영합니다!
            </p>

            <div
              className="h-px w-16 md:w-20 bg-brand-primary"
              aria-hidden="true"
            />

            <p className="text-sm md:text-[1.1rem] leading-relaxed md:leading-[1.75] text-slate-800">
              당신은 사랑받기 위해 태어난 소중한 사람입니다.
              <br className="hidden md:block" />
              하나님과 함께하는 행복한 믿음의 여정, 오산교회가 함께하겠습니다.
            </p>
          </div>
        </div>
      </article>

      <article className="p-1 md:p-2 space-y-8">
        <section className="space-y-3">
          <div className="h-1 w-7 bg-brand-primary" aria-hidden="true" />
          <h3 className="text-xl md:text-2xl font-bold text-brand-dark">
            등록 안내
          </h3>
          <p className="text-base md:text-lg font-semibold text-brand-dark">
            오산교회 새가족 안내
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            오산교회에 처음 나오신 분들을 주의 이름으로 환영합니다. 아래 절차에
            따라 등록해 주시기 바랍니다.
          </p>
        </section>

        <section className="space-y-5">
          <div className="h-1 w-7 bg-brand-primary" aria-hidden="true" />
          <h3 className="text-xl md:text-2xl font-bold text-brand-dark">
            등록 절차
          </h3>

          <div className="bg-slate-50 border border-slate-200 p-4 md:p-6">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-3 px-2 lg:px-4 overflow-visible">
              {REGISTRATION_FLOW.map((item, index) => (
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

                    {index < REGISTRATION_FLOW.length - 1 ? (
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
            {REGISTRATION_FLOW.map((item) => (
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
            <p>
              <span className="font-semibold text-brand-dark">일시:</span>{" "}
              매주일 2부, 3부 예배 후(10:35~, 12:35~ / 20분 소요)
            </p>
            <p>
              <span className="font-semibold text-brand-dark">장소:</span> 1층
              새가족실(102호)
            </p>
            <p>
              <span className="font-semibold text-brand-dark">대상:</span>{" "}
              오산교회 등록하신 모든 분들은 직분과 상관없이 들으시게 되어
              있습니다.
            </p>
            <p className="pl-0 md:pl-14 text-gray-600">
              1과~4과로 되어 있으며 매달 같은 내용이 반복되어 결석한 주는 다음
              달 그 주에 들으시면 수료하실 수 있습니다.
            </p>
          </div>

          <div className="space-y-2 text-sm md:text-base text-gray-700">
            <p className="font-semibold text-brand-dark">내용</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-sm font-bold">
                  1
                </span>
                <span>나는 누구인가?</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-sm font-bold">
                  2
                </span>
                <span>하나님은 어떤 분이신가?</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-sm font-bold">
                  3
                </span>
                <span>예수님은 누구신가?</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-sm font-bold">
                  4
                </span>
                <span>어떻게 구원받을 수 있는가?</span>
              </li>
            </ul>
          </div>
        </section>
      </article>
    </section>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type IntroPoint = {
  title: string;
  description: string;
};

type ProgramLink = {
  title: string;
  path: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

type RegistrationStep = {
  step: string;
  title: string;
  description: string;
};

const INTRO_POINTS: IntroPoint[] = [
  {
    title: "말씀과 예배 중심",
    description:
      "주일예배와 설교를 중심으로 신앙의 방향을 세우고, 주중에도 예배 리듬을 이어갑니다.",
  },
  {
    title: "공동체와 관계 중심",
    description:
      "셀과 소그룹, 섬김 공동체를 통해 단순한 출석이 아니라 실제 연결이 일어나도록 돕습니다.",
  },
  {
    title: "세대가 함께 자라는 교회",
    description:
      "어린이와 청년, 장년이 각자의 자리에서 신앙을 배우고 함께 자라는 구조를 갖고 있습니다.",
  },
  {
    title: "기초부터 차근히 안내",
    description:
      "처음 온 분이 예배, 위치, 등록, 사역 순서로 부담 없이 이해할 수 있도록 안내합니다.",
  },
];

const PROGRAM_LINKS: ProgramLink[] = [
  {
    title: "교회소개",
    path: "/about/pastor",
    description:
      "담임목사, 비전, 연혁, 오시는 길을 통해 교회의 기본 정보를 봅니다.",
    image: "/img/official/training/course/course_01.jpg",
    imageAlt: "교회 소개를 상징하는 따뜻한 배경 이미지",
  },
  {
    title: "예배",
    path: "/worship/time",
    description: "예배 시간, 실황, 설교를 통해 예배의 흐름을 확인합니다.",
    image: "/img/official/nextgen/youth/youth_01.png",
    imageAlt: "예배 분위기를 보여주는 공동체 이미지",
  },
  {
    title: "양육과 사역",
    path: "/training/course",
    description:
      "셀, 양육과정, 섬김, 선교를 통해 교회의 운영 구조를 이해합니다.",
    image: "/img/official/training/servicegroup/servicegroup_01.png",
    imageAlt: "섬김과 양육의 장면을 담은 이미지",
  },
  {
    title: "다음세대",
    path: "/nextgen/school",
    description: "주일학교와 청년부를 통해 다음세대 사역을 살펴봅니다.",
    image: "/img/official/nextgen/school/school_01.png",
    imageAlt: "다음세대를 상징하는 주일학교 이미지",
  },
  {
    title: "교회 소식",
    path: "/news/notice",
    description:
      "공지, 주보, 앨범, 선교 소식으로 교회 운영과 일정을 확인합니다.",
    image: "/img/official/training/outreach/worldMap.jpg",
    imageAlt: "교회 소식과 선교를 상징하는 지도 이미지",
  },
  {
    title: "오시는 길",
    path: "/about/location",
    description: "예배당 위치와 방문 동선을 미리 확인합니다.",
    image: "/img/official/training/course/course_03.jpg",
    imageAlt: "방문 동선을 떠올리게 하는 안내 이미지",
  },
];

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    step: "01",
    title: "예배 참여",
    description:
      "먼저 주일예배에 참석해 교회의 분위기와 예배 흐름을 자연스럽게 살펴봅니다.",
  },
  {
    step: "02",
    title: "안내 확인",
    description:
      "안내 데스크나 담당자를 통해 교회 소개와 필요한 정보를 간단히 안내받습니다.",
  },
  {
    step: "03",
    title: "등록 정보 작성",
    description:
      "이름, 연락처, 방문 목적, 기도제목 등을 남겨 새가족 등록을 진행합니다.",
  },
  {
    step: "04",
    title: "정착 연결",
    description:
      "예배, 소그룹, 다음세대, 사역 안내를 연결받으며 교회 생활을 시작합니다.",
  },
];

function SectionPanel({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: ReactNode;
}>) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      setTitleWidth(titleRef.current?.offsetWidth ?? 0);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [title]);

  return (
    <section className="border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
      <div className="space-y-3">
        <h2
          ref={titleRef}
          className="inline-block text-xl md:text-2xl font-bold text-brand-dark"
        >
          {title}
        </h2>
        <div
          className="h-1 bg-brand-primary"
          style={{ width: titleWidth }}
          aria-hidden="true"
        />
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

export default function NextstepsPage() {
  return (
    <section className="space-y-5">
      <article className="border border-slate-200 bg-white shadow-panel overflow-hidden">
        <header className="p-6 md:p-7 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
            <div className="space-y-6">
              <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
                  새가족 안내
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  처음 오신 분이 이 교회가 어떤 공동체인지 차분히 읽고, 예배와
                  사역을 이해한 뒤 마지막에 등록까지 이어질 수 있도록 구성한
                  안내 페이지입니다.
                </p>
              </div>

              <section className="border border-slate-200 bg-slate-50 p-5 md:p-6">
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  이 페이지는 홍보 문구보다 실제 정보에 집중합니다. 교회의 방향,
                  예배와 설교, 운영 프로그램, 다음세대, 교회 소식, 방문 동선을
                  차례로 확인한 뒤 새가족 등록 절차로 연결됩니다.
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INTRO_POINTS.map((point) => (
                  <div
                    key={point.title}
                    className="border border-slate-200 bg-white p-4 md:p-5"
                  >
                    <h3 className="text-base font-bold text-brand-dark">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                ))}
              </section>
            </div>

            <div className="space-y-4">
              <figure className="border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[16/11] w-full bg-slate-100 overflow-hidden">
                  <img
                    src="/img/official/nextgen/school/school_01.png"
                    alt="새가족 안내를 상징하는 교회 공동체 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs text-slate-500 border-t border-slate-200">
                  처음 방문한 분에게는 교회의 분위기와 사람들의 결이 가장 먼저
                  보입니다.
                </figcaption>
              </figure>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <figure className="border border-slate-200 bg-white overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <img
                      src="/img/official/nextgen/youth/youth_01.png"
                      alt="예배와 교제를 떠올리게 하는 다음세대 이미지"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </figure>

                <div className="border border-slate-200 bg-slate-950 text-white p-5 md:p-6 min-h-[220px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.35),transparent_45%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:18px_18px] opacity-50" />
                  <div className="relative z-10 h-full flex flex-col justify-between gap-6">
                    <div>
                      <p className="text-[11px] tracking-[0.32em] text-white/70 font-semibold">
                        WELCOME
                      </p>
                      <h3 className="mt-3 text-lg font-bold leading-snug">
                        이미지와 안내가 함께 있는 첫 화면
                      </h3>
                      <p className="mt-3 text-sm text-white/80 leading-relaxed">
                        사진 한 장으로 분위기를 보여주고, 색과 질감으로는 이
                        교회의 온도와 리듬을 전달합니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                      <div className="border border-white/20 px-3 py-2">
                        예배
                      </div>
                      <div className="border border-white/20 px-3 py-2">
                        양육
                      </div>
                      <div className="border border-white/20 px-3 py-2">
                        다음세대
                      </div>
                      <div className="border border-white/20 px-3 py-2">
                        등록
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </article>

      <SectionPanel
        title="교회는 어떤 곳인가요"
        description="이 교회가 어떤 방향으로 예배하고, 어떤 공동체를 지향하는지 먼저 보여줍니다."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-4">
          <figure className="border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-[16/12] bg-slate-100 overflow-hidden">
              <img
                src="/img/official/training/course/course_01.jpg"
                alt="교회의 기초를 보여주는 따뜻한 장면"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-xs text-slate-500 border-t border-slate-200">
              처음 온 분은 교회의 구조보다 먼저 분위기와 결을 느끼게 됩니다.
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 gap-4">
            <div className="border border-slate-200 bg-slate-50 p-5 space-y-3">
              <h3 className="text-base font-bold text-brand-dark">
                교회가 지향하는 방향
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                말씀을 중심에 두고 예배와 삶이 분리되지 않도록 돕는 교회입니다.
                처음 오신 분도 부담 없이 예배에 참여하고, 공동체와 연결될 수
                있도록 안내합니다.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-base font-bold text-brand-dark">
                조직과 운영
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                교회는 교회소개, 예배, 양육과 사역, 다음세대, 소식과 안내로
                나뉘어 운영됩니다. 각 메뉴는 교회의 기본 구조를 이해하는 길잡이
                역할을 합니다.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="border border-slate-200 bg-slate-50 p-3">
                  교회소개
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  예배
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  양육과 사역
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  다음세대
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel
        title="예배와 설교는 어떻습니까"
        description="예배의 방향과 설교의 성격을 미리 알면 처음 방문할 때 훨씬 편합니다."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-4 items-start">
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-slate-200 bg-white p-5 space-y-3">
              <h3 className="text-base font-bold text-brand-dark">예배 흐름</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                  <span>
                    주일예배를 중심으로 주중 예배와 기도 모임이 이어집니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                  <span>
                    현장 예배와 실황 안내를 함께 제공해 방문 상황에 맞게 참여할
                    수 있습니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                  <span>
                    예배 시간은 정기적으로 확인할 수 있도록 정리되어 있습니다.
                  </span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-5 space-y-3">
              <h3 className="text-base font-bold text-brand-dark">설교 방향</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                설교는 신앙의 기초를 다시 세우고, 삶의 자리에서 말씀을
                적용하도록 돕는 방향으로 운영됩니다. 최근 설교와 예배 관련
                정보는 별도 메뉴에서 확인할 수 있습니다.
              </p>
            </div>
          </div>

          <figure className="border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-[4/5] bg-slate-100 overflow-hidden">
              <img
                src="/img/official/nextgen/youth/youth_01.png"
                alt="예배와 교제를 표현하는 공동체 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-xs text-slate-500 border-t border-slate-200">
              예배는 내용만이 아니라 함께 앉는 자리와 분위기까지 기억에
              남습니다.
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            to="/worship/time"
            className="inline-flex items-center rounded-none border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
          >
            예배 시간 보기
          </Link>
          <Link
            to="/worship/sermons"
            className="inline-flex items-center rounded-none bg-brand-primary px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[#4e5caf] transition-colors"
          >
            <span className="text-white" style={{ color: "#fff" }}>
              최근 설교 보기
            </span>
          </Link>
        </div>
      </SectionPanel>

      <SectionPanel
        title="어떤 프로그램을 운영하나요"
        description="처음 온 분이 교회의 실제 움직임을 이해할 수 있도록 주요 프로그램을 모았습니다."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROGRAM_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="border border-slate-200 bg-slate-50 hover:border-brand-primary/40 hover:bg-white transition-colors overflow-hidden"
            >
              <div className="aspect-[16/9] bg-slate-100 overflow-hidden border-b border-slate-200">
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-brand-dark">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                <span className="inline-flex text-sm font-semibold text-brand-primary">
                  자세히 보기
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        title="새가족 등록 절차"
        description="페이지의 마지막은 등록 과정입니다. 읽고 난 뒤 바로 다음 행동으로 이어지도록 구성했습니다."
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {REGISTRATION_STEPS.map((step) => (
            <article
              key={step.step}
              className="border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="w-12 h-12 bg-brand-primary text-white flex items-center justify-center font-bold">
                {step.step}
              </div>
              <h3 className="text-sm font-bold text-brand-dark">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-200 bg-slate-50 p-5 space-y-3">
            <h3 className="text-base font-bold text-brand-dark">
              등록 전 확인할 것
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                <span>예배 시간과 위치를 먼저 확인합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                <span>등록 시 이름, 연락처, 방문 목적을 간단히 남깁니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                <span>
                  필요하면 다음세대 또는 사역 안내도 함께 요청할 수 있습니다.
                </span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-base font-bold text-brand-dark">
              등록 후 연결
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              등록이 끝나면 새가족부와 담당 사역자가 예배, 소그룹, 프로그램을
              안내합니다. 처음 온 분이 혼자 헤매지 않도록 다음 연결까지 함께
              도와드립니다.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-2 flex-wrap gap-3">
          <Link
            to="/about/location"
            className="inline-flex items-center rounded-none border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
          >
            교회 위치 보기
          </Link>
          <Link
            to="/worship/time"
            className="inline-flex items-center rounded-none bg-brand-primary px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[#4e5caf] transition-colors"
            style={{ color: "#fff", WebkitTextFillColor: "#fff" }}
          >
            <span className="text-white" style={{ color: "#fff" }}>
              예배 먼저 보기
            </span>
          </Link>
        </div>
      </SectionPanel>
    </section>
  );
}

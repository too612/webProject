import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";

export default function SchoolPromoPage() {
  return (
    <section className="space-y-0">
      <article className="border border-slate-200 bg-white shadow-panel overflow-hidden">
        <header className="p-6 md:p-7 space-y-6">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              주일학교
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              한 아이의 오늘이 하나님 안에서 안전하고 기쁘게 자라가도록, 예배와
              관계와 습관을 함께 세웁니다.
            </p>
          </div>

          <figure className="space-y-3">
            <div className="aspect-[16/6] w-full border border-slate-200 bg-slate-100 overflow-hidden">
              <img
                src="/img/official/nextgen/school/school_01.png"
                alt="주일학교 메인 이미지"
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
                  <li className="py-3 flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">11:00</span>
                    <strong className="text-brand-dark text-right">
                      함께 예배
                    </strong>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">11:30</span>
                    <strong className="text-brand-dark text-right">
                      학년별 소그룹 나눔
                    </strong>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">12:00</span>
                    <strong className="text-brand-dark text-right">
                      말씀 연계 활동
                    </strong>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">12:30</span>
                    <strong className="text-brand-dark text-right">
                      귀가 및 가정 연계 안내
                    </strong>
                  </li>
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
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                    <p>
                      <strong className="text-brand-dark">저학년</strong>: 예배
                      기초와 즐거운 참여 습관
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                    <p>
                      <strong className="text-brand-dark">중학년</strong>: 말씀
                      이해와 질문 중심 나눔
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 bg-brand-primary shrink-0" />
                    <p>
                      <strong className="text-brand-dark">고학년</strong>: 실천
                      과제와 또래 리더십 훈련
                    </p>
                  </li>
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
                  서로 사랑하라
                </p>
                <ul
                  className="mt-4 text-sm text-gray-600 divide-y divide-slate-200 border-t border-slate-200"
                  aria-label="이번 달 주제 세부 항목"
                >
                  <li className="py-2.5 flex items-start gap-3">
                    <span className="font-semibold text-slate-500 min-w-9">
                      1주
                    </span>
                    <span>배려하는 말</span>
                  </li>
                  <li className="py-2.5 flex items-start gap-3">
                    <span className="font-semibold text-slate-500 min-w-9">
                      2주
                    </span>
                    <span>먼저 돕는 손</span>
                  </li>
                  <li className="py-2.5 flex items-start gap-3">
                    <span className="font-semibold text-slate-500 min-w-9">
                      3주
                    </span>
                    <span>용서와 화해</span>
                  </li>
                  <li className="py-2.5 flex items-start gap-3">
                    <span className="font-semibold text-slate-500 min-w-9">
                      4주
                    </span>
                    <span>감사 나눔 실천</span>
                  </li>
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
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-500 min-w-4 text-right">
                      1.
                    </span>
                    <p>현장 등록 데스크에서 학년과 기본 정보를 확인합니다.</p>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-500 min-w-4 text-right">
                      2.
                    </span>
                    <p>담당 교사가 예배실과 반 배정을 안내합니다.</p>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-500 min-w-4 text-right">
                      3.
                    </span>
                    <p>당일 예배와 활동에 바로 참여할 수 있습니다.</p>
                  </li>
                </ol>
                <p className="text-xs text-slate-500">
                  문의: 주일학교 안내 데스크
                </p>
              </div>
            </section>
          </section>
        </header>

        <footer className="p-6 md:p-7 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-brand-dark">활동 갤러리</h3>
            <Link
              to="/nextgen/school/write"
              className="inline-flex items-center bg-brand-primary !text-white px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
            >
              글 등록
            </Link>
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

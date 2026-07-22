import { useEffect, useMemo, useState } from "react";
import { useServiceGroupContent } from "./serviceGroupHook";
import { DEFAULT_SERVICE_GROUP_CONTENT } from "./serviceGroupModel";

const IMAGE_FALLBACK_BY_DEPT_CODE: Record<string, string> = {
  D000003: "/img/official/training/servicegroup/servicegroup_01.png",
  D000004: "/img/official/training/servicegroup/servicegroup_02.png",
  D000005: "/img/official/training/servicegroup/servicegroup_03.png",
  D000006: "/img/official/training/servicegroup/servicegroup_04.png",
  D000007: "/img/official/training/servicegroup/servicegroup_05.png",
  D000008: "/img/official/training/servicegroup/servicegroup_06.png",
};

type DepartmentActivityInfo = {
  overview: string;
  mainMinistry: string;
  serviceTime: string;
  majorActivityDescription: string;
  majorActivityMinistry: string;
  majorActivityTime: string;
};

const DEPARTMENT_ACTIVITY_BY_DEPT_CODE: Record<string, DepartmentActivityInfo> =
  {
    D000003: {
      overview:
        "교회 재정의 수입과 지출을 투명하게 관리하고 예배 및 사역 운영이 안정적으로 이어지도록 지원합니다.",
      mainMinistry: "헌금 집계, 회계 정산, 월별 결산 보고, 예산 집행 관리",
      serviceTime: "주일 예배 전후 및 주중 결산 시간",
      majorActivityDescription:
        "부서별 지출 요청을 검토하고 집행 내역을 정리하여 다음 사역 계획에 반영합니다.",
      majorActivityMinistry: "지출 증빙 확인, 결산 리포트 작성, 부서 예산 협의",
      majorActivityTime: "매주 주중 저녁, 월말 집중 결산",
    },
    D000004: {
      overview:
        "복음 전파와 새가족 연결을 중심으로 전도 접점을 넓히고 공동체 유입을 돕습니다.",
      mainMinistry: "노방 전도, 초청 주일 운영, 전도 대상자 관리",
      serviceTime: "주중 전도 일정 및 주일 초청 연계 시간",
      majorActivityDescription:
        "지역별 전도 동선을 계획하고 전도 후속 연락을 통해 예배 참여까지 연결합니다.",
      majorActivityMinistry: "전도 물품 준비, 전도팀 배치, 후속 케어",
      majorActivityTime: "토요일 오전/오후, 주일 전후 후속 관리",
    },
    D000005: {
      overview:
        "예배와 행사에 필요한 차량 운행을 체계화하여 성도 이동 편의와 안전을 확보합니다.",
      mainMinistry: "셔틀 노선 운영, 행사 차량 배차, 운행 안전 점검",
      serviceTime: "주일 예배 전후 집중 운행, 행사일 수시 운행",
      majorActivityDescription:
        "운행 수요를 반영해 노선과 시간을 조정하고 봉사자 배치표를 운영합니다.",
      majorActivityMinistry: "노선표 업데이트, 배차 확정, 운행일지 정리",
      majorActivityTime: "주중 준비, 주일 새벽~오후 집중",
    },
    D000006: {
      overview:
        "예배와 각종 교회 행사의 현장 운영을 돕고 봉사 인력을 효율적으로 배치합니다.",
      mainMinistry: "행사 동선 관리, 봉사자 스케줄링, 현장 안내",
      serviceTime: "주일 예배 및 행사 당일 운영 시간",
      majorActivityDescription:
        "행사 규모에 맞춰 안내, 정리, 지원 인력을 구성하고 현장 상황에 즉시 대응합니다.",
      majorActivityMinistry: "안내 데스크 운영, 좌석/동선 지원, 사후 정리",
      majorActivityTime: "행사 시작 1시간 전부터 종료 후 정리까지",
    },
    D000007: {
      overview:
        "새가족이 교회 공동체에 자연스럽게 정착하도록 안내와 돌봄 프로세스를 운영합니다.",
      mainMinistry: "새가족 등록 안내, 첫 방문 케어, 정착 소그룹 연결",
      serviceTime: "주일 예배 전후 및 새가족 모임 시간",
      majorActivityDescription:
        "등록 이후 일정 기간 동안 관계 형성과 참여 안내를 통해 이탈을 줄이고 정착을 돕습니다.",
      majorActivityMinistry: "초기 상담, 부서 연결, 정착 피드백 관리",
      majorActivityTime: "주일 상시 응대, 주중 후속 연락",
    },
    D000008: {
      overview:
        "예배 찬양과 워십 문화를 준비하여 예배의 흐름과 공동체 고백을 음악으로 섬깁니다.",
      mainMinistry: "찬양 선곡, 연습 운영, 예배 워십 리딩",
      serviceTime: "주중 정기 연습 및 주일 예배 리허설/본예배",
      majorActivityDescription:
        "예배 주제에 맞는 곡을 구성하고 팀 연습을 통해 예배 집중도를 높이는 찬양을 준비합니다.",
      majorActivityMinistry: "주간 선곡 회의, 파트 연습, 예배 리허설",
      majorActivityTime: "주중 저녁 연습, 주일 예배 전 리허설",
    },
  };

export default function ServiceGroupPage() {
  const { serviceGroupContent, loading, error, loadServiceGroupContent } =
    useServiceGroupContent();
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | null>(null);

  useEffect(() => {
    loadServiceGroupContent();
  }, [loadServiceGroupContent]);

  const content = serviceGroupContent
    ? { ...DEFAULT_SERVICE_GROUP_CONTENT, ...serviceGroupContent }
    : DEFAULT_SERVICE_GROUP_CONTENT;
  const selectedGroup = useMemo(
    () =>
      content.groups.find((group) => group.deptCode === selectedDeptCode) ??
      null,
    [content.groups, selectedDeptCode],
  );

  useEffect(() => {
    if (
      selectedDeptCode &&
      !content.groups.some((group) => group.deptCode === selectedDeptCode)
    ) {
      setSelectedDeptCode(null);
    }
  }, [content.groups, selectedDeptCode]);

  const renderGroupImage = (
    group: (typeof content.groups)[number],
    sizeClass: string,
    titleClass: string,
    imageClass = "",
  ) => {
    const fallbackImageUrl = group.deptCode
      ? IMAGE_FALLBACK_BY_DEPT_CODE[group.deptCode]
      : undefined;
    const imageUrl = group.imageUrl || fallbackImageUrl;

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={group.title}
          className={`${sizeClass} object-cover ${imageClass}`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] border-b border-slate-200 flex items-end`}
      >
        <div className="w-full bg-white/80 px-4 py-3 backdrop-blur-sm border-t border-slate-200">
          <div className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Image Ready
          </div>
          <div className={`${titleClass} mt-1`}>{group.title}</div>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            {content.headline}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {content.summary}
          </p>
        </div>

        {loading && (
          <div className="text-sm text-slate-500 py-4 text-center">
            불러오는 중입니다.
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {!selectedGroup && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {content.groups.map((group) => {
                    const leaderName =
                      group.leaderName ??
                      group.pastorName ??
                      group.elderName ??
                      "-";

                    return (
                      <div
                        key={group.deptCode ?? group.title}
                        className="text-left border border-slate-200 bg-white"
                      >
                        <div className="aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100">
                          {renderGroupImage(
                            group,
                            "w-full h-full",
                            "text-base font-bold text-brand-dark",
                          )}
                        </div>
                        <div className="space-y-3 px-5 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-lg font-bold text-brand-dark">
                                {group.title}
                              </h3>
                              <div className="text-xs text-slate-500">
                                {group.members.length}명
                              </div>
                            </div>
                            <p
                              className="text-sm text-gray-600 leading-6 h-12 overflow-hidden"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {group.description}
                            </p>
                          </div>
                          <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-3 text-sm">
                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                부서장
                              </div>
                              <div className="mt-1 font-semibold text-slate-800">
                                {leaderName}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDeptCode(group.deptCode ?? null);
                              }}
                              className="inline-flex items-center text-brand-primary font-semibold cursor-pointer hover:underline"
                            >
                              상세보기 -&gt;
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedGroup && (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDeptCode(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <span className="material-icons text-[18px] text-brand-primary">
                    arrow_back
                  </span>
                  <span>돌아가기</span>
                </button>

                {(() => {
                  const activityInfo =
                    DEPARTMENT_ACTIVITY_BY_DEPT_CODE[
                      selectedGroup.deptCode ?? ""
                    ];

                  return (
                    <div className="space-y-5">
                      <div className="border border-slate-200 bg-white">
                        <div className="bg-slate-100 border-b border-slate-200">
                          <div className="h-[280px] md:h-[340px] overflow-hidden">
                            {renderGroupImage(
                              selectedGroup,
                              "w-full h-full",
                              "text-xl font-bold text-brand-dark",
                              "object-top",
                            )}
                          </div>
                        </div>
                        <div className="pl-3 pr-5 py-5 md:pl-4 md:pr-6 md:py-6 space-y-2">
                          <div className="inline-flex items-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">
                              {selectedGroup.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedGroup.description}
                          </p>
                        </div>
                      </div>

                      <div className="border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 pl-3 pr-5 py-4 md:pl-4 md:pr-6">
                          <h4 className="mt-1 text-lg font-bold text-brand-dark">
                            {selectedGroup.title} 구성
                          </h4>
                        </div>
                        <div className="p-0">
                          <div className="border border-slate-200">
                            <div className="grid grid-cols-[120px_minmax(0,1fr)] border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                              <span className="text-center">이름</span>
                              <span className="text-center">역할</span>
                            </div>
                            {selectedGroup.members.map((member, index) => (
                              <div
                                key={`${member.name}-${member.role}`}
                                className={`grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 px-4 py-3 text-sm ${index > 0 ? "border-t border-slate-200" : ""}`}
                              >
                                <span className="text-center font-semibold text-brand-dark">
                                  {member.name}
                                </span>
                                <span className="text-center text-slate-700">
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden">
                        <div className="pl-0 pr-0 py-0 space-y-5">
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              <span>주요사역</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {activityInfo?.mainMinistry ?? "준비 중"}
                            </p>
                            <div className="text-sm text-slate-600">
                              사역시간: {activityInfo?.serviceTime ?? "준비 중"}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
                              <span>부서주요활동</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {activityInfo?.majorActivityDescription ??
                                "주요 활동 내용을 준비 중입니다."}
                            </p>
                            <div className="text-sm text-slate-600 leading-relaxed">
                              주요사역:{" "}
                              {activityInfo?.majorActivityMinistry ?? "준비 중"}
                            </div>
                            <div className="text-sm text-slate-600">
                              사역시간:{" "}
                              {activityInfo?.majorActivityTime ?? "준비 중"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

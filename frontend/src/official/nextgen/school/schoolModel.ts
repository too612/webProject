export type SchoolScheduleItem = {
  time: string;
  title: string;
};

export type SchoolClassIntro = {
  grade: string;
  description: string;
};

export type SchoolMonthlyTheme = {
  subtitle: string;
  items: { week: string; title: string }[];
};

export type SchoolPageContent = {
  headline: string;
  summary: string;
  mainImageUrl: string;
  mainImageAlt: string;
  schedule: SchoolScheduleItem[];
  classes: SchoolClassIntro[];
  monthlyTheme: SchoolMonthlyTheme;
  visitGuide: string[];
  visitGuideNotice: string;
};

export const DEFAULT_SCHOOL_PAGE_CONTENT: SchoolPageContent = {
  headline: "주일학교 비전",
  summary:
    "한 아이의 오늘이 하나님 안에서 안전하고 기쁘게 자라가도록, 예배와 관계와 습관을 함께 세웁니다.",
  mainImageUrl: "/img/official/nextgen/school/school_01.png",
  mainImageAlt: "주일학교 메인 이미지",
  schedule: [
    { time: "11:00", title: "함께 예배" },
    { time: "11:30", title: "학년별 소그룹 나눔" },
    { time: "12:00", title: "말씀 연계 활동" },
    { time: "12:30", title: "귀가 및 가정 연계 안내" },
  ],
  classes: [
    { grade: "저학년", description: "예배 기초와 즐거운 참여 습관" },
    { grade: "중학년", description: "말씀 이해와 질문 중심 나눔" },
    { grade: "고학년", description: "실천 과제와 또래 리더십 훈련" },
  ],
  monthlyTheme: {
    subtitle: "서로 사랑하라",
    items: [
      { week: "1주", title: "배려하는 말" },
      { week: "2주", title: "먼저 돕는 손" },
      { week: "3주", title: "용서와 화해" },
      { week: "4주", title: "감사 나눔 실천" },
    ],
  },
  visitGuide: [
    "현장 등록 데스크에서 학년과 기본 정보를 확인합니다.",
    "담당 교사가 예배실과 반 배정을 안내합니다.",
    "당일 예배와 활동에 바로 참여할 수 있습니다.",
  ],
  visitGuideNotice: "문의: 주일학교 안내 데스크",
};

export type GuidelineSectionType = {
  icon: "scroll" | "target" | "sparkles";
  label: string[];
  kind: "verse" | "list";
  verse?: { text: string; reference: string };
  items?: string[];
};

export type SchoolPageContent = {
  headline: string;
  summary: string;
  departmentName: string;
  sns: { instagram: string; youtube: string };
  motto: { label: string; text: string };
  guidelines: {
    title: string;
    sections: GuidelineSectionType[];
  };
  worship: {
    cards: { label: string; value: string }[];
  };
  servingTeam: {
    rows: { role: string; members: string }[];
  };
};

export const DEFAULT_SCHOOL_PAGE_CONTENT: SchoolPageContent = {
  headline: "주일학교",
  summary:
    "한 아이의 오늘이 하나님 안에서 안전하고 기쁘게 자라가도록, 예배와 관계와 습관을 함께 세웁니다.",
  departmentName: "주일학교",
  sns: { instagram: "#", youtube: "#" },
  motto: { label: "표어", text: "나의 삶은 참으로 복되다" },
  guidelines: {
    title: "2026년 주일학교 교육지침",
    sections: [
      {
        icon: "scroll",
        label: ["주제", "말씀"],
        kind: "verse",
        verse: {
          text: "이스라엘이여 너는 행복한 사람이로다 여호와의 구원을 너같이 얻은 백성이 누구냐 그는 너를 돕는 방패시요 네 영광의 칼이시로다 네 대적이 네게 복종하리니 네가 그들의 높은 곳을 밟으리로다",
          reference: "신명기 33:29",
        },
      },
      {
        icon: "target",
        label: ["교육", "목표"],
        kind: "list",
        items: [
          "예수님의 복된 삶을 배우자!",
          "예수님의 몸 된 교회를 섬기자!",
          "예수님의 이름을 가진 자로 복된 삶을 전하자!",
        ],
      },
      {
        icon: "sparkles",
        label: ["중점", "사역"],
        kind: "list",
        items: [
          "예배: 입술의 고백으로 찬양하고 기도하는 예배",
          "찬양: 소년부 아이들과 함께 세워가는 엘림워십 찬양팀",
          "말씀: 암송과 필사로 마음에 새기는 하나님의 말씀",
          "실천: 노방전도로 세상에 선포하는 복음",
        ],
      },
    ],
  },
  worship: {
    cards: [
      { label: "예배 시간", value: "주일 오전 9시" },
      { label: "예배 장소", value: "지하 1층 아브라함\n소년부실" },
      { label: "대상", value: "12-13세 (초 5-6)" },
    ],
  },
  servingTeam: {
    rows: [
      { role: "담당교역자", members: "조성진 전도사" },
      { role: "팀장", members: "정현호 집사" },
      { role: "부팀장", members: "서규태 안수집사" },
      {
        role: "교사",
        members:
          "강규연 강유진 강윤정 구새름 김유경 김준수 문성희 박근영 박준영 박지혜 변민석 사공은 신향 신수정 심보경 안선애 오형석 우승아 이서엘 이지민 임현규 전희은 정명선 정시내 최다은 최창희 최현옥",
      },
    ],
  },
};

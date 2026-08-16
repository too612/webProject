export type GuidelineSectionType = {
  icon: "scroll" | "target" | "sparkles";
  label: string[];
  kind: "verse" | "list";
  verse?: { text: string; reference: string };
  items?: string[];
};

export type YouthPageContent = {
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

export const DEFAULT_YOUTH_CONTENT: YouthPageContent = {
  headline: "중고등부/청년부",
  summary:
    "중고등부와 청년부가 말씀 안에서 정체성을 세우고, 일상 속에서 복음을 살아내는 다음세대로 자라가도록 함께합니다.",
  departmentName: "중고등부/청년부",
  sns: { instagram: "#", youtube: "#" },
  motto: { label: "표어", text: "너희는 세상의 빛이라" },
  guidelines: {
    title: "2026년 중고등부/청년부 교육지침",
    sections: [
      {
        icon: "scroll",
        label: ["주제", "말씀"],
        kind: "verse",
        verse: {
          text: "너는 청년의 때에 너의 창조주를 기억하라 이는 곧 곤고한 날이 이르기 전에, 해와 빛과 달과 별들이 어둡기 전에니라",
          reference: "전도서 12:1",
        },
      },
      {
        icon: "target",
        label: ["교육", "목표"],
        kind: "list",
        items: [
          "말씀 안에서 정체성을 세우자!",
          "일상에서 복음을 살아내자!",
          "다음 세대의 리더로 자라가자!",
        ],
      },
      {
        icon: "sparkles",
        label: ["중점", "사역"],
        kind: "list",
        items: [
          "예배: 함께 모여 찬양하고 기도하는 예배",
          "찬양: 청년들과 함께 세워가는 찬양팀",
          "말씀: 큐티와 필사로 마음에 새기는 말씀",
          "실천: 학교와 일상에서 선포하는 복음",
        ],
      },
    ],
  },
  worship: {
    cards: [
      {
        label: "예배 시간",
        value: "주일 오전 11시 (중고등부)\n주일 오후 2시 (청년부)",
      },
      { label: "예배 장소", value: "본당 3층 중고등부실\n본당 지하 청년부실" },
      { label: "대상", value: "중1-고3 (중고등부)\n20-30대 (청년부)" },
    ],
  },
  servingTeam: {
    rows: [
      { role: "담당교역자", members: "김지훈 전도사" },
      { role: "팀장", members: "이은채 집사" },
      { role: "부팀장", members: "박성준 집사" },
      {
        role: "교사",
        members: "김하늘 강민준 박서연 이도윤 최유나 정우진 조은비 문지호",
      },
    ],
  },
};

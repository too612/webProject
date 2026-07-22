export type ProcessStep = {
  step: number;
  title: string;
  subtitle: string;
  imageUrl?: string;
  purpose: string;
  target: string;
  duration: string;
  coreValue: string;
  color: string;
};

export type CourseContent = {
  headline: string;
  summary: string;
  steps: ProcessStep[];
};

export const DEFAULT_COURSE_CONTENT: CourseContent = {
  headline: "세계비전두날개프로세스",
  summary:
    "건강한 성도, 건강한 교회를 세우기 위한 탁월한 양육 여정입니다. 회복과 훈련을 거쳐 셀리더·셀교사로 세워져 제자 재생산을 이루는 것이 목표입니다.",
  steps: [
    {
      step: 1,
      title: "회복캠프",
      subtitle: "Recovery Camp",
      imageUrl: "/img/official/training/course/course_01.jpg",
      purpose:
        "복음의 본질을 다시 붙잡고 내면 회복을 통해 신앙의 출발점을 정비합니다.",
      target: "새가족 및 신앙 재정비가 필요한 성도",
      duration: "집중 캠프 과정",
      coreValue: "복음의 절대 능력",
      color: "#0f766e",
    },
    {
      step: 2,
      title: "리더캠프",
      subtitle: "Leader Camp",
      imageUrl: "/img/official/training/course/course_02.jpg",
      purpose:
        "섬김의 리더십과 공동체 책임감을 훈련하여 다음 단계를 준비합니다.",
      target: "회복캠프 수료자",
      duration: "집중 캠프 과정",
      coreValue: "섬김과 헌신",
      color: "#0369a1",
    },
    {
      step: 3,
      title: "양육반",
      subtitle: "Nurturing Class",
      imageUrl: "/img/official/training/course/course_03.jpg",
      purpose:
        "성경적 가치관과 신앙 기초를 체계적으로 세우는 양육 과정을 진행합니다.",
      target: "리더캠프 수료자",
      duration: "정기 반별 과정",
      coreValue: "가치관 변화",
      color: "#7c3aed",
    },
    {
      step: 4,
      title: "제자학교",
      subtitle: "Discipleship School",
      imageUrl: "/img/official/training/course/course_04.jpg",
      purpose:
        "훈련된 제자로서 말씀, 전도, 섬김을 삶 속에서 실천하는 역량을 강화합니다.",
      target: "양육반 수료자",
      duration: "학기형 제자훈련 과정",
      coreValue: "제자화 실천",
      color: "#be185d",
    },
    {
      step: 5,
      title: "세계비전제자대학",
      subtitle: "World Vision Disciple College",
      imageUrl: "/img/official/training/course/course_05.jpg",
      purpose:
        "행복모임리더, 셀리더·셀교사로 세워져 제자 재생산과 세계 비전을 확장합니다.",
      target: "제자학교 수료자 및 차세대 사역 리더",
      duration: "심화 리더십 과정",
      coreValue: "세계 비전과 재생산",
      color: "#b45309",
    },
  ],
};

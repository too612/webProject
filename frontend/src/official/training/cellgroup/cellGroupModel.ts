export type CellMember = {
  name: string;
  role: string;
};

export type CellGroup = {
  title: string;
  subtitle?: string;
  description: string;
  pastorName?: string;
  elderName?: string;
  members: CellMember[];
  meetingInfo?: string;
  imageUrl?: string;
};

export type CellGroupContent = {
  headline: string;
  summary: string;
  groups: CellGroup[];
};

export const DEFAULT_CELL_GROUP_CONTENT: CellGroupContent = {
  headline: "셀가족 공동체",
  summary:
    "성도모임부 하위 셀가족 공동체가 말씀과 교제로 연결되어 함께 성장합니다.",
  groups: [],
};

export type CellGroupKeyword = {
  icon: string;
  label: string;
};

export type CellGroupScheduleStep = {
  time: string;
  title: string;
  description: string;
};

export type CellGroupDetail = {
  category: "남성" | "여성" | "청년·신혼";
  ageBand: string;
  tags: string[];
  summary: string;
  meetingTime: string;
  meetingPlace: string;
  leaderNote: string;
  keywords: CellGroupKeyword[];
  schedule: CellGroupScheduleStep[];
};

export const CELL_FILTER_TABS = [
  { key: "all", label: "전체" },
  { key: "남성", label: "남성" },
  { key: "여성", label: "여성" },
  { key: "청년·신혼", label: "청년·신혼" },
] as const;

export type CellFilterTabKey = (typeof CELL_FILTER_TABS)[number]["key"];

export const CELL_GROUP_DETAIL_BY_CELL_CODE: Record<string, CellGroupDetail> = {
  D000009: {
    category: "남성",
    ageBand: "30·40대",
    tags: ["아빠들의 수다", "육아·직장 공감"],
    summary: "일과 육아로 바쁜 아빠들의 금요일 밤",
    meetingTime: "매주 금요일 저녁 7시 30분",
    meetingPlace: "본관 2층 남A1셀실",
    leaderNote: "퇴근하고 셔츠 벗고 올 수 있는 편한 자리예요.",
    keywords: [
      { icon: "talk", label: "편한 수다" },
      { icon: "care", label: "육아·직장 고민" },
      { icon: "exercise", label: "함께 운동" },
    ],
    schedule: [
      { time: "19:30", title: "다과·식사", description: "퇴근 후 얼른 와서 간단한 저녁과 다과를 나눠요." },
      { time: "20:00", title: "말씀 나눔", description: "말씀 한 구절을 읽고 요즘 내 삶의 이야기를 나눠요." },
      { time: "20:40", title: "기도제목 공유", description: "다음 주까지 서로를 위해 기도해요." },
    ],
  },
  D000010: {
    category: "남성",
    ageBand: "40·50대",
    tags: ["든든한 형님들", "아침 말씀·기도"],
    summary: "오랜 직장생활을 나누는 형님들의 아침",
    meetingTime: "매주 토요일 아침 7시",
    meetingPlace: "본관 1층 남A2셀실",
    leaderNote: "이른 시간이지만 그만큼 알찬 만남이에요.",
    keywords: [
      { icon: "care", label: "회사 기도" },
      { icon: "meal", label: "아침 식사" },
      { icon: "word", label: "말씀 나눔" },
    ],
    schedule: [
      { time: "07:00", title: "아침 식사", description: "국 한 그릇 하면서 지난주 이야기를 나눠요." },
      { time: "07:30", title: "말씀 나눔", description: "본문을 읽고 사업과 직장에 적용할 점을 나눠요." },
      { time: "08:10", title: "기도제목 공유", description: "한 주를 기도로 열어요." },
    ],
  },
  D000011: {
    category: "남성",
    ageBand: "20·30대",
    tags: ["친구 같은 분위기", "회사·신앙 나눔"],
    summary: "회사 얘기부터 신앙까지 터놓는 모임",
    meetingTime: "매주 목요일 저녁 7시",
    meetingPlace: "본관 3층 남A3셀실",
    leaderNote: "처음 온 날부터 동네 친구처럼 편해요.",
    keywords: [
      { icon: "talk", label: "회사 수다" },
      { icon: "meal", label: "저녁 식사" },
      { icon: "word", label: "말씀 적용" },
    ],
    schedule: [
      { time: "19:00", title: "저녁 식사", description: "퇴근 길에 각자 사온 음식을 나눠 먹어요." },
      { time: "19:40", title: "말씀 나눔", description: "말씀을 내 삶에 적용해 볼 이야기를 나눠요." },
      { time: "20:20", title: "기도제목 공유", description: "이름을 부르며 서로를 위해 기도해요." },
    ],
  },
  D000012: {
    category: "남성",
    ageBand: "50대 이상",
    tags: ["인생 선배의 지혜", "느긋한 주일 오후"],
    summary: "인생 선배의 지혜가 있는 주일 오후",
    meetingTime: "매주 주일 오후 1시 30분",
    meetingPlace: "본관 1층 남A4셀실",
    leaderNote: "경험 많은 분들의 이야기가 큰 힘이 됩니다.",
    keywords: [
      { icon: "people", label: "인생 나눔" },
      { icon: "word", label: "말씀 강해" },
      { icon: "walk", label: "동네 산책" },
    ],
    schedule: [
      { time: "13:30", title: "다과 나눔", description: "점심 후 커피와 다과로 여유 있게 시작해요." },
      { time: "14:00", title: "말씀 나눔", description: "평생 신앙의 지혜를 나누며 묵상을 적용해요." },
      { time: "14:50", title: "기도제목 공유", description: "가족과 후배들을 위해 함께 기도해요." },
    ],
  },

  D000013: {
    category: "여성",
    ageBand: "30·40대",
    tags: ["엄마들의 공감", "커피 한 잔"],
    summary: "아이와 함께 와도 편한 엄마들의 모임",
    meetingTime: "매주 화요일 오전 10시",
    meetingPlace: "본관 2층 여A1셀실",
    leaderNote: "아이와 함께 와도 괜찮아요. 부담 없이 오세요.",
    keywords: [
      { icon: "family", label: "육아 공감" },
      { icon: "coffee", label: "커피 타임" },
      { icon: "care", label: "부부 기도" },
    ],
    schedule: [
      { time: "10:00", title: "커피 타임", description: "아이를 맡기고 온 엄마들의 한 주 고민을 풀어요." },
      { time: "10:30", title: "말씀 나눔", description: "육아하는 마음으로 말씀의 지혜를 구해요." },
      { time: "11:10", title: "기도제목 공유", description: "아이와 가정을 위해 서로 기도해요." },
    ],
  },
  D000014: {
    category: "여성",
    ageBand: "40·50대",
    tags: ["일상의 쉼", "말씀 공부"],
    summary: "바쁜 일상 속 쉼을 찾는 모임",
    meetingTime: "매주 수요일 오전 10시 30분",
    meetingPlace: "본관 1층 여A2셀실",
    leaderNote: "일하다 잠시 쉬어 가는 시간이라고 생각하면 돼요.",
    keywords: [
      { icon: "coffee", label: "일상의 쉼" },
      { icon: "care", label: "자녀 기도" },
      { icon: "word", label: "성경 공부" },
    ],
    schedule: [
      { time: "10:30", title: "다과 나눔", description: "차 한 잔의 여유로 일상에서 잠시 쉬어요." },
      { time: "11:00", title: "말씀 나눔", description: "한 주를 돌아보며 말씀으로 마음을 채워요." },
      { time: "11:40", title: "기도제목 공유", description: "자녀와 부모님을 위해 함께 기도해요." },
    ],
  },
  D000015: {
    category: "여성",
    ageBand: "50대 이상",
    tags: ["정 많은 모임", "말씀과 수다"],
    summary: "인생의 지혜를 나누는 정겨운 모임",
    meetingTime: "매주 목요일 오전 10시",
    meetingPlace: "본관 2층 여A3셀실",
    leaderNote: "나이 들어서도 배우는 게 있어 늘 감사한 모임이에요.",
    keywords: [
      { icon: "word", label: "말씀 나눔" },
      { icon: "talk", label: "정다운 수다" },
      { icon: "family", label: "가정 기도" },
    ],
    schedule: [
      { time: "10:00", title: "친교 나눔", description: "얼굴 보고 웃으며 지난주 이야기를 나눠요." },
      { time: "10:30", title: "말씀 나눔", description: "본문을 함께 읽고 삶에 적용할 점을 나눠요." },
      { time: "11:10", title: "기도제목 공유", description: "가족과 이웃을 위해 정성껏 기도해요." },
    ],
  },
  D000016: {
    category: "여성",
    ageBand: "20·30대",
    tags: ["같이 웃는 모임", "퇴근 후 나눔"],
    summary: "퇴근 후 함께 웃고 기도하는 모임",
    meetingTime: "매주 금요일 저녁 7시",
    meetingPlace: "본관 3층 여A4셀실",
    leaderNote: "회사 이야기하다가 같이 울고 웃어요.",
    keywords: [
      { icon: "talk", label: "회사 수다" },
      { icon: "meal", label: "같이 저녁" },
      { icon: "word", label: "말씀 나눔" },
    ],
    schedule: [
      { time: "19:00", title: "저녁 식사", description: "퇴근 후 같이 먹으며 회사 이야기를 나눠요." },
      { time: "19:40", title: "말씀 나눔", description: "말씀으로 지친 마음을 회복해요." },
      { time: "20:20", title: "기도제목 공유", description: "일과 꿈을 위해 서로 기도해 줘요." },
    ],
  },
  D000017: {
    category: "여성",
    ageBand: "30·40대",
    tags: ["서로 응원", "성장 나눔"],
    summary: "일하는 여성을 위한 응원의 모임",
    meetingTime: "매주 토요일 오후 3시",
    meetingPlace: "본관 1층 여A5셀실",
    leaderNote: "일 때문에 바빠도, 여기만 오면 힘이 나요.",
    keywords: [
      { icon: "care", label: "직장 응원" },
      { icon: "coffee", label: "다과 수다" },
      { icon: "growth", label: "성장 나눔" },
    ],
    schedule: [
      { time: "15:00", title: "다과 나눔", description: "오후의 여유를 누리며 수다를 떨어요." },
      { time: "15:30", title: "말씀 나눔", description: "직장에서의 신앙을 말씀으로 나눠요." },
      { time: "16:10", title: "기도제목 공유", description: "업무와 대인관계를 위해 기도해요." },
    ],
  },
  D000018: {
    category: "여성",
    ageBand: "40·50대",
    tags: ["가정 돌봄", "요리 나눔"],
    summary: "가정과 신앙의 균형을 찾아가는 모임",
    meetingTime: "매주 주일 오후 2시",
    meetingPlace: "본관 2층 여A6셀실",
    leaderNote: "가사에 치여 잊었던 나를 찾는 시간이에요.",
    keywords: [
      { icon: "family", label: "가정 돌봄" },
      { icon: "meal", label: "요리 나눔" },
      { icon: "word", label: "말씀 묵상" },
    ],
    schedule: [
      { time: "14:00", title: "요리 나눔", description: "각자 만든 음식으로 한 상 가득 차려요." },
      { time: "14:30", title: "말씀 나눔", description: "가정을 향한 말씀으로 집을 세워요." },
      { time: "15:10", title: "기도제목 공유", description: "가정과 자녀를 위해 함께 기도해요." },
    ],
  },

  D000019: {
    category: "청년·신혼",
    ageBand: "20·30대",
    tags: ["청춘의 고민", "밥 모임"],
    summary: "청춘의 고민을 나누는 금요일 저녁",
    meetingTime: "매주 금요일 저녁 7시",
    meetingPlace: "본관 3층 청년실",
    leaderNote: "취업, 진로, 연애까지 뭐든 꺼내 놓고 이야기해요.",
    keywords: [
      { icon: "career", label: "진로 고민" },
      { icon: "care", label: "취업 기도" },
      { icon: "meal", label: "밥 모임" },
    ],
    schedule: [
      { time: "19:00", title: "다과·식사", description: "밥과 간식으로 모임을 시작해요." },
      { time: "19:40", title: "말씀 나눔", description: "청년의 눈으로 말씀을 내 삶에 적용해요." },
      { time: "20:20", title: "기도제목 공유", description: "진로와 꿈을 위해 서로 기도해요." },
    ],
  },
  D000020: {
    category: "청년·신혼",
    ageBand: "신혼부부",
    tags: ["커플·신혼부부", "가정을 향한 신앙"],
    summary: "커플과 신혼부부의 이야기 모임",
    meetingTime: "매주 토요일 저녁 6시",
    meetingPlace: "본관 3층 청년실",
    leaderNote: "결혼 준비부터 부부 생활까지 함께 고민해요.",
    keywords: [
      { icon: "couple", label: "결혼 준비" },
      { icon: "family", label: "부부 신앙" },
      { icon: "meal", label: "함께 밥" },
    ],
    schedule: [
      { time: "18:00", title: "저녁 식사", description: "부부·커플이 함께 주말 저녁을 나눠요." },
      { time: "18:40", title: "말씀 나눔", description: "가정을 향한 말씀으로 부부 신앙을 세워요." },
      { time: "19:20", title: "기도제목 공유", description: "서로의 가정을 위해 함께 기도해요." },
    ],
  },
};


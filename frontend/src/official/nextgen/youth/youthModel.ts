export type YouthDepartment = {
  title: string;
  target: string;
  vision: string;
  description: string;
  worshipTime: string;
  worshipPlace: string;
};

export type YouthContact = {
  label: string;
  value: string;
};

export type YouthPageContent = {
  headline: string;
  summary: string;
  departments: YouthDepartment[];
  weeklyPrograms: string[];
  firstVisitGuide: string[];
  recentHighlights: string[];
  contacts: YouthContact[];
};

export const DEFAULT_YOUTH_CONTENT: YouthPageContent = {
  headline: "중고등부/청년부 비전",
  summary:
    "중고등부와 청년부가 말씀 안에서 정체성을 세우고, 일상 속에서 복음을 살아내는 다음세대로 자라가도록 함께합니다.",
  departments: [
    {
      title: "중고등부",
      target: "중1-고3 학생",
      vision: "세상에서 빛과 소금이 되는 청소년",
      description:
        "중1부터 고3까지, 말씀 안에서 정체성을 발견하고 학교와 일상에서 신앙으로 살아가는 법을 배웁니다.",
      worshipTime: "매주 주일 오전 11시",
      worshipPlace: "본당 3층 중고등부실",
    },
    {
      title: "청년부",
      target: "20-30대 청년",
      vision: "하나님 나라를 꿈꾸는 다음 세대 리더",
      description:
        "2030 청년들이 함께 예배하고 교제하며 각자의 삶의 자리에서 그리스도의 제자로 살아가도록 훈련합니다.",
      worshipTime: "매주 주일 오후 2시",
      worshipPlace: "본당 지하 청년부실",
    },
  ],
  weeklyPrograms: [
    "주일 연합예배 및 부서별 나눔",
    "주중 소그룹 모임(학년/또래별)",
    "월 1회 기도회 및 리더 모임",
    "학기별 말씀훈련/봉사 프로젝트",
  ],
  firstVisitGuide: [
    "예배 10분 전 로비 안내 데스크에서 첫 방문 등록",
    "담당 교역자/리더와 부서 안내 및 좌석 배정",
    "예배 후 또래 소그룹 인도자와 간단한 환영 모임",
  ],
  recentHighlights: [
    "상반기 연합수련회 진행",
    "지역 섬김 봉사활동 참여",
    "분기별 찬양/간증 예배 운영",
  ],
  contacts: [
    { label: "문의", value: "다음세대 사역팀" },
    { label: "연락처", value: "교회 사무실 (평일 09:00-18:00)" },
    { label: "비고", value: "처음 방문 시 안내 데스크로 오세요" },
  ],
};

export const YOUTH_BASE_PATH = "/nextgen/youth";
export const YOUTH_API_BASE_PATH = "/official/nextgen/youth";

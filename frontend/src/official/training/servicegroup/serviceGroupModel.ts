export type ServiceMember = {
  name: string;
  role: string;
  summary?: string;
};

export type ServiceGroup = {
  deptCode?: string;
  title: string;
  description: string;
  imageUrl?: string;
  leaderName?: string;
  leaderRole?: string;
  pastorName?: string;
  elderName?: string;
  members: ServiceMember[];
};

export type ServiceGroupContent = {
  groups: ServiceGroup[];
};

export const DEFAULT_SERVICE_GROUP_CONTENT: ServiceGroupContent = {
  groups: [
    {
      deptCode: "D000003",
      title: "재정팀",
      description:
        "헌금과 회계, 집행 내역을 정리하고 교회 재정 흐름을 안정적으로 관리합니다.",
      imageUrl: "/img/official/training/servicegroup/servicegroup_01.png",
      leaderName: "정현우",
      leaderRole: "강도사",
      members: [
        { name: "정현우", role: "부서장", summary: "예산 집행 및 재정 총괄" },
      ],
    },
    {
      deptCode: "D000004",
      title: "전도팀",
      description:
        "지역 전도와 복음 나눔, 전도 행사 지원을 통해 공동체의 외연을 넓히는 사역입니다.",
      imageUrl: "/img/official/training/servicegroup/servicegroup_02.png",
      leaderName: "한지은",
      leaderRole: "강도사",
      members: [
        { name: "한지은", role: "부서장", summary: "전도 사역 기획 및 운영" },
      ],
    },
    {
      deptCode: "D000005",
      title: "차량팀",
      description:
        "예배와 행사 시 차량 운행과 이동 지원을 맡아 성도들의 참여를 돕습니다.",
      imageUrl: "/img/official/training/servicegroup/servicegroup_03.png",
      leaderName: "윤서연",
      leaderRole: "전도사",
      members: [
        {
          name: "윤서연",
          role: "부서장",
          summary: "운행 계획 및 차량 배차 관리",
        },
        { name: "이다희", role: "팀원", summary: "행사 차량 지원" },
      ],
    },
    {
      deptCode: "D000006",
      title: "봉사팀",
      description:
        "교회 행사와 상시 운영에 필요한 현장 지원과 봉사 인력 조정을 담당합니다.",
      imageUrl: "/img/official/training/servicegroup/servicegroup_04.png",
      leaderName: "강수진",
      leaderRole: "전도사",
      members: [
        {
          name: "강수진",
          role: "부서장",
          summary: "봉사 배치 및 현장 운영 지원",
        },
      ],
    },
    {
      deptCode: "D000007",
      title: "새가족팀",
      description: "새가족 맞이와 초기 정착을 도우며 공동체 연결을 지원합니다.",
      imageUrl: "/img/official/training/servicegroup/servicegroup_05.png",
      leaderName: "오하나",
      leaderRole: "강도사",
      members: [
        { name: "오하나", role: "부서장", summary: "새가족 응대 및 정착 지원" },
      ],
    },
    {
      deptCode: "D000008",
      title: "찬양팀",
      description: "예배 찬양과 음악 사역을 준비하며 예배 흐름을 섬깁니다.",
      imageUrl: "/img/official/training/servicegroup/servicegroup_06.png",
      leaderName: "신가영",
      leaderRole: "전도사",
      members: [
        { name: "신가영", role: "부서장", summary: "찬양 사역 총괄" },
        { name: "김예린", role: "팀원", summary: "예배 찬양 지원" },
      ],
    },
  ],
};

export type ServiceGroupDetail = {
  slogan: string;
  tags: string[];
  meetingTime: string;
  meetingPlace: string;
  vision: string;
  roles: string[];
  joinProfile: string[];
};

export const SERVICE_GROUP_DETAIL_BY_DEPT_CODE: Record<
  string,
  ServiceGroupDetail
> = {
  D000003: {
    slogan: "교회 살림을 투명하게",
    tags: ["헌금 집계", "결산 보고", "예산 관리"],
    meetingTime: "매주 주일 예배 후",
    meetingPlace: "본관 2층 재정사무실",
    vision:
      "헌금을 정리하다 보면 교회 살림살이가 눈에 들어와요. 꼼꼼함이 실력인 부서이니 부담 없이 오세요.",
    roles: [
      "헌금 집계 및 입금 처리",
      "월별 결산 보고서 작성",
      "부서 예산 집행 관리",
    ],
    joinProfile: [
      "엑셀을 다루는 분",
      "꼼꼼한 성격의 분",
      "주중 저녁이 가능한 분",
    ],
  },
  D000004: {
    slogan: "이웃에게 먼저 다가갑니다",
    tags: ["노방 전도", "초청 주일", "후속 케어"],
    meetingTime: "매주 토요일 오전 10시",
    meetingPlace: "본관 1층 전도부실",
    vision:
      "처음엔 말 걸기가 어려운데, 두 번 만나면 친구가 되더라고요. 함께 복음을 전하고 싶습니다.",
    roles: ["지역 노방 전도", "초청 주일 운영", "전도 대상자 후속 연락"],
    joinProfile: [
      "말하기 좋아하는 분",
      "지역 주민과 친한 분",
      "주말 시간이 가능한 분",
    ],
  },
  D000005: {
    slogan: "성도님을 안전하게 모십니다",
    tags: ["셔틀 운행", "주차 안내", "차량 점검"],
    meetingTime: "매주 주일 오전 8시 30분",
    meetingPlace: "본관 1층 차량부실",
    vision:
      "운전이 취미라 시작했는데, 어느새 성도님을 뵐 기대가 가장 큰 시간이 됐어요. 안전하게 모시겠습니다.",
    roles: ["주일 셔틀버스 운행", "주차 안내 및 차량 배차", "차량 안전 점검"],
    joinProfile: [
      "운전면허가 있는 분",
      "주일 오전이 가능한 분",
      "차량에 관심이 많은 분",
    ],
  },
  D000006: {
    slogan: "환영하는 마음을 전합니다",
    tags: ["현장 안내", "봉사자 배치", "행사 지원"],
    meetingTime: "매주 주일 예배 전 1시간",
    meetingPlace: "본관 1층 봉사부실",
    vision:
      "손이 부족해서라기보다 환영의 마음을 전하고 싶어요. 행사가 끝나고 보는 웃는 얼굴이 보람입니다.",
    roles: [
      "행사 동선 및 좌석 안내",
      "봉사자 스케줄 배치",
      "현장 지원 및 사후 정리",
    ],
    joinProfile: [
      "사람 응대를 좋아하는 분",
      "주말 행사가 가능한 분",
      "팀워크를 즐기는 분",
    ],
  },
  D000007: {
    slogan: "처음 오신 분을 환영합니다",
    tags: ["새가족 환영", "등록 안내", "정착 지원"],
    meetingTime: "매주 주일 예배 전후",
    meetingPlace: "본관 1층 새가족실",
    vision:
      "저도 처음 교회에 올 때 낯을 많이 가렸거든요. 그 마음으로 먼저 다가가려고 합니다.",
    roles: ["새가족 등록 안내", "첫 방문 환영 및 케어", "소그룹 연결 지원"],
    joinProfile: [
      "말을 걸기 좋아하는 분",
      "마음이 따뜻한 분",
      "주일 오전이 가능한 분",
    ],
  },
  D000008: {
    slogan: "예배에 마음을 더합니다",
    tags: ["찬양 인도", "파트 연습", "음향 운영"],
    meetingTime: "매주 금요일 저녁 7시 30분",
    meetingPlace: "본당 2층 연습실",
    vision:
      "실력보다 마음이 먼저예요. 함께 소리를 맞추며 예배를 준비하는 즐거움을 나누고 싶습니다.",
    roles: ["주일 찬양 인도", "파트별 연습 운영", "예배 리허설 준비"],
    joinProfile: [
      "노래 부르기를 좋아하는 분",
      "악기를 다루는 분",
      "금요일 저녁이 가능한 분",
    ],
  },
};

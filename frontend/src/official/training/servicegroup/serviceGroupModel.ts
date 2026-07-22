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
  headline: string;
  summary: string;
  groups: ServiceGroup[];
};

export const DEFAULT_SERVICE_GROUP_CONTENT: ServiceGroupContent = {
  headline: "섬기는 공동체",
  summary: "섬기는 공도체는",
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

export type Education = {
  schoolTypeName?: string;
  schoolName: string;
  degreeName?: string;
  major?: string;
  graduationStatusName?: string;
  admissionDate?: string;
  graduationDate?: string;
  finalEducation?: boolean;
};

export type Career = {
  companyName: string;
  hireDate?: string;
  retireDate?: string;
  employmentTypeName?: string;
  jobTitle?: string;
  jobResponsibility?: string;
};

export type PastorProfile = {
  employeeNo?: string;
  name: string;
  title: string;
  greeting: string;
  imageUrl?: string;
  educations: Education[];
  careers: Career[];
};

export type LeaderCard = {
  employeeNo?: string;
  name: string;
  role: string;
  ministry: string;
  intro?: string;
  imageUrl?: string;
  educations: Education[];
  careers: Career[];
};

export type PeopleContent = {
  headline: string;
  summary: string;
  pastor: PastorProfile;
  leaders: LeaderCard[];
};

export const DEFAULT_PEOPLE_CONTENT: PeopleContent = {
  headline: "섬기는 사람들",
  summary: "다사랑교회를 섬기는 담임목사님과 교역자, 장로님들을 소개합니다.",
  pastor: {
    name: "김OO",
    title: "담임목사",
    greeting:
      "다사랑교회에 오신 것을 환영합니다. 말씀과 사랑으로 함께 성장하는 공동체를 꿈꿉니다.",
    imageUrl: "/img/people/pastor.jpg",
    educations: [],
    careers: [],
  },
  leaders: [
    {
      name: "이OO",
      role: "부교역자",
      ministry: "교육 양육",
      intro:
        "다음세대가 말씀 안에서 자라도록 교육과 양육 사역을 맡고 있습니다.",
      imageUrl: "/img/people/associate1.jpg",
      educations: [],
      careers: [],
    },
    {
      name: "박OO",
      role: "부교역자",
      ministry: "찬양 예배",
      intro: "예배팀과 함께 은혜로운 예배를 준비하며 찬양 사역을 섬깁니다.",
      imageUrl: "/img/people/associate2.jpg",
      educations: [],
      careers: [],
    },
    {
      name: "최OO",
      role: "시무장로",
      ministry: "재정 행정",
      intro: "교회 재정과 행정이 투명하고 건강하게 운영되도록 지원합니다.",
      imageUrl: "/img/people/elder1.jpg",
      educations: [],
      careers: [],
    },
    {
      name: "정OO",
      role: "시무장로",
      ministry: "선교 봉사",
      intro: "지역과 열방을 향한 선교, 봉사 사역을 기획하고 실행합니다.",
      imageUrl: "/img/people/elder2.jpg",
      educations: [],
      careers: [],
    },
    {
      name: "강OO",
      role: "시무장로",
      ministry: "교육 다음세대",
      intro: "다음세대 예배와 훈련 시스템을 세우는 일에 집중하고 있습니다.",
      imageUrl: "/img/people/elder3.jpg",
      educations: [],
      careers: [],
    },
    {
      name: "김OO",
      role: "권사",
      ministry: "기도 심방",
      intro: "기도와 심방으로 성도들의 삶 가까이에서 함께 동행합니다.",
      imageUrl: "/img/people/deaconess1.jpg",
      educations: [],
      careers: [],
    },
  ],
};

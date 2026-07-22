export type PastorProfile = {
  name: string;
  title: string;
  greeting: string;
  biography: string;
  imageUrl?: string;
};

export type LeaderCard = {
  name: string;
  role: string;
  ministry: string;
  intro?: string;
  biography?: string;
  imageUrl?: string;
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
    biography:
      "총신대학교 신학대학원(M.Div.) 졸업, 미국 Fuller Theological Seminary(Th.M.) 수료. 2010년 다사랑교회 개척, 현재까지 담임목사로 섬기고 있습니다.",
    imageUrl: "/img/people/pastor.jpg",
  },
  leaders: [
    {
      name: "이OO",
      role: "부교역자",
      ministry: "교육 양육",
      intro:
        "다음세대가 말씀 안에서 자라도록 교육과 양육 사역을 맡고 있습니다.",
      biography: "총신대학교 신학과 졸업, 2018년부터 다사랑교회 교육사역 담당.",
      imageUrl: "/img/people/associate1.jpg",
    },
    {
      name: "박OO",
      role: "부교역자",
      ministry: "찬양 예배",
      intro: "예배팀과 함께 은혜로운 예배를 준비하며 찬양 사역을 섬깁니다.",
      biography: "서울신학대학교 교회음악 전공, 예배인도 및 찬양사역 담당.",
      imageUrl: "/img/people/associate2.jpg",
    },
    {
      name: "최OO",
      role: "시무장로",
      ministry: "재정 행정",
      intro: "교회 재정과 행정이 투명하고 건강하게 운영되도록 지원합니다.",
      biography: "2016년 장로 장립, 재정위원회 및 행정지원 사역 담당.",
      imageUrl: "/img/people/elder1.jpg",
    },
    {
      name: "정OO",
      role: "시무장로",
      ministry: "선교 봉사",
      intro: "지역과 열방을 향한 선교, 봉사 사역을 기획하고 실행합니다.",
      biography: "해외 단기선교 및 지역봉사 팀 코디네이터로 사역 중.",
      imageUrl: "/img/people/elder2.jpg",
    },
    {
      name: "강OO",
      role: "시무장로",
      ministry: "교육 다음세대",
      intro: "다음세대 예배와 훈련 시스템을 세우는 일에 집중하고 있습니다.",
      biography: "주일학교/청소년부 교육위원으로 10년 이상 사역.",
      imageUrl: "/img/people/elder3.jpg",
    },
    {
      name: "김OO",
      role: "권사",
      ministry: "기도 심방",
      intro: "기도와 심방으로 성도들의 삶 가까이에서 함께 동행합니다.",
      biography: "중보기도팀 및 심방팀에서 장기적으로 섬기고 있습니다.",
      imageUrl: "/img/people/deaconess1.jpg",
    },
  ],
};

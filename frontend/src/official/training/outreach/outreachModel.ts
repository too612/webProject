export type OutreachActivity = {
  title: string;
  country: string;
  countryCode: string;
  organization: string;
  missionaryName: string;
  sentYear: number;
};

export type OutreachContent = {
  headline: string;
  summary: string;
  bannerTitle: string;
  bannerDescription: string;
  missionSectionTitle: string;
  missionSectionDescription: string;
  offeringSectionTitle: string;
  offeringSectionDescription: string;
  activities: OutreachActivity[];
};

export const OUTREACH_OFFERING_ACCOUNT = {
  bankName: "국민은행",
  accountNumber: "123456-78-901234",
  accountHolder: "다사랑교회",
  description:
    "선교헌금은 파송 선교사님들의 사역과 현지 교회 개척, 다음 세대 선교 교육을 위해 사용됩니다.",
};

export const DEFAULT_OUTREACH_CONTENT: OutreachContent = {
  headline: "해외선교아웃리치",
  summary:
    "하나님의 사랑을 열방에 전하는 다사랑교회의 단기선교 이야기입니다. 함께 떠나는 믿음의 여정에 여러분을 초대합니다.",
  bannerTitle: "교회의 존재 이유는 선교입니다.",
  bannerDescription:
    "'mission'은 보냄을 받는 것입니다.\n다사랑교회는 복음의 통로로 세워진 모든 성도가 열방으로 보냄을 받아, 하나님이 사랑하시는 세계를 품고 섬깁니다.",
  missionSectionTitle: "선교참여 현황",
  missionSectionDescription:
    "다사랑교회가 파송한 선교사님들과 함께하는 파송 국가입니다.",
  offeringSectionTitle: "선교헌금 안내",
  offeringSectionDescription:
    "선교헌금은 매월 현지 사역과 파송 선교사를 후원하는 데 사용되며, 매년 사역 보고를 통해 투명하게 공유됩니다.",
  activities: [
    {
      title: "마닐라",
      country: "필리핀",
      countryCode: "PH",
      organization: "마닐라 지역아동센터",
      missionaryName: "김OO 이OO 선교사",
      sentYear: 2015,
    },
    {
      title: "프놈펜",
      country: "캄보디아",
      countryCode: "KH",
      organization: "프놈펜 교회협력단",
      missionaryName: "박OO 최OO 선교사",
      sentYear: 2017,
    },
    {
      title: "울란바토르",
      country: "몽골",
      countryCode: "MN",
      organization: "목회자 훈련원",
      missionaryName: "정OO 선교사",
      sentYear: 2018,
    },
    {
      title: "메단",
      country: "인도네시아",
      countryCode: "ID",
      organization: "메단 의료선교팀",
      missionaryName: "강OO 윤OO 선교사",
      sentYear: 2019,
    },
  ],
};
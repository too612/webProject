export type OutreachActivity = {
  title: string;
  region: string;
  description: string;
  vision: string;
  participationGuide: string;
  imageUrl?: string;
};

export type OutreachContent = {
  headline: string;
  summary: string;
  bannerImages: string[];
  activities: OutreachActivity[];
};

export const DEFAULT_OUTREACH_CONTENT: OutreachContent = {
  headline: '해외선교아웃리치',
  summary:
    '하나님의 사랑을 열방에 전하는 다사랑교회의 단기선교 이야기입니다. 함께 떠나는 믿음의 여정에 여러분을 초대합니다.',
  bannerImages: [
    '/img/mission/banner1.jpg',
    '/img/mission/banner2.jpg',
    '/img/mission/banner3.jpg',
  ],
  activities: [
    {
      title: '필리핀 마닐라',
      region: '필리핀 / 마닐라',
      description: '현지 교회와 협력하여 지역아동센터 교육 및 의료봉사를 진행합니다. 아이들에게 영어와 한국어를 가르치고, 기초 의료 서비스를 제공합니다.',
      vision: '필리핀 현지 교회와의 지속적 파트너십을 통해 복음의 씨앗을 심고 현지 지도자를 세워갑니다.',
      participationGuide: '매년 7월 출발 / 10일 일정 / 사전교육 4주 필수',
      imageUrl: '/img/mission/philippines.jpg',
    },
    {
      title: '캄보디아 프놈펜',
      region: '캄보디아 / 프놈펜',
      description: '오지 마을에 우물 파기와 주택 개보수 봉사를 통해 생활환경을 개선하고, 마을 주민들과 함께 예배를 드립니다.',
      vision: '현지인 선교사를 후원하고 마을 공동체가 자립할 수 있도록 지속 가능한 선교 모델을 구축합니다.',
      participationGuide: '매년 2월 출발 / 8일 일정 / 건축 기술 봉사자 우대',
      imageUrl: '/img/mission/cambodia.jpg',
    },
    {
      title: '몽골 울란바토르',
      region: '몽골 / 울란바토르',
      description: '몽골 목회자 세미나와 아동 영어캠프를 통해 복음의 통로가 됩니다. 현지 목회자들을 격려하고 다음 세대를 세웁니다.',
      vision: '몽골에 건강한 교회가 세워지도록 현지 목회자 훈련과 교회 개척을 지원합니다.',
      participationGuide: '매년 8월 출발 / 9일 일정 / 교육 사역 경험자 우대',
      imageUrl: '/img/mission/mongolia.jpg',
    },
    {
      title: '인도네시아 메단',
      region: '인도네시아 / 메단',
      description: '의료진이 함께하는 의료선교로 현지 주민들에게 의료 혜택을 제공하고, 복음의 사랑을 나눕니다.',
      vision: '의료 취약 지역에 정기적 의료 지원을 통해 지역 주민의 건강과 영혼을 동시에 돌봅니다.',
      participationGuide: '매년 5월 출발 / 9일 일정 / 의료인 및 일반 봉사자 모집',
      imageUrl: '/img/mission/indonesia.jpg',
    },
  ],
};
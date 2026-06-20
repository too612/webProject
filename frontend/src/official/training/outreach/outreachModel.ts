export type OutreachActivity = {
  title: string;
  description: string;
  imageUrl?: string;
};

export type OutreachContent = {
  headline: string;
  summary: string;
  backgroundImageUrl?: string;
  activities: OutreachActivity[];
};

export const DEFAULT_OUTREACH_CONTENT: OutreachContent = {
  headline: '해외선교아웃리치',
  summary:
    '지역과 열방을 향한 하나님의 사랑을 전하며, 단기선교와 해외아웃리치를 통해 복음의 열매를 경험하고 있습니다.',
  backgroundImageUrl: '/img/mission/hero-bg.jpg',
  activities: [
    {
      title: '필리핀 단기선교',
      description: '필리핀 현지 교회와 협력하여 지역아동센터 교육 및 의료봉사를 진행했습니다.',
      imageUrl: '/img/mission/philippines.jpg',
    },
    {
      title: '캄보디아 아웃리치',
      description: '캄보디아 오지 마을에 우물 파기와 주택 개보수 봉사를 실시했습니다.',
      imageUrl: '/img/mission/cambodia.jpg',
    },
    {
      title: '몽골 선교여행',
      description: '몽골 목회자 세미나와 아동 영어캠프를 통해 복음의 통로가 되었습니다.',
      imageUrl: '/img/mission/mongolia.jpg',
    },
    {
      title: '인도네시아 의료선교',
      description: '의료진이 함께한 인도네시아 의료선교로 현지 주민들에게 의료혜택을 제공했습니다.',
      imageUrl: '/img/mission/indonesia.jpg',
    },
  ],
};
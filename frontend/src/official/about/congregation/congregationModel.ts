export type CongregationItem = {
  title: string;
  description: string;
};

export type CongregationContent = {
  headline: string;
  summary: string;
  congregations: CongregationItem[];
};

export const DEFAULT_CONGREGATION_CONTENT: CongregationContent = {
  headline: '공동체안내',
  summary:
    '말씀과 성령 안에서 주일학교, 중고등부, 대학/청년부가 함께 자라가는 공동체를 소개합니다.',
  congregations: [
    {
      title: '주일학교',
      description: '유치부, 초등부, 청소년부가 복음 안에서 건강하게 자라도록 돕는 다음세대 공동체입니다.',
    },
    {
      title: '중고등부',
      description: '예배와 교제, 사역 참여를 통해 믿음의 삶을 함께 세워 가는 중고등부 공동체입니다.',
    },
    {
      title: '대학/청년부',
      description: '말씀과 기도, 서로의 삶을 돌보는 나눔으로 성숙해 가는 대학/청년부 공동체입니다.',
    },
  ],
};

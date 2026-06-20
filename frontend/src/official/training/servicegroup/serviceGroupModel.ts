export type ServiceMember = {
  name: string;
  phone: string;
};

export type ServiceGroup = {
  title: string;
  description: string;
  members: ServiceMember[];
};

export type ServiceGroupContent = {
  headline: string;
  summary: string;
  groups: ServiceGroup[];
};

export const DEFAULT_SERVICE_GROUP_CONTENT: ServiceGroupContent = {
  headline: '섬기는 공동체',
  summary:
    '각 부서가 맡은 사명과 역할에 따라 교회와 지역을 섬기고 있습니다.',
  groups: [
    {
      title: '전도부',
      description: '복음 전파와 새가족 환영을 통해 교회 성장에 기여합니다.',
      members: [
        { name: '김OO', phone: '010-0000-0001' },
        { name: '이OO', phone: '010-0000-0002' },
      ],
    },
    {
      title: '봉사부',
      description: '교회 내·외부 봉사 활동을 기획하고 실행합니다.',
      members: [
        { name: '박OO', phone: '010-0000-0003' },
        { name: '최OO', phone: '010-0000-0004' },
      ],
    },
    {
      title: '차량부',
      description: '교회 행사 및 예배 시 교통편의를 제공합니다.',
      members: [
        { name: '정OO', phone: '010-0000-0005' },
        { name: '강OO', phone: '010-0000-0006' },
      ],
    },
  ],
};
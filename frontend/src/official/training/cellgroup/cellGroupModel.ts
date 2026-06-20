export type CellMember = {
  name: string;
};

export type CellGroup = {
  title: string;
  description: string;
  members: CellMember[];
  imageUrl?: string;
};

export type CellGroupContent = {
  headline: string;
  summary: string;
  groups: CellGroup[];
};

export const DEFAULT_CELL_GROUP_CONTENT: CellGroupContent = {
  headline: '셀가족 공동체',
  summary:
    '남선교회와 여선교회가 함께하는 셀 모임을 통해 신앙과 우정을 나눕니다.',
  groups: [
    {
      title: '남A1셀',
      description: '말씀과 기도로 하나 되는 남성 셀 모임입니다.',
      members: [
        { name: '김OO' }, { name: '이OO' }, { name: '박OO' },
      ],
      imageUrl: '/img/cell/male-a1.jpg',
    },
    {
      title: '남A2셀',
      description: '서로를 격려하며 함께 성장하는 남성 셀 모임입니다.',
      members: [
        { name: '최OO' }, { name: '정OO' }, { name: '강OO' },
      ],
      imageUrl: '/img/cell/male-a2.jpg',
    },
    {
      title: '여A1셀',
      description: '사랑과 섬김으로 하나 되는 여성 셀 모임입니다.',
      members: [
        { name: '김OO' }, { name: '이OO' }, { name: '박OO' }, { name: '최OO' },
      ],
      imageUrl: '/img/cell/female-a1.jpg',
    },
  ],
};
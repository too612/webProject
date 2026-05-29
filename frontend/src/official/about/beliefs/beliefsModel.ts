export type BeliefItem = {
  title: string;
  description: string;
};

export type BeliefsContent = {
  headline: string;
  summary: string;
  beliefs: BeliefItem[];
  footerNote: string;
};

export const DEFAULT_BELIEFS_CONTENT: BeliefsContent = {
  headline: '성도들의 신앙고백',
  summary:
    '우리 교회는 성경을 신앙과 삶의 최종 권위로 고백하며, 아래의 내용에 함께 동의합니다.',
  beliefs: [
    {
      title: '성경',
      description: '성경은 하나님의 영감으로 기록된 말씀이며 신앙의 기준입니다.',
    },
    {
      title: '하나님',
      description: '성부, 성자, 성령 삼위일체 하나님을 믿고 예배합니다.',
    },
    {
      title: '예수 그리스도',
      description: '예수 그리스도는 우리의 구주이시며 부활하신 주님이십니다.',
    },
    {
      title: '구원',
      description: '구원은 은혜로 주어지며 믿음으로 받아들이는 선물입니다.',
    },
    {
      title: '교회',
      description: '교회는 그리스도의 몸이며 서로 사랑하고 섬기는 공동체입니다.',
    },
    {
      title: '삶',
      description: '매일의 삶 속에서 하나님 나라의 가치와 사랑을 실천합니다.',
    },
  ],
  footerNote: '이 내용은 기본 골격이므로 교회 상황에 맞게 자유롭게 수정하실 수 있습니다.',
};

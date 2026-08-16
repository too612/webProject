export type WorshipTimeItem = {
  category?: string;
  title?: string;
  time?: string;
  note?: string;
  location?: string;
  orderNo?: number;
};


export const WORSHIP_TIME_PAGE_TITLE = '예배시간';
export const WORSHIP_TIME_PAGE_DESCRIPTION =
  '하나님께 드리는 거룩한 예배와 모임의 시간을 안내드립니다.';

export type WorshipTimeSectionKey = 'sunday' | 'nextgen' | 'weekday';

export type WorshipTimeSection = {
  key: WorshipTimeSectionKey;
  title: string;
  headers: string[];
  includes: (item: WorshipTimeItem) => boolean;
};

export const WORSHIP_TIME_SECTIONS: WorshipTimeSection[] = [
  {
    key: 'sunday',
    title: '주일예배(장년)',
    headers: ['예배명', '예배시간', '장소'],
    includes: (item) =>
      item.title === '주일오전 축제예배' || item.title === '주일저녁 찬양예배',
  },
  {
    key: 'nextgen',
    title: '어린이·청소년 예배',
    headers: ['예배명', '예배시간', '장소'],
    includes: (item) =>
      item.title === '주일학교예배' || item.title === '중고등부예배',
  },
  {
    key: 'weekday',
    title: '주중예배 및 모임',
    headers: ['구분', '예배명', '시간', '장소'],
    includes: () => true,
  },
];
export type HistoryTimelineItem = {
  year: string;
  events: string[];
};

export type HistoryContent = {
  headline: string;
  summary: string;
  timeline: HistoryTimelineItem[];
};

export const DEFAULT_HISTORY_CONTENT: HistoryContent = {
  headline: '하나님이 인도하신 길',
  summary: '작은 모임으로 시작한 교회가 오늘에 이르기까지의 여정을 연도별로 정리했습니다.',
  timeline: [
    {
      year: '2025년',
      events: ['새 성전 리모델링 및 예배 공간 확장', '다음 세대 교육관 개관'],
    },
    {
      year: '2023년',
      events: ['지역 돌봄 사역 센터 설립', '전 교인 성경통독 캠페인 진행'],
    },
    {
      year: '2018년',
      events: ['해외 단기 선교팀 파송', '청년부 및 직장인 소그룹 확대'],
    },
    {
      year: '2010년',
      events: ['교회 창립 및 첫 예배 드림', '지역사회 섬김 사역 시작'],
    },
  ],
};

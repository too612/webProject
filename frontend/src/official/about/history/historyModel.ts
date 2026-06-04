export type HistoryTimelineItem = {
  year: string;
  events: {
    date: string;
    description: string;
    images?: string[];
  }[];
};

export type HistoryContent = {
  headline: string;
  summary: string;
  timeline: HistoryTimelineItem[];
};

export const DEFAULT_HISTORY_CONTENT: HistoryContent = {
  headline: '하나님이 인도하신 길',
  summary: '1987년 교회 설립부터 2026년 현재까지, 공동체가 걸어온 여정을 핵심 이정표 중심으로 정리했습니다.',
  timeline: [
    {
      year: '2026년',
      events: [
        { date: '03.10', description: '창립 39주년 비전선언 예배' },
        { date: '06.15', description: '세대통합 예배 체계 고도화' },
        { date: '10.20', description: '지역 돌봄 연계 사역 확대' },
      ],
    },
    {
      year: '2025년',
      events: [
        { date: '02.09', description: '다음세대 리더십 캠프 운영' },
        { date: '05.18', description: '지역 연합찬양집회 개최' },
        { date: '11.02', description: '추수감사 사랑나눔 행사' },
      ],
    },
    {
      year: '2024년',
      events: [
        { date: '01.21', description: '새가족 정착 시스템 개편' },
        { date: '07.14', description: '여름 선교 아웃리치 파송' },
        { date: '12.24', description: '성탄 이웃초청 예배' },
      ],
    },
    {
      year: '2023년',
      events: [
        { date: '03.12', description: '지역 돌봄 사역 센터 설립' },
        { date: '06.04', description: '전 교인 성경통독 캠페인 진행' },
        { date: '09.17', description: '가정 회복 세미나 정례화' },
      ],
    },
    {
      year: '2022년',
      events: [
        { date: '04.03', description: '주일학교 예배실 리뉴얼' },
        { date: '08.28', description: '청년부 지역봉사 프로젝트 시작' },
      ],
    },
    {
      year: '2021년',
      events: [
        { date: '02.14', description: '소그룹 온라인 양육 프로그램 운영' },
        { date: '10.10', description: '가을 감사 음악회 개최' },
      ],
    },
    {
      year: '2020년',
      events: [
        { date: '03.01', description: '온라인-오프라인 병행 예배 전환' },
        { date: '05.24', description: '디지털 양육 콘텐츠 운영 시작' },
      ],
    },
    {
      year: '2019년',
      events: [
        { date: '01.13', description: '전교인 말씀암송 캠페인 시작' },
        { date: '09.22', description: '가을 전도축제 진행' },
      ],
    },
    {
      year: '2018년',
      events: [
        { date: '03.18', description: '지역 어르신 돌봄사역 확대' },
        { date: '11.11', description: '청년 예배팀 재편 및 파송' },
      ],
    },
    {
      year: '2017년',
      events: [
        { date: '04.09', description: '다음 세대 교육 시스템 개편' },
        { date: '12.03', description: '교구 중심 돌봄 체계 정비' },
      ],
    },
    {
      year: '2016년',
      events: [
        { date: '02.28', description: '새가족 환영주일 확대 운영' },
        { date: '08.07', description: '해외 단기선교팀 파송' },
      ],
    },
    {
      year: '2015년',
      events: [
        { date: '05.31', description: '교구별 섬김 프로젝트 시작' },
        { date: '10.25', description: '전교인 체육대회 재개' },
      ],
    },
    {
      year: '2014년',
      events: [
        { date: '03.16', description: '예배 음악사역팀 확장' },
        { date: '11.30', description: '사랑의 김장나눔 정례화' },
      ],
    },
    {
      year: '2013년',
      events: [
        { date: '06.09', description: '중보기도학교 개설' },
        { date: '09.29', description: '가정예배 캠페인 운영' },
      ],
    },
    {
      year: '2012년',
      events: [
        { date: '01.22', description: '신년 특별새벽기도회 확대' },
        { date: '07.22', description: '여름성경학교 통합 운영' },
      ],
    },
    {
      year: '2011년',
      events: [
        { date: '04.17', description: '지역 청소년 멘토링 사역 시작' },
        { date: '12.18', description: '성탄 사랑나눔 바자회 개최' },
      ],
    },
    {
      year: '2010년',
      events: [
        { date: '03.07', description: '지역사회 섬김 사역 확장' },
        { date: '09.12', description: '청년/장년 소그룹 재편' },
      ],
    },
    {
      year: '2009년',
      events: [
        { date: '02.15', description: '국제 선교 세미나 개최' },
        { date: '11.08', description: '다음세대 비전센터 운영 강화' },
      ],
    },
    {
      year: '2008년',
      events: [
        { date: '05.04', description: '세계비전 제자대학 확대 운영' },
        { date: '10.19', description: '지역 연합예배 참여' },
      ],
    },
    {
      year: '2007년',
      events: [
        { date: '03.25', description: '사랑의 음악회 개최' },
        { date: '12.25', description: '성탄 사랑나누기 행사' },
      ],
    },
    {
      year: '2006년',
      events: [
        { date: '02.20', description: '국제 컨퍼런스 정례화' },
        { date: '09.02', description: '비전센터 입당 및 예배 확장' },
      ],
    },
    {
      year: '2005년',
      events: [
        { date: '01.27', description: '예배당 입당 및 예배공간 확충' },
        { date: '08.01', description: '여름수련회 선교 파송 체계 정착' },
      ],
    },
    {
      year: '2004년',
      events: [
        { date: '02.23', description: '국제 컨퍼런스 개최 기반 정비' },
        { date: '09.05', description: '제자대학 정규 과정 개편' },
      ],
    },
    {
      year: '2003년',
      events: [
        { date: '06.22', description: '두날개선교센터 설립' },
        { date: '10.03', description: '풍성한가족 가을운동회 개최' },
      ],
    },
    {
      year: '2002년',
      events: [
        { date: '01.14', description: '제1회 국제 컨퍼런스 개최' },
        { date: '12.08', description: '제자대학 졸업예배 정례화' },
      ],
    },
    {
      year: '2001년',
      events: [
        { date: '09.02', description: '세계비전 제자대학 확장 운영' },
        { date: '12.23', description: '건강한 교회 모델 선정' },
      ],
    },
    {
      year: '2000년',
      events: [
        { date: '02.27', description: '새천년 공동체 비전 선포' },
        { date: '09.18', description: '제자훈련 과정 표준화' },
      ],
    },
    {
      year: '1999년',
      events: [
        { date: '04.11', description: '지역 소그룹 예배 확대' },
        { date: '10.03', description: '가을 전도집회 개최' },
      ],
    },
    {
      year: '1998년',
      events: [
        { date: '03.22', description: '교회학교 교육과정 정비' },
        { date: '11.15', description: '연말 감사예배 및 선교헌신' },
      ],
    },
    {
      year: '1997년',
      events: [
        { date: '05.18', description: '지역 전도 네트워크 구축' },
        { date: '09.07', description: '기도사역팀 정식 출범' },
      ],
    },
    {
      year: '1996년',
      events: [
        { date: '01.14', description: '주일예배 체계 정비' },
        { date: '08.25', description: '청년 공동체 정식 출범' },
      ],
    },
    {
      year: '1995년',
      events: [
        { date: '04.09', description: '새가족 양육반 개설' },
        { date: '12.17', description: '지역 섬김 사역 정례화' },
      ],
    },
    {
      year: '1994년',
      events: [
        { date: '03.13', description: '주중 양육모임 확대' },
        { date: '10.30', description: '가정 단위 목양 시스템 도입' },
      ],
    },
    {
      year: '1993년',
      events: [
        { date: '06.06', description: '교회학교 봉사팀 조직' },
        { date: '11.21', description: '연말 이웃초청 주일 운영' },
      ],
    },
    {
      year: '1992년',
      events: [
        { date: '02.02', description: '새벽기도회 정례 운영' },
        { date: '09.13', description: '구역모임 중심 목회 강화' },
      ],
    },
    {
      year: '1991년',
      events: [
        { date: '05.12', description: '청소년 예배 모임 시작' },
        { date: '12.22', description: '성탄 전도행사 확대' },
      ],
    },
    {
      year: '1990년',
      events: [
        { date: '03.04', description: '정기 제자훈련 시작' },
        { date: '10.14', description: '지역 섬김 사역 기반 형성' },
      ],
    },
    {
      year: '1989년',
      events: [
        {
          date: '08.01',
          description: '여름 특별수련회 및 공동체 확장 예배',
          images: ['/data/history/19890801_1.png', '/data/history/19890801_2.png'],
        },
      ],
    },
    {
      year: '1988년',
      events: [
        { date: '04.10', description: '주일학교 조직 및 정기예배 정착' },
        { date: '11.06', description: '지역 전도팀 운영 시작' },
      ],
    },
    {
      year: '1987년',
      events: [
        {
          date: '08.01',
          description: '교회 설립 및 창립예배',
          images: ['/data/history/19870801_1.png'],
        },
        { date: '11.15', description: '복음 중심 공동체의 첫걸음 시작' },
      ],
    },
  ],
};

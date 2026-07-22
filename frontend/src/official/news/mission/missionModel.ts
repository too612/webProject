export type MissionarySummary = {
  country: string;
  countryFlag: string;
  missionaryName: string;
  sentYear: number;
  description: string;
};

export type PrayerLetter = {
  id: number;
  title: string;
  date: string;
  author: string;
  country: string;
  preview: string;
  content: string;
};

export type MissionContent = {
  headline: string;
  summary: string;
  missionaries: MissionarySummary[];
  letters: PrayerLetter[];
};

export const DEFAULT_MISSION_CONTENT: MissionContent = {
  headline: '선교지소식',
  summary:
    '다사랑교회가 후원하고 파송한 선교사님들의 소중한 이야기입니다. 기도와 후원으로 함께 동역해 주세요.',
  missionaries: [
    {
      country: '필리핀',
      countryFlag: 'PH',
      missionaryName: '김OO 이OO 선교사',
      sentYear: 2015,
      description: '마닐라 인근 지역아동센터 운영 및 교회 개척 사역',
    },
    {
      country: '캄보디아',
      countryFlag: 'KH',
      missionaryName: '박OO 최OO 선교사',
      sentYear: 2017,
      description: '프놈펜 인근 오지 마을 교회 개척 및 우물 지원 사역',
    },
    {
      country: '몽골',
      countryFlag: 'MN',
      missionaryName: '정OO 선교사',
      sentYear: 2018,
      description: '울란바토르 목회자 훈련원 운영 및 아동 교육 사역',
    },
    {
      country: '인도네시아',
      countryFlag: 'ID',
      missionaryName: '강OO 윤OO 선교사',
      sentYear: 2019,
      description: '메단 지역 의료선교 및 현지인 교회 협력 사역',
    },
  ],
  letters: [
    {
      id: 1,
      title: '필리핀에서 드리는 6월 기도편지',
      date: '2026-06-15',
      author: '김OO 선교사',
      country: '필리핀',
      preview: '마닐라 우기 속에서도 아이들의 밝은 웃음소리가 끊이지 않습니다. 지난달 시작한 영어캠프에 50명의 아이들이...',
      content: '마닐라 우기 속에서도 아이들의 밝은 웃음소리가 끊이지 않습니다. 지난달 시작한 영어캠프에 50명의 아이들이 참여했고, 그중 10명이 처음으로 교회를 찾았습니다. 현지 교회와의 협력이 점점 깊어지고 있어 감사합니다. 기도제목: 1) 우기철 센터 시설 보수 2) 아이들 건강과 안전 3) 현지 교사 충원',
    },
    {
      id: 2,
      title: '캄보디아 프놈펜 소식',
      date: '2026-05-28',
      author: '박OO 선교사',
      country: '캄보디아',
      preview: '세 번째 우물이 완공되었습니다. 마을 주민 200여 명이 깨끗한 물을 마실 수 있게 되었습니다...',
      content: '세 번째 우물이 완공되었습니다. 마을 주민 200여 명이 깨끗한 물을 마실 수 있게 되었습니다. 함께 기도해 주신 모든 분들께 감사드립니다. 우물 준공 예배에서 마을 어르신 세 분이 예수님을 영접하셨습니다. 기도제목: 1) 마을 지도자들과의 관계 2) 진행 중인 주택 개보수 3) 현지인 사역자 양성',
    },
    {
      id: 3,
      title: '몽골에서 온 봄소식',
      date: '2026-04-20',
      author: '정OO 선교사',
      country: '몽골',
      preview: '긴 겨울이 지나고 몽골 초원에 봄이 찾아왔습니다. 목회자 세미나에 30명의 현지 목회자들이 참석하여...',
      content: '긴 겨울이 지나고 몽골 초원에 봄이 찾아왔습니다. 목회자 세미나에 30명의 현지 목회자들이 참석하여 큰 은혜를 받았습니다. 특별히 이번 세미나에서는 셀 교회 모델에 대한 관심이 높았습니다. 기도제목: 1) 7월 예정된 여름 영어캠프 준비 2) 현지 목회자들의 지속적 성장 3) 재정적 필요 채움',
    },
    {
      id: 4,
      title: '인도네시아 메단 의료선교 보고',
      date: '2026-03-12',
      author: '강OO 선교사',
      country: '인도네시아',
      preview: '지난 2월 의료선교에서 500명 이상의 환자를 진료했습니다. 의사, 간호사, 약사로 구성된 15명의 팀이...',
      content: '지난 2월 의료선교에서 500명 이상의 환자를 진료했습니다. 의사, 간호사, 약사로 구성된 15명의 팀이 5일간 섬겼습니다. 치과 진료를 처음 받아본 주민들이 많아 특히 감동이 컸습니다. 기도제목: 1) 진료 후 전도된 분들의 신앙 정착 2) 9월 2차 의료선교 준비 3) 현지 의료진과의 협력',
    },
  ],
};
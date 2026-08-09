export type NewcomerFormData = {
  name: string;
  birthDate: string;
  contact: string;
  address: string;
  inviter: string;
  prayerTopic: string;
};

export type NextstepsRegistrationFlowStep = {
  step: string;
  title: string;
  detail: string;
};

export type NextstepsEducationGuideItem = {
  label: string;
  value: string;
};

export type NextstepsContent = {
  headline: string;
  summary: string;
  mainImageUrl: string;
  mainImageAlt: string;
  heroTitle: string[];
  heroSubtext: string[];
  registrationSubtitle: string;
  registrationText: string;
  registrationFlow: NextstepsRegistrationFlowStep[];
  educationGuide: NextstepsEducationGuideItem[];
  educationNote: string;
  educationContents: string[];
};

export const INITIAL_NEWCOMER_FORM: NewcomerFormData = {
  name: '',
  birthDate: '',
  contact: '',
  address: '',
  inviter: '',
  prayerTopic: '',
};

export const DEFAULT_NEXTSTEPS_CONTENT: NextstepsContent = {
  headline: '새가족 안내',
  summary:
    '처음 오신 분이 교회의 분위기와 메시지를 한 화면에서 편안하게 느낄 수 있도록 구성했습니다.',
  mainImageUrl: '/img/official/news/nextsteps/nextsteps_01.png',
  mainImageAlt: '새가족 안내 메인 이미지',
  heroTitle: [
    '평신도 사역자를 세우는 교회,',
    '오산교회에 오신 것을 환영합니다!',
  ],
  heroSubtext: [
    '당신은 사랑받기 위해 태어난 소중한 사람입니다.',
    '하나님과 함께하는 행복한 믿음의 여정, 오산교회가 함께하겠습니다.',
  ],
  registrationSubtitle: '오산교회 새가족 안내',
  registrationText:
    '오산교회에 처음 나오신 분들을 주의 이름으로 환영합니다. 아래 절차에 따라 등록해 주시기 바랍니다.',
  registrationFlow: [
    {
      step: '01',
      title: '등록카드 작성',
      detail: '4층, 5층 예배실 입구(3분 소요). 새가족팀에서 등록카드 작성.',
    },
    {
      step: '02',
      title: '사진 촬영',
      detail:
        '4층 대예배실 입구(1분 소요). 교역자와 담당자들의 원활한 등록과정과 확인을 위해 촬영.',
    },
    {
      step: '03',
      title: '주일예배/새가족 환영',
      detail:
        '대예배실(1시간 소요). 대예배실에서 예배 드림, 예배 중 광고 시간에 새가족 소개 및 환영 시간.',
    },
    {
      step: '04',
      title: '담임목사님 접견',
      detail:
        '3층 새가족영접실(301호)(약 20~30분 소요). 예배 후 안내로 접견, 교회안내문 증정.',
    },
    {
      step: '05',
      title: '점심 식사',
      detail:
        '1층 식당(약 30분 소요). 식사 가능 시간에 따라 2부, 3부 예배 등록한 분에 한함.',
    },
  ],
  educationGuide: [
    {
      label: '일시',
      value: '매주일 2부, 3부 예배 후(10:35~, 12:35~ / 20분 소요)',
    },
    { label: '장소', value: '1층 새가족실(102호)' },
    {
      label: '대상',
      value: '오산교회 등록하신 모든 분들은 직분과 상관없이 들으시게 되어 있습니다.',
    },
  ],
  educationNote:
    '1과~4과로 되어 있으며 매달 같은 내용이 반복되어 결석한 주는 다음 달 그 주에 들으시면 수료하실 수 있습니다.',
  educationContents: [
    '나는 누구인가?',
    '하나님은 어떤 분이신가?',
    '예수님은 누구신가?',
    '어떻게 구원받을 수 있는가?',
  ],
};
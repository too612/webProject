export type RegistrationStep = {
  step: number;
  title: string;
  description: string;
};

export type Greeter = {
  name: string;
  role: string;
  greeting: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type MinistryHighlight = {
  title: string;
  icon: string;
  description: string;
  linkPath: string;
};

export type NewcomerFormData = {
  name: string;
  birthDate: string;
  contact: string;
  address: string;
  inviter: string;
  prayerTopic: string;
};

export type NextstepsContent = {
  headline: string;
  welcomeMessage: string;
  welcomeSubtext: string;
  establishedYear: number;
  visionStatement: string;
  churchSize: string;
  worshipTimes: { day: string; time: string; description: string }[];
  steps: RegistrationStep[];
  ministries: MinistryHighlight[];
  faqs: FaqItem[];
  greeters: Greeter[];
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
  headline: '새가족안내',
  welcomeMessage: '다사랑교회에 오신 것을 환영합니다',
  welcomeSubtext:
    '하나님의 사랑 안에서 여러분을 진심으로 환영합니다. 다사랑교회는 여러분의 신앙 여정에 함께하는 따뜻한 공동체입니다.',
  establishedYear: 2010,
  visionStatement: '말씀과 사랑으로 도시와 다음 세대를 세우는 교회',
  churchSize: '약 500명',
  worshipTimes: [
    { day: '주일 1부', time: '오전 9:00', description: '정결한 마음으로 드리는 경건 예배' },
    { day: '주일 2부', time: '오전 11:00', description: '찬양과 말씀이 살아있는 본예배 (주일학교 병행)' },
    { day: '주일 3부', time: '오후 2:00', description: '청년부 예배 (2030 세대)' },
    { day: '수요일', time: '저녁 7:30', description: '말씀과 기도에 집중하는 수요예배' },
    { day: '새벽기도', time: '오전 5:30', description: '매주 화-금 새벽 예배 (월요일 휴무)' },
  ],
  steps: [
    {
      step: 1,
      title: '1주차 / 환영과 만남',
      description: '새가족 환영실에서 담당 교역자 및 새가족부 섬김이들과 첫 만남을 가집니다. 교회 둘러보기와 함께 간단한 다과를 나눕니다.',
    },
    {
      step: 2,
      title: '2주차 / 교회 알아가기',
      description: '다사랑교회의 비전, 예배, 사역에 대해 소개받고, 원하는 사역 부서와 셀가족을 탐색합니다.',
    },
    {
      step: 3,
      title: '3주차 / 신앙 기초',
      description: '구원의 확신과 기도의 삶에 대해 나누고, 새가족 양육반 등록을 안내받습니다.',
    },
    {
      step: 4,
      title: '4주차 / 공동체와의 연결',
      description: '셀가족(구역/목장)에 직접 참여하여 공동체 구성원들과 교제하고, 함께할 소그룹을 선택합니다.',
    },
    {
      step: 5,
      title: '5주차 / 등록과 축복',
      description: '정식 등록 후 축복 기도 시간을 갖고, 등록 기념 선물과 함께 교회 가족으로서의 첫걸음을 축하합니다.',
    },
  ],
  ministries: [
    {
      title: '찬양대',
      icon: '🎵',
      description: '주일 예배 찬양과 성가대로 섬기며, 매주 수요일 연습을 통해 예배를 준비합니다.',
      linkPath: '/training/servicegroup',
    },
    {
      title: '주일학교',
      icon: '👶',
      description: '유아부부터 초등부까지 아이들 눈높이에 맞춘 예배와 말씀 교육을 제공합니다.',
      linkPath: '/nextgen/school',
    },
    {
      title: '청년부',
      icon: '🔥',
      description: '2030 청년들이 함께 예배하고 교제하며 다음 세대 리더로 성장합니다.',
      linkPath: '/nextgen/youth',
    },
    {
      title: '셀가족',
      icon: '🏠',
      description: '구역과 목장 단위로 모여 말씀과 교제로 하나 되는 소그룹 공동체입니다.',
      linkPath: '/training/cellgroup',
    },
    {
      title: '양육훈련',
      icon: '📖',
      description: '두날개 프로세스를 통해 체계적 신앙 성장을 돕는 제자 훈련 과정입니다.',
      linkPath: '/training/course',
    },
    {
      title: '해외선교',
      icon: '🌍',
      description: '필리핀, 캄보디아, 몽골 등 열방을 향한 단기선교와 아웃리치에 함께합니다.',
      linkPath: '/training/outreach',
    },
  ],
  faqs: [
    {
      question: '교회에 처음 가는데, 어떻게 입으면 되나요?',
      answer: '편안한 복장으로 오시면 됩니다. 정장이나 특별한 복장 규정은 없습니다. 대부분의 성도님들이 캐주얼한 옷차림으로 예배에 참석하고 계십니다.',
    },
    {
      question: '예배 시간에 늦으면 들어갈 수 없나요?',
      answer: '언제든지 들어오실 수 있습니다. 예배 중간에라도 편안하게 입장하세요. 안내 위원이 빈자리로 안내해 드립니다.',
    },
    {
      question: '아이들과 함께 가도 되나요? 돌봄 서비스가 있나요?',
      answer: '물론입니다. 주일 2부 예배(오전 11시) 시간에 맞춰 유아부(0-4세), 유치부(5-7세), 초등부(1-6학년) 예배가 본당 2층에서 진행됩니다. 예배실 입구에서 교사들이 아이들을 맞이합니다.',
    },
    {
      question: '주차는 어디에 하나요?',
      answer: '교회 건물 지하 1-2층에 주차장이 있습니다. 주일에는 인근 공영주차장도 무료로 이용하실 수 있습니다. 안내 위원에게 문의하시면 주차 안내를 도와드립니다.',
    },
    {
      question: '교회 등록은 어떻게 하나요?',
      answer: '예배 후 새가족 환영실에 들러 등록 카드를 작성하시면 됩니다. 또는 이 페이지 하단의 온라인 등록 폼을 이용하실 수도 있습니다. 등록하시면 담당 교역자가 연락드려 5주 과정을 안내해 드립니다.',
    },
    {
      question: '헌금은 꼭 해야 하나요? 얼마를 해야 하나요?',
      answer: '헌금은 감사의 표현이지 의무가 아닙니다. 처음 오신 분들은 마음에 부담을 느끼지 않으셔도 됩니다. 헌금 액수는 정해져 있지 않으며, 각자의 형편과 마음에 따라 드리시면 됩니다.',
    },
  ],
  greeters: [
    {
      name: '김OO',
      role: '새가족부 담당교역자',
      greeting: '반갑습니다! 편안한 마음으로 오세요. 여러분의 정착을 위해 최선을 다하겠습니다.',
    },
    {
      name: '이OO',
      role: '새가족부 부장',
      greeting: '처음 오신 분들의 긴장을 풀어드리는 게 제 일입니다. 언제든 편하게 말 걸어 주세요.',
    },
    {
      name: '박OO',
      role: '새가족부 섬김이',
      greeting: '혼자 오셔도 걱정 마세요. 예배 자리부터 셀 모임까지 친절하게 안내해 드립니다.',
    },
    {
      name: '최OO',
      role: '새가족부 섬김이',
      greeting: '주일마다 새 얼굴을 뵙는 게 제일 큰 기쁨입니다. 교회 곳곳을 함께 둘러보며 따뜻한 시간 보내요.',
    },
  ],
};
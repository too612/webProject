export type NextstepsStepImage = {
  src: string;
  alt: string;
};

export type NextstepsStep = {
  step: string;
  title: string;
  detail: string;
  columns: 2 | 3;
  images: NextstepsStepImage[];
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
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDefinition: string;
  steps: NextstepsStep[];
  educationGuide: NextstepsEducationGuideItem[];
  educationNote: string;
  educationContents: string[];
};

export const DEFAULT_NEXTSTEPS_CONTENT: NextstepsContent = {
  headline: '새가족 안내',
  summary:
    '처음 오신 분이 교회의 분위기와 메시지를 한 화면에서 편안하게 느낄 수 있도록 구성했습니다.',
  mainImageUrl: '/img/official/news/nextsteps/nextsteps_01.png',
  mainImageAlt: '새가족 안내 메인 이미지',
  welcomeTitle: 'WELCOME! 새가족 여러분을 주님의 이름으로 환영합니다.',
  welcomeSubtitle: '첫 교회방문부터 새가족 등록 방법까지 자세하게 안내해드립니다.',
  welcomeDefinition:
    '예수그리스도를 믿기 위해서 처음 교회에 나오신 분이나 다른 교회에서 신앙생활 열심히 하시다 이사 및 개인의 사정 등으로 다사랑교회에 출석하고, 새롭게 신앙생활하기 위해 등록에 필요한 양육과정을 밟고 있는 분들을 새가족(New Family)이라고 부릅니다.',
  steps: [
    {
      step: '01',
      title: '새가족등록',
      detail:
        '다사랑교회의 한 가족이 되길 원하시는 분은 예배 드리기 전 안내데스크에서 등록카드를 작성해주시고 예배당에 들어오시면서 안내 위원들에게 등록카드를 제출해 주시면 등록 절차가 진행됩니다.',
      columns: 2,
      images: [],
    },
    {
      step: '02',
      title: '환영·영접',
      detail:
        '예배 후 담임 목사님과의 만남이 있습니다. 이때 섬겨주실 새가족 섬김이와도 만나게 됩니다. 이 만남 후 정식 다사랑교회 교인으로 등록이 됩니다. 온라인으로 등록을 하시는 분들은 개별적으로 교회에 방문하여 담임목사님과의 만남을 가지시길 바랍니다.',
      columns: 2,
      images: [],
    },
    {
      step: '03',
      title: '1:1 섬김이',
      detail:
        '다사랑교회는 등록하신 성도님들의 편안한 정착을 돕기 위해, 등록하신 모든 장년 새가족에게 1:1로 새가족 섬김이를 연결해 드립니다. 매주 섬김이가 새가족과의 축복된 만남을 기다리고 있으며, 행복한 신앙생활을 잘 시작하실 수 있도록 최선을 다해 도와드릴 것입니다.',
      columns: 3,
      images: [],
    },
    {
      step: '04',
      title: '새가족수료',
      detail:
        '등록 후 새가족 섬김이를 통해 섬김을 받으시고 4주가 지나시게 되면 온 교회가 다시 한 번 더 격식을 갖추어 새가족을 환영하고 축복하는 시간을 갖습니다. 이 새가족 수료식은 매월 셋째주 주일 오후 찬양 예배 시에 있습니다.',
      columns: 2,
      images: [],
    },
    {
      step: '05',
      title: '사랑방 모임',
      detail:
        "모든 새가족은 수료 후 '사랑방' 과정에 입학하여 더 큰 은혜와 축복을 누리게 됩니다. '사랑방'은 '영적 성장이 축복입니다'라는 주제로 8주간 진행되는데, 이 시간은 하나님께서 우리에게 부어주실 사랑과 축복을 담는 영적인 그릇을 준비하는 시간입니다. 비슷한 시기에 등록한 새가족 수료 동기들과 10~12명의 소그룹을 이루어 함께 하기에 더욱 은혜롭고 재미있는 시간이 될 것입니다.",
      columns: 3,
      images: [],
    },
    {
      step: '06',
      title: '세례식',
      detail:
        '사랑방은 세례를 위한 교육은 아니지만, 사랑방 과정을 수료하신 분들이 세례를 받을만한 충분한 믿음을 가질 수 있기에 사랑방 수료를 세례 받으실 수 있는 기준으로 삼고 있습니다.',
      columns: 2,
      images: [],
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
      value: '다사랑교회에 등록하신 모든 분들은 직분과 상관없이 들으시게 되어 있습니다.',
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
export type VisionCard = {
  title: string;
  description: string;
};

export type VisionContent = {
  headline: string;
  summary: string;
  coreVisions: VisionCard[];
  ministryDirections: string[];
  bibleVerse: string;
};

export const DEFAULT_VISION_CONTENT: VisionContent = {
  headline: '건강한 교회 행복한 성도',
  summary:
    '우리 교회는 예배와 말씀, 사랑과 섬김을 통해 도시와 다음 세대를 세워가는 공동체가 되기를 꿈꿉니다.',
  coreVisions: [
    {
      title: '예배',
      description: '진리와 영으로 드리는 예배가 삶의 중심이 되도록 돕습니다.',
    },
    {
      title: '제자훈련',
      description: '말씀과 삶을 통합하는 성숙한 제자를 세우는 데 집중합니다.',
    },
    {
      title: '공동체',
      description: '서로 사랑하고 돌보는 가족 같은 공동체를 지향합니다.',
    },
    {
      title: '선교와 섬김',
      description: '지역과 열방을 향한 복음 전파와 섬김에 힘씁니다.',
    },
  ],
  ministryDirections: [
    '균형 잡힌 예배와 교육을 통해 신앙의 기초를 세웁니다.',
    '가정과 일터에서도 신앙이 살아 움직이도록 돕습니다.',
    '다음 세대가 꿈과 소명을 발견하도록 함께 동행합니다.',
    '지역사회와 협력하여 따뜻한 변화를 만들어갑니다.',
  ],
  bibleVerse:
    '"너희는 가서 모든 민족을 제자로 삼아... 내가 너희와 항상 함께 있으리라" (마 28:19-20)',
};

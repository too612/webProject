export type HeroConfig = {
  enabled: boolean;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  compact?: boolean;
};

const OFFICIAL_HERO_BY_PATH: Array<{
  match: (path: string) => boolean;
  subtitle: string;
  imageUrl: string;
}> = [
  {
    match: (path) => path.startsWith('/about'),
    subtitle: '교회의 비전과 신앙의 방향을 소개합니다.',
    imageUrl: '/img/hero/official-about.webp',
  },
  {
    match: (path) => path.startsWith('/worship'),
    subtitle: '예배 시간과 설교 콘텐츠를 확인하세요.',
    imageUrl: '/img/hero/official-worship.webp',
  },
  {
    match: (path) => path.startsWith('/ministries'),
    subtitle: '다양한 사역과 섬김의 현장을 안내합니다.',
    imageUrl: '/img/hero/official-ministries.webp',
  },
  {
    match: (path) => path.startsWith('/news'),
    subtitle: '교회 소식과 공지, 행사 정보를 전합니다.',
    imageUrl: '/img/hero/official-news.webp',
  },
  {
    match: (path) => path.startsWith('/support'),
    subtitle: '찾아오시는 길과 문의 안내를 제공합니다.',
    imageUrl: '/img/hero/official-support.webp',
  },
];

const COMMUNITY_HERO_BY_PATH: Array<{
  match: (path: string) => boolean;
  subtitle: string;
  imageUrl: string;
}> = [
  {
    match: (path) => path.startsWith('/community/group'),
    subtitle: '소그룹 공동체의 모임과 사역을 확인하세요.',
    imageUrl: '/img/hero/community-group.webp',
  },
  {
    match: (path) => path.startsWith('/community/facilities'),
    subtitle: '교회 시설 안내와 이용 정보를 제공합니다.',
    imageUrl: '/img/hero/community-facilities.webp',
  },
  {
    match: (path) => path.startsWith('/community/saint'),
    subtitle: '성도 지원과 돌봄 사역을 안내합니다.',
    imageUrl: '/img/hero/community-saint.webp',
  },
  {
    match: (path) => path.startsWith('/community/world'),
    subtitle: '세상읽기 콘텐츠와 묵상 자료를 확인하세요.',
    imageUrl: '/img/hero/community-world.webp',
  },
];

function getOfficialHero(pathname: string, menuName: string): HeroConfig {
  const matched = OFFICIAL_HERO_BY_PATH.find((item) => item.match(pathname));
  if (!matched) {
    return {
      enabled: true,
      title: menuName,
      subtitle: '믿음 안에서 함께 성장하는 길을 안내합니다.',
    };
  }

  return {
    enabled: true,
    title: menuName,
    subtitle: matched.subtitle,
    imageUrl: matched.imageUrl,
  };
}

function getCommunityHero(pathname: string, menuName: string): HeroConfig {
  const matched = COMMUNITY_HERO_BY_PATH.find((item) => item.match(pathname));
  if (!matched) {
    return {
      enabled: true,
      title: menuName,
      subtitle: '공동체 소식과 활동 정보를 확인할 수 있습니다.',
    };
  }

  return {
    enabled: true,
    title: menuName,
    subtitle: matched.subtitle,
    imageUrl: matched.imageUrl,
  };
}

export function resolveHeroConfig(pathname: string, menuName: string): HeroConfig {
  if (!menuName) {
    return { enabled: false, title: '' };
  }

  if (pathname.startsWith('/erp')) {
    return {
      enabled: true,
      title: menuName,
      subtitle: '업무 데이터를 빠르게 조회하고 관리할 수 있습니다.',
      compact: true,
    };
  }

  if (pathname.startsWith('/system')) {
    return { enabled: false, title: menuName };
  }

  if (pathname.startsWith('/mypage')) {
    return {
      enabled: true,
      title: menuName,
      subtitle: '개인 설정과 활동 내역을 간편하게 관리하세요.',
      compact: true,
    };
  }

  if (pathname.startsWith('/community')) {
    return getCommunityHero(pathname, menuName);
  }

  return getOfficialHero(pathname, menuName);
}

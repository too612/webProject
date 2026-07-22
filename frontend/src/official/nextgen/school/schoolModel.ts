export type SchoolActivity = {
  region: string;
  title: string;
  description: string;
};

export type SchoolPageContent = {
  headline: string;
  summary: string;
  activities: SchoolActivity[];
};

export const DEFAULT_SCHOOL_PAGE_CONTENT: SchoolPageContent = {
  headline: "주일학교 비전",
  summary:
    "한 아이의 오늘이 하나님 안에서 안전하고 기쁘게 자라가도록, 예배와 관계와 습관을 함께 세웁니다.",
  activities: [],
};

export const SCHOOL_BASE_PATH = "/nextgen/school";
export const SCHOOL_API_BASE_PATH = "/official/nextgen/school";

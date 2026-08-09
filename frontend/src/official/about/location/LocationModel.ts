export type LocationInfo = {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  hours: string;
  notice: string;
  naverMapUrl: string;
  kakaoMapUrl: string;
  lat?: number;
  lng?: number;
};

export type LocationTrafficGuide = {
  bus: string;
  subway: string;
  parking: string;
};

export type LocationPageContent = {
  headline: string;
  summary: string;
  traffic: LocationTrafficGuide;
};

export const DEFAULT_LOCATION_PAGE_CONTENT: LocationPageContent = {
  headline: "오시는 길",
  summary:
    "교회 위치와 교통 안내를 확인하세요. 하나님이 기뻐하시는 다사랑교회입니다.",
  traffic: {
    bus: "오산역/오산터미널에서 7번, 8번 버스 탑승 후 '오산초등학교' 하차 (도보 3분)",
    subway: "1호선 오산역 1번 출구에서 택시 이용 시 약 5분 소요",
    parking: "교회 건물 내 지하 주차장 및 인근 공영 주차장 이용 가능",
  },
};
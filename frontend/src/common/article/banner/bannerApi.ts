/**
 * File Name   : bannerApi
 * Description : 배너 관리 전용 API
 * -----------------------------------------------------------------------------
 * 팝업/슬라이드 조회 및 순서 변경 API를 제공합니다.
 */
import { articleApi } from "../ArticleApi";

export const bannerApi = {
  // 배너 목록 조회 (팝업/슬라이드)
  getBanners: (type: "POPUP" | "SLIDE", limit?: number) => {
    return articleApi.getBanners(type, limit);
  },

  // 슬라이드 순서 변경 (드래그 앤 드롭)
  reorderSlides: (slideIds: number[]) => {
    return articleApi.reorderSlides(slideIds);
  },
};

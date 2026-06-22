/**
 * File Name   : bannerModel
 * Description : 배너 관리 타입 정의 및 상수
 */
export const BANNER_BASE_PATH = '/news/banner';

export const BANNER_API_BASE_PATH = '/official/news/banner';

export type BannerType = 'POPUP' | 'SLIDE';

export interface BannerDto {
  rqstNo: string;
  title: string;
  cont: string;
  boardType: BannerType;
  useYn: string;
  insDt: string;
  uptDt: string;
  views: number;
  fileList?: Array<{
    fileId: string;
    fileName: string;
    fileUrl: string;
  }>;
}

export interface BannerRequest {
  rqstNo?: string;
  title: string;
  cont?: string;
  boardType: BannerType;
  useYn: string;
}
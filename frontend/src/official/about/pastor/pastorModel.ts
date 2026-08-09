/**
 * File Name   : pastorModel
 * Description : 목회자소개 도메인 타입/요청 모델 정의
 */

import type { AttachmentFile } from '../../../common/attachment/attachmentModel';

/****************************************************************************************************
 * type method (도메인 타입, 요청/응답 계약)
 ****************************************************************************************************/

export type PastorDisplayMode = 'single-image' | 'split-editor-image';

export type Pastor = {
  corpId: number;
  corpName: string;
  businessRegistrationNumber: string;
  chiefName: string;
  displayMode?: PastorDisplayMode;
  phoneNumber?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  introduction?: string;
  updatedAt?: string;
  fileList?: AttachmentFile[];
};

export type PastorRequest = {
  corpName: string;
  businessRegistrationNumber: string;
  chiefName: string;
  displayMode?: PastorDisplayMode;
  phoneNumber?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  introduction?: string;
  deletedFileIds?: Array<string | number>;
  createdBy?: string;
  updatedBy?: string;
};

/****************************************************************************************************
 * config/constant method (비DB 기본값, 타입가드, 페이지 표시 콘텐츠)
 ****************************************************************************************************/

export const DEFAULT_DISPLAY_MODE: PastorDisplayMode = 'split-editor-image';

export const isDisplayMode = (value?: string): value is PastorDisplayMode =>
  value === 'single-image' || value === 'split-editor-image';

export const resolveDisplayMode = (value?: string): PastorDisplayMode =>
  isDisplayMode(value) ? value : DEFAULT_DISPLAY_MODE;

export const INITIAL_PASTOR_REQUEST: PastorRequest = {
  corpName: '기관정보',
  businessRegistrationNumber: '-',
  chiefName: '담임목사',
  displayMode: DEFAULT_DISPLAY_MODE,
  introduction: '',
  updatedBy: 'system',
};

export type PastorContent = {
  headline: string;
  summary: string;
};

export const DEFAULT_PASTOR_CONTENT: PastorContent = {
  headline: '목회자소개',
  summary:
    '말씀과 섬김으로 공동체를 이끄는 담임목사 소개와 사역 방향을 안내합니다.',
};

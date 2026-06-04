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

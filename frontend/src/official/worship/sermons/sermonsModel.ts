/**
 * File Name   : sermonsModel
 * Description : 설교 도메인 전용 타입 및 상수 정의
 */

// ===== API 경로 상수 =====
export const SERMONS_BASE_PATH = '/worship/sermons';
export const SERMONS_API_BASE_PATH = '/official/worship/sermons'; // ← 이 줄이 반드시 있어야 함

// ===== 백엔드 SermonDto / SermonRequest 기준 타입 =====
export interface SermonItem {
  rqstNo?: string;
  title?: string;
  cont?: string;
  rqstId?: string;
  preacherName?: string;
  scriptureReference?: string;
  sermonDate?: string;
  worshipType?: string;
  insDt?: string;
  uptDt?: string;
  views?: number;
  boardType?: string;
  groupNo?: string;
  parentNo?: string;
  depth?: number;
  orderNo?: number;
  secret?: string;
  password?: string;
  hasFile?: boolean;
  fileList?: SermonFileItem[];
  totalFileSize?: number;
  commentCount?: number;
}

export interface SermonFileItem {
  fileId: string | number;
  orgFileNm?: string;
  storedFileNm?: string;
  fileSize?: number;
  filePath?: string;
  insDt?: string;
}

export interface SermonListItem {
  id: string | number;
  rowNum: number;
  worshipType: string;
  title: string;
  author: string;
  date: string;
  views: number;
  commentCount: number;
  secret?: boolean;
  hasFile?: boolean;
  depth: number;
}
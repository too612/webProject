export interface AttachmentFile {
  fileId: string | number;
  orgFileNm?: string;
  fileSize?: number;
}

export interface ArticleItem {
  articleId: number;
  articleUuid: string;
  title: string;
  contentHtml: string;
  contentText: string;
  authorId: string;
  menuKey: string;
  templateCode: string;
  parentId?: number;
  groupId?: number;
  depth: number;
  orderNo: number;
  isSecret: boolean;
  passwordHash?: string;
  viewCount: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metadata: Record<string, any> | string;
  summaryText?: string;
  keywordsJson?: any;
  aiLanguageCode?: string;
  aiReady: boolean;
  createdAt: string;
  updatedAt: string;
  isNotice?: boolean;
  noticeStartDt?: string;
  noticeEndDt?: string;
  isPopup?: boolean;
  popupStartDt?: string;
  popupEndDt?: string;
  popupLinkUrl?: string;
  thumbnailFileId?: number;
  fileCount?: number;
  fileList: AttachmentFile[];
  commentCount: number;
  firstFileId?: number;
  // ★ 팝업 '안보기' 옵션
  popupDismissOption?: string; // 'NONE' | 'HOURS_4' | 'DAY' | 'WEEK'
}

export interface PrevNextItem {
  prevId: number | null;
  nextId: number | null;
  prevTitle: string | null;
  nextTitle: string | null;
}

export interface ArticleListQuery {
  menuKey?: string;
  templateCode?: string;
  page?: number;
  size?: number;
  searchType?: string;
  keyword?: string;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ArticleWriteForm {
  title: string;
  author: string;
  content: string;
  password: string;
  confirmPassword: string;
  secret: boolean;
  menuKey: string;
  templateCode: string;
  parentId?: number;
  metadata: Record<string, any>;
  isNotice?: boolean;
  noticeStartDt?: string;
  noticeEndDt?: string;
  isPopup?: boolean;
  popupStartDt?: string;
  popupEndDt?: string;
  popupLinkUrl?: string;
  thumbnailFileId?: number;
}

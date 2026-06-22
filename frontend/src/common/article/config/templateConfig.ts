// ============================================================
// 1. 필드 설정
// ============================================================
export interface FieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "date"
    | "datetime"
    | "number"
    | "boolean";
  layout?: "full" | "half" | "third";
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  description?: string;
  rows?: number;
  defaultValue?: any;
  hidden?: boolean;
}

// ============================================================
// 2. Write 설정
// ============================================================
export interface WriteConfig {
  extraFields: FieldConfig[];
  features: {
    useEditor: boolean;
    useAttachment: "none" | "multiple" | "single-image";
    useComment: boolean;
    useSecret: boolean;
    useAuthor: boolean;
    usePassword: boolean;
    useCategory: boolean;
  };
  attachmentLimits?: {
    maxFiles?: number;
    maxFileSize?: number;
    allowedExtensions?: string[];
  };
  buttons?: {
    save?: { id: string; label: string; visible?: boolean };
    cancel?: { id: string; label: string; visible?: boolean };
  };
}

// ============================================================
// 3. List 설정
// ============================================================
export interface ListConfig {
  viewMode: "grid" | "gallery" | "timeline" | "list";
  pagination: boolean;
  pageSize: number;
  searchable: boolean;
  searchFields: { value: string; label: string }[];
  sortable: boolean;
  defaultSortField?: string;
  defaultSortOrder?: "ASC" | "DESC";
  columns?: any[];
  hideColumns?: string[];
  excelDownload?: boolean;
  defaultSearchType?: string;
  defaultFilters?: Record<string, any>;
  buttons?: {
    write?: { id: string; label: string; visible?: boolean };
    excel?: { id: string; label: string; visible?: boolean };
    search?: { id: string; label: string; visible?: boolean };
  };
  cardConfig?: {
    aspectRatio: "4:3" | "square" | "16:9";
    imageField: "thumbnail_file_id" | "firstImageFromContent";
    titleField: string;
    showDescription: boolean;
    cardWidth?: number;
    cardHeight?: number;
  };
}

// ============================================================
// 4. View 설정
// ============================================================
export interface ViewConfig {
  showPrevNext: boolean;
  showLike: boolean;
  showReport: boolean;
  showShare: boolean;
  showComment: boolean;
  commentSort: "latest" | "recommend";
  showMetaFields: boolean;
  metaLayout: "card" | "inline";
  buttons?: {
    list?: { id: string; label: string; visible?: boolean };
    reply?: { id: string; label: string; visible?: boolean };
    edit?: { id: string; label: string; visible?: boolean };
    delete?: { id: string; label: string; visible?: boolean };
  };
  comment?: {
    show: boolean;
    sort: "latest" | "recommend";
    allowSecret: boolean;
    allowSpoiler: boolean;
    requireLogin: boolean;
  };
  secret?: {
    enabled: boolean;
    requirePassword: boolean;
  };
  imageOnly?: {
    enabled: boolean;
    showTitle: boolean;
  };
}

// ============================================================
// 5. 전체 템플릿 설정
// ============================================================
export interface ArticleTemplateConfig {
  menuKey: string;
  templateCode: string;
  title: string;
  description?: string;
  list: ListConfig;
  view: ViewConfig;
  write: WriteConfig;
}

// ============================================================
// 6. ButtonConfig 타입
// ============================================================
export type ButtonConfig = {
  id: string;
  label: string;
  visible?: boolean;
};

// ============================================================
// 7. 기본값 (DEFAULT)
// ============================================================
export const DEFAULT_ARTICLE_CONFIG: ArticleTemplateConfig = {
  menuKey: "DEFAULT",
  templateCode: "DEFAULT",
  title: "게시판",
  list: {
    viewMode: "grid",
    pagination: true,
    pageSize: 10,
    searchable: true,
    searchFields: [
      { value: "title", label: "제목" },
      { value: "author", label: "작성자" },
      { value: "content", label: "내용" },
    ],
    sortable: false,
    hideColumns: [],
    excelDownload: false,
    defaultSearchType: "title",
    defaultFilters: {},
    buttons: {
      write: { id: "btn_write", label: "글쓰기", visible: true },
      search: { id: "btn_search", label: "검색", visible: true },
      excel: {
        id: "btn_excel_download",
        label: "엑셀 다운로드",
        visible: false,
      },
    },
    cardConfig: {
      aspectRatio: "4:3",
      imageField: "thumbnail_file_id",
      titleField: "title",
      showDescription: false,
      cardWidth: 280,
    },
  },
  view: {
    showPrevNext: false,
    showLike: false,
    showReport: false,
    showShare: false,
    showComment: true,
    commentSort: "latest",
    showMetaFields: true,
    metaLayout: "card",
    buttons: {
      list: { id: "btn_list", label: "목록", visible: true },
      reply: { id: "btn_reply", label: "답글 작성", visible: true },
      edit: { id: "btn_edit", label: "수정", visible: true },
      delete: { id: "btn_delete", label: "삭제", visible: true },
    },
    comment: {
      show: true,
      sort: "latest",
      allowSecret: false,
      allowSpoiler: false,
      requireLogin: false,
    },
    secret: {
      enabled: false,
      requirePassword: true,
    },
    imageOnly: {
      enabled: false,
      showTitle: true,
    },
  },
  write: {
    extraFields: [],
    features: {
      useEditor: true,
      useAttachment: "multiple",
      useComment: true,
      useSecret: true,
      useAuthor: true,
      usePassword: true,
      useCategory: false,
    },
    attachmentLimits: {
      maxFiles: 5,
      maxFileSize: 20 * 1024 * 1024,
      allowedExtensions: [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "pdf",
        "doc",
        "docx",
        "hwp",
      ],
    },
    buttons: {
      save: { id: "btn_save", label: "저장하기", visible: true },
      cancel: { id: "btn_cancel", label: "취소", visible: true },
    },
  },
};

// ============================================================
// 8. Config Registry
// ============================================================
import { ARTICLE_DEFAULT_CONFIG } from "./templates/ArticleDefault";
import { ARTICLE_PINNABLE_CONFIG } from "./templates/ArticlePinnable";
import { ARTICLE_GALLERY_CONFIG } from "./templates/ArticleGallery";
import { ARTICLE_SINGLE_IMAGE_CONFIG } from "./templates/ArticleSingleImage";
import { ARTICLE_POPUP_CONFIG } from "./templates/ArticlePopup";
import { ARTICLE_SLIDE_CONFIG } from "./templates/ArticleSlide";

const CONFIG_REGISTRY: Record<string, ArticleTemplateConfig> = {
  DEFAULT: ARTICLE_DEFAULT_CONFIG,
  PINNABLE: ARTICLE_PINNABLE_CONFIG,
  GALLERY: ARTICLE_GALLERY_CONFIG,
  SINGLE_IMAGE: ARTICLE_SINGLE_IMAGE_CONFIG,
  POPUP: ARTICLE_POPUP_CONFIG,
  SLIDE: ARTICLE_SLIDE_CONFIG,
};

export function getArticleTemplateConfig(
  templateCode: string,
): ArticleTemplateConfig {
  return CONFIG_REGISTRY[templateCode] || DEFAULT_ARTICLE_CONFIG;
}

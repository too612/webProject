import { ArticleTemplateConfig } from "../templateConfig";

export const ARTICLE_SLIDE_CONFIG: ArticleTemplateConfig = {
  menuKey: "BANNER",
  templateCode: "SLIDE",
  title: "슬라이드 관리",
  description: "메인 페이지 슬라이드 배너를 관리합니다.",

  list: {
    viewMode: "gallery",
    pagination: true,
    pageSize: 12,
    searchable: true,
    searchFields: [{ value: "title", label: "제목" }],
    sortable: true,
    defaultSortField: "order_no",
    defaultSortOrder: "ASC",
    hideColumns: ["status", "views", "commentCount"],
    excelDownload: true,
    defaultSearchType: "title",
    defaultFilters: {},
    buttons: {
      write: { id: "btn_write", label: "슬라이드 등록", visible: true },
      search: { id: "btn_search", label: "검색", visible: true },
      excel: {
        id: "btn_excel_download",
        label: "엑셀 다운로드",
        visible: true,
      },
    },
    cardConfig: {
      aspectRatio: "16:9",
      imageField: "thumbnail_file_id",
      titleField: "title",
      showDescription: false,
      cardWidth: 320,
    },
  },

  view: {
    showPrevNext: false,
    showLike: false,
    showReport: false,
    showShare: false,
    showComment: false,
    commentSort: "latest",
    showMetaFields: true,
    metaLayout: "inline",
    buttons: {
      list: { id: "btn_list", label: "목록", visible: true },
      reply: { id: "btn_reply", label: "답글 작성", visible: false },
      edit: { id: "btn_edit", label: "수정", visible: true },
      delete: { id: "btn_delete", label: "삭제", visible: true },
    },
    comment: {
      show: false,
      sort: "latest",
      allowSecret: false,
      allowSpoiler: false,
      requireLogin: false,
    },
    secret: {
      enabled: false,
      requirePassword: false,
    },
    imageOnly: {
      enabled: false,
      showTitle: true,
    },
  },

  write: {
    extraFields: [
      {
        key: "slideLink",
        label: "이동 링크 URL",
        type: "text",
        layout: "full",
        placeholder: "https://...",
      },
      {
        key: "slideOrder",
        label: "순서",
        type: "number",
        layout: "half",
        defaultValue: 0,
        description: "숫자가 작을수록 먼저 노출됩니다.",
      },
    ],
    features: {
      useEditor: false,
      useAttachment: "single-image",
      useComment: false,
      useSecret: false,
      useAuthor: true,
      usePassword: false,
      useCategory: false,
    },
    attachmentLimits: {
      maxFiles: 1,
      maxFileSize: 20 * 1024 * 1024,
      allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
    },
    buttons: {
      save: { id: "btn_save", label: "저장하기", visible: true },
      cancel: { id: "btn_cancel", label: "취소", visible: true },
    },
  },
};

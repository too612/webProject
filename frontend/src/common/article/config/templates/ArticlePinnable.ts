import { ArticleTemplateConfig } from "../templateConfig";

export const ARTICLE_PINNABLE_CONFIG: ArticleTemplateConfig = {
  menuKey: "PINNABLE",
  templateCode: "PINNABLE",
  title: "공지사항",
  description: "교회 공지사항 (상단 고정, 기간 설정)",

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
    sortable: true,
    defaultSortField: "is_notice",
    defaultSortOrder: "DESC",
    hideColumns: ["status"],
    excelDownload: true,
    defaultSearchType: "title",
    defaultFilters: {},
    buttons: {
      write: { id: "btn_write", label: "글쓰기", visible: true },
      search: { id: "btn_search", label: "검색", visible: true },
      excel: {
        id: "btn_excel_download",
        label: "엑셀 다운로드",
        visible: true,
      },
    },
  },

  view: {
    showPrevNext: true,
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
  },

  write: {
    extraFields: [
      {
        key: "noticeStart",
        label: "공지 시작일",
        type: "datetime",
        layout: "half",
        required: true,
        description: "공지가 표시될 시작 일시",
      },
      {
        key: "noticeEnd",
        label: "공지 종료일",
        type: "datetime",
        layout: "half",
        required: true,
        description: "공지가 자동으로 숨겨질 종료 일시",
      },
    ],
    features: {
      useEditor: true,
      useAttachment: "multiple",
      useComment: false,
      useSecret: false,
      useAuthor: true,
      usePassword: false,
      useCategory: false,
    },
    attachmentLimits: {
      maxFiles: 3,
      maxFileSize: 20 * 1024 * 1024, // ★ 20MB로 수정 (20 → 20 * 1024 * 1024)
      allowedExtensions: ["jpg", "jpeg", "png", "pdf"],
    },
    buttons: {
      save: { id: "btn_save", label: "저장하기", visible: true },
      cancel: { id: "btn_cancel", label: "취소", visible: true },
    },
  },
};

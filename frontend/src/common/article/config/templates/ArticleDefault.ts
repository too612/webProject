import { ArticleTemplateConfig } from "../templateConfig";

export const ARTICLE_DEFAULT_CONFIG: ArticleTemplateConfig = {
  menuKey: "DEFAULT",
  templateCode: "DEFAULT",
  title: "설교정보",
  description: "주일 및 수요 예배 설교 말씀을 공유합니다.",

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
    defaultSortField: "created_at",
    defaultSortOrder: "DESC",
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
  },

  view: {
    showPrevNext: true,
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
      allowSecret: true,
      allowSpoiler: false,
      requireLogin: false,
    },
    secret: {
      enabled: true,
      requirePassword: true,
    },
  },

  write: {
    extraFields: [
      {
        key: "preacher",
        label: "설교자",
        type: "text",
        layout: "half",
        maxLength: 50,
        required: true,
        placeholder: "설교자 이름",
      },
      {
        key: "scripture",
        label: "성경본문",
        type: "text",
        layout: "half",
        maxLength: 200,
        placeholder: "요한복음 3:16",
      },
      {
        key: "worshipType",
        label: "예배구분",
        type: "select",
        layout: "half",
        options: [
          { label: "주일예배", value: "SUNDAY" },
          { label: "수요예배", value: "WEDNESDAY" },
          { label: "새벽예배", value: "DAWN" },
          { label: "특별예배", value: "SPECIAL" },
        ],
        defaultValue: "SUNDAY",
      },
      {
        key: "sermonDate",
        label: "설교일자",
        type: "date",
        layout: "half",
        required: true,
      },
    ],
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
      maxFileSize: 20 * 1024 * 1024, // ★ 20MB로 수정 (20 → 20 * 1024 * 1024)
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

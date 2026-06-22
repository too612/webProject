import { ArticleTemplateConfig } from "../templateConfig";

export const ARTICLE_SINGLE_IMAGE_CONFIG: ArticleTemplateConfig = {
  menuKey: "SINGLE_IMAGE",
  templateCode: "SINGLE_IMAGE",
  title: "주보",
  description: "주일 예배 주보 이미지를 제공합니다.",

  list: {
    viewMode: "gallery",
    pagination: true,
    pageSize: 12,
    searchable: true,
    searchFields: [{ value: "title", label: "제목" }],
    sortable: true,
    defaultSortField: "created_at",
    defaultSortOrder: "DESC",
    hideColumns: ["status", "views", "author"],
    excelDownload: false,
    defaultSearchType: "title",
    defaultFilters: {},
    buttons: {
      write: { id: "btn_write", label: "주보 등록", visible: true },
      search: { id: "btn_search", label: "검색", visible: true },
    },
    cardConfig: {
      aspectRatio: "4:3",
      imageField: "thumbnail_file_id",
      titleField: "title",
      showDescription: false,
      cardWidth: 200,
    },
  },

  view: {
    showPrevNext: false,
    showLike: false,
    showReport: false,
    showShare: false,
    showComment: false,
    commentSort: "latest",
    showMetaFields: false,
    metaLayout: "inline",
    buttons: {
      list: { id: "btn_list", label: "목록", visible: true },
      reply: { id: "btn_reply", label: "답글 작성", visible: false },
      edit: { id: "btn_edit", label: "수정", visible: false },
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
      enabled: true,
      showTitle: true,
    },
  },

  write: {
    extraFields: [
      {
        key: "bulletinDate",
        label: "주보 날짜",
        type: "date",
        layout: "half",
        required: true,
      },
      {
        key: "serviceType",
        label: "예배구분",
        type: "select",
        layout: "half",
        options: [
          { label: "주일예배", value: "SUNDAY" },
          { label: "수요예배", value: "WEDNESDAY" },
        ],
        defaultValue: "SUNDAY",
      },
    ],
    features: {
      useEditor: false,
      useAttachment: "single-image",
      useComment: false,
      useSecret: false,
      useAuthor: false,
      usePassword: false,
      useCategory: false,
    },
    attachmentLimits: {
      maxFiles: 1,
      maxFileSize: 20 * 1024 * 1024, // ★ 20MB로 수정 (20 → 20 * 1024 * 1024)
      allowedExtensions: ["jpg", "jpeg", "png", "webp", "gif"],
    },
    buttons: {
      save: { id: "btn_save", label: "저장하기", visible: true },
      cancel: { id: "btn_cancel", label: "취소", visible: true },
    },
  },
};

import { ArticleTemplateConfig } from "../templateConfig";

export const ARTICLE_GALLERY_CONFIG: ArticleTemplateConfig = {
  menuKey: "GALLERY",
  templateCode: "GALLERY",
  title: "다사랑앨범", // ★ 메뉴명 변경
  description: "교회 활동 사진을 공유합니다.",

  list: {
    viewMode: "gallery",
    pagination: true,
    pageSize: 12,
    searchable: true,
    searchFields: [
      { value: "title", label: "제목" },
      { value: "content", label: "내용" },
    ],
    sortable: true,
    defaultSortField: "created_at",
    defaultSortOrder: "DESC",
    hideColumns: ["status", "views"],
    excelDownload: false,
    defaultSearchType: "title",
    defaultFilters: {},
    buttons: {
      write: { id: "btn_write", label: "글쓰기", visible: true },
      search: { id: "btn_search", label: "검색", visible: true },
    },
    cardConfig: {
      aspectRatio: "4:3",
      imageField: "firstImageFromContent",
      titleField: "title",
      showDescription: false,
      cardWidth: 280,
      showCardIndex: false,
      showCardTypeLabel: false,
    },
  },

  view: {
    showPrevNext: true,
    showLike: true,
    showReport: false,
    showShare: true,
    showComment: true,
    commentSort: "latest",
    showMetaFields: true,
    showStatusBadge: false,
    metaLayout: "inline",
    buttons: {
      list: { id: "btn_list", label: "목록", visible: true },
      reply: { id: "btn_reply", label: "답글 작성", visible: false },
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
        key: "photoDate",
        label: "촬영일자",
        type: "date",
        layout: "half",
        required: true,
      },
      {
        key: "location",
        label: "장소",
        type: "text",
        layout: "half",
        placeholder: "촬영 장소",
      },
      {
        key: "photographer",
        label: "촬영자",
        type: "text",
        layout: "half",
        placeholder: "촬영자 이름",
      },
    ],
    features: {
      useEditor: true,
      useAttachment: "multiple",
      useComment: true,
      useSecret: false,
      useAuthor: true,
      usePassword: false,
      useCategory: false,
    },
    attachmentLimits: {
      maxFiles: 10,
      maxFileSize: 20 * 1024 * 1024, // ★ 20MB로 수정 (20 → 20 * 1024 * 1024)
      allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
    },
    buttons: {
      save: { id: "btn_save", label: "저장하기", visible: true },
      cancel: { id: "btn_cancel", label: "취소", visible: true },
    },
  },
};

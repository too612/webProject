import { ArticleTemplateConfig } from "../templateConfig";

export const ARTICLE_POPUP_CONFIG: ArticleTemplateConfig = {
  menuKey: "BANNER",
  templateCode: "POPUP",
  title: "팝업 관리",
  description: "메인 페이지 팝업 배너를 관리합니다.",

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
      write: { id: "btn_write", label: "팝업 등록", visible: true },
      search: { id: "btn_search", label: "검색", visible: true },
      excel: {
        id: "btn_excel_download",
        label: "엑셀 다운로드",
        visible: true,
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
        key: "popupStart",
        label: "팝업 시작일",
        type: "datetime",
        layout: "half",
        required: true,
      },
      {
        key: "popupEnd",
        label: "팝업 종료일",
        type: "datetime",
        layout: "half",
        required: true,
      },
      {
        key: "popupLink",
        label: "이동 링크 URL",
        type: "text",
        layout: "full",
        placeholder: "https://...",
      },
      {
        key: "popupDismissOption",
        label: "닫기 후 재노출 방지",
        type: "select",
        layout: "full",
        defaultValue: "DAY",
        options: [
          { label: "사용 안 함 (항상 노출)", value: "NONE" },
          { label: "4시간 동안 보지 않음", value: "HOURS_4" },
          { label: "하루 동안 보지 않음", value: "DAY" },
          { label: "일주일 동안 보지 않음", value: "WEEK" },
        ],
        description:
          "사용자가 팝업을 닫은 후 재노출을 방지할 시간을 선택합니다.",
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

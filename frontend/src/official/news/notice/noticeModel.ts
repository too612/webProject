export type NoticeBoardPaths = {
  listPath: string;
  viewPath: string;
  writePath: string;
};

export const NOTICE_BASE_PATH = '/news/notice';
export const NOTICE_API_BASE_PATH = '/official/news/notice';

export const NOTICE_LIST_PATH = NOTICE_BASE_PATH;
export const NOTICE_VIEW_PATH = `${NOTICE_BASE_PATH}/view`;
export const NOTICE_WRITE_PATH = `${NOTICE_BASE_PATH}/write`;

export const NOTICE_PATHS: NoticeBoardPaths = {
  listPath: NOTICE_LIST_PATH,
  viewPath: NOTICE_VIEW_PATH,
  writePath: NOTICE_WRITE_PATH,
};
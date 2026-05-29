export type AnnouncementBoardPaths = {
  listPath: string;
  viewPath: string;
  writePath: string;
};

export const ANNOUNCEMENT_BASE_PATH = '/news/announcement';
export const ANNOUNCEMENT_API_BASE_PATH = '/official/news/announcement';

export const ANNOUNCEMENT_LIST_PATH = ANNOUNCEMENT_BASE_PATH;
export const ANNOUNCEMENT_VIEW_PATH = `${ANNOUNCEMENT_BASE_PATH}/view`;
export const ANNOUNCEMENT_WRITE_PATH = `${ANNOUNCEMENT_BASE_PATH}/write`;

export const ANNOUNCEMENT_PATHS: AnnouncementBoardPaths = {
  listPath: ANNOUNCEMENT_LIST_PATH,
  viewPath: ANNOUNCEMENT_VIEW_PATH,
  writePath: ANNOUNCEMENT_WRITE_PATH,
};

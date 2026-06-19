export type BulletinBoardPaths = {
  listPath: string;
  viewPath: string;
  writePath: string;
};

export const BULLETIN_BASE_PATH = '/support/bulletin';
export const BULLETIN_API_BASE_PATH = '/official/support/bulletin';

export const BULLETIN_LIST_PATH = BULLETIN_BASE_PATH;
export const BULLETIN_VIEW_PATH = `${BULLETIN_BASE_PATH}/view`;
export const BULLETIN_WRITE_PATH = `${BULLETIN_BASE_PATH}/write`;

export const BULLETIN_PATHS: BulletinBoardPaths = {
  listPath: BULLETIN_LIST_PATH,
  viewPath: BULLETIN_VIEW_PATH,
  writePath: BULLETIN_WRITE_PATH,
};
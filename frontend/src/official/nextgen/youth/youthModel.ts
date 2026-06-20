export type YouthBoardPaths = { listPath: string; viewPath: string; writePath: string; };
export const YOUTH_BASE_PATH = '/nextgen/youth';
export const YOUTH_API_BASE_PATH = '/official/nextgen/youth';
export const YOUTH_LIST_PATH = YOUTH_BASE_PATH;
export const YOUTH_VIEW_PATH = `${YOUTH_BASE_PATH}/view`;
export const YOUTH_WRITE_PATH = `${YOUTH_BASE_PATH}/write`;
export const YOUTH_PATHS: YouthBoardPaths = { listPath: YOUTH_LIST_PATH, viewPath: YOUTH_VIEW_PATH, writePath: YOUTH_WRITE_PATH };
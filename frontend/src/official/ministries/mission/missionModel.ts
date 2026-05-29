export type MissionBoardPaths = {
  listPath: string;
  viewPath: string;
  writePath: string;
};

export const MISSION_BASE_PATH = '/ministries/mission';
export const MISSION_API_BASE_PATH = '/official/ministries/mission';

export const MISSION_LIST_PATH = MISSION_BASE_PATH;
export const MISSION_VIEW_PATH = `${MISSION_BASE_PATH}/view`;
export const MISSION_WRITE_PATH = `${MISSION_BASE_PATH}/write`;

export const MISSION_PATHS: MissionBoardPaths = {
  listPath: MISSION_LIST_PATH,
  viewPath: MISSION_VIEW_PATH,
  writePath: MISSION_WRITE_PATH,
};

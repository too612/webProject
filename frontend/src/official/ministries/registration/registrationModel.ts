export type RegistrationBoardPaths = {
  listPath: string;
  viewPath: string;
  writePath: string;
};

export const REGISTRATION_BASE_PATH = '/ministries/registration';
export const REGISTRATION_API_BASE_PATH = '/official/ministries/registration';
export const REGISTRATION_LIST_PATH = REGISTRATION_BASE_PATH;
export const REGISTRATION_VIEW_PATH = `${REGISTRATION_BASE_PATH}/view`;
export const REGISTRATION_WRITE_PATH = `${REGISTRATION_BASE_PATH}/write`;

export const REGISTRATION_PATHS: RegistrationBoardPaths = {
  listPath: REGISTRATION_LIST_PATH,
  viewPath: REGISTRATION_VIEW_PATH,
  writePath: REGISTRATION_WRITE_PATH,
};
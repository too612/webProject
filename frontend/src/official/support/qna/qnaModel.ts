export type QnaBoardPaths = {
  listPath: string;
  viewPath: string;
  writePath: string;
};

export const QNA_BASE_PATH = '/support/qna';
export const QNA_API_BASE_PATH = '/official/support/qna';

export const QNA_LIST_PATH = QNA_BASE_PATH;
export const QNA_VIEW_PATH = `${QNA_BASE_PATH}/view`;
export const QNA_WRITE_PATH = `${QNA_BASE_PATH}/write`;

export const QNA_PATHS: QnaBoardPaths = {
  listPath: QNA_LIST_PATH,
  viewPath: QNA_VIEW_PATH,
  writePath: QNA_WRITE_PATH,
};

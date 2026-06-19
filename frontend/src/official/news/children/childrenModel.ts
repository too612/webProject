export type ChildrenBoardPaths = {
	listPath: string;
	viewPath: string;
	writePath: string;
};

export const CHILDREN_BASE_PATH = '/news/children';
export const CHILDREN_API_BASE_PATH = '/official/news/children';

export const CHILDREN_LIST_PATH = CHILDREN_BASE_PATH;
export const CHILDREN_VIEW_PATH = `${CHILDREN_BASE_PATH}/view`;
export const CHILDREN_WRITE_PATH = `${CHILDREN_BASE_PATH}/write`;

export const CHILDREN_PATHS: ChildrenBoardPaths = {
	listPath: CHILDREN_LIST_PATH,
	viewPath: CHILDREN_VIEW_PATH,
	writePath: CHILDREN_WRITE_PATH,
};
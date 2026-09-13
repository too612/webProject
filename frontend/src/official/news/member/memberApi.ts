import { articleApi } from "../../../common/article/ArticleApi";
import { MEMBER_NEWS_MENU_KEY, MEMBER_NEWS_TEMPLATE_CODE } from "./memberModel";

export const memberNewsApi = {
  getList: (page = 0, keyword?: string) =>
    articleApi.getList({
      page,
      menuKey: MEMBER_NEWS_MENU_KEY,
      templateCode: MEMBER_NEWS_TEMPLATE_CODE,
      searchType: "title",
      keyword,
    }),
  getView: (articleId: number, password?: string) =>
    articleApi.getView(articleId, password),
  save: (formData: FormData) => articleApi.save(formData),
  update: (articleId: number, formData: FormData) =>
    articleApi.update(articleId, formData),
  delete: (articleId: number) => articleApi.delete(articleId),
};

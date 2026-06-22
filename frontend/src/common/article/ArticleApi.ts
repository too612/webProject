import client from "../../common/api/api.client";
import type {
  ArticleItem,
  ArticleListQuery,
  PrevNextItem,
} from "./ArticleModel";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const articleApi = {
  getList: (query: ArticleListQuery) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "")
        params.append(key, String(val));
    });
    return client
      .get<
        ApiResponse<PageResponse<ArticleItem>>
      >(`/common/article?${params.toString()}`)
      .then((res) => res.data.data);
  },

  getView: (articleId: number, password?: string) => {
    return client
      .get<
        ApiResponse<ArticleItem>
      >(`/common/article/${articleId}`, { params: { password } })
      .then((res) => res.data.data);
  },

  getPrevNext: (
    articleId: number,
    menuKey: string,
    templateCode: string,
    sortField?: string,
    sortOrder?: string,
  ) => {
    const params = new URLSearchParams({
      menuKey,
      templateCode,
      sortField: sortField || "created_at",
      sortOrder: sortOrder || "DESC",
    });
    return client
      .get<
        ApiResponse<PrevNextItem>
      >(`/common/article/${articleId}/prev-next?${params.toString()}`)
      .then((res) => res.data.data);
  },

  save: (formData: FormData) => {
    return client
      .post<ApiResponse<ArticleItem>>("/common/article", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  update: (articleId: number, formData: FormData) => {
    return client
      .put<ApiResponse<ArticleItem>>(`/common/article/${articleId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  delete: (articleId: number) => {
    return client
      .delete<ApiResponse<void>>(`/common/article/${articleId}`)
      .then((res) => res.data);
  },

  verifyPassword: (articleId: number, password: string) => {
    return client
      .post<ApiResponse<boolean>>(
        `/common/article/${articleId}/verify-password`,
        null,
        {
          params: { password },
        },
      )
      .then((res) => res.data.data);
  },

  // ★ 배너 전용
  getBanners: (type: "POPUP" | "SLIDE", limit?: number) => {
    const params = new URLSearchParams({
      menuKey: "BANNER",
      templateCode: type,
      sortField: "order_no",
      sortOrder: "ASC",
    });
    if (limit) params.set("size", String(limit));
    return client
      .get<
        ApiResponse<PageResponse<ArticleItem>>
      >(`/common/article/banners?${params.toString()}`)
      .then((res) => res.data.data);
  },

  reorderSlides: (slideIds: number[]) => {
    return client
      .patch<ApiResponse<void>>("/common/article/slides/reorder", { slideIds })
      .then((res) => res.data);
  },
};

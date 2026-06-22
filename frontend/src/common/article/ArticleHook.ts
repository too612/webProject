import { useState, useCallback } from "react";
import { articleApi } from "./ArticleApi";
import type {
  ArticleItem,
  ArticleListQuery,
  ArticleWriteForm,
  PrevNextItem,
} from "./ArticleModel";

const INITIAL_FORM: ArticleWriteForm = {
  title: "",
  author: "",
  content: "",
  password: "",
  confirmPassword: "",
  secret: false,
  menuKey: "COMMON",
  templateCode: "DEFAULT",
  metadata: {},
};

export function useArticle() {
  // ===== 목록 상태 =====
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // ===== ✅ 추가: 검색 상태 (bannerList 등에서 필요) =====
  const [searchType, setSearchType] = useState<string>("title");
  const [keyword, setKeyword] = useState<string>("");

  // ===== 상세 상태 =====
  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [prevNext, setPrevNext] = useState<PrevNextItem>({
    prevId: null,
    nextId: null,
    prevTitle: null,
    nextTitle: null,
  });

  // ===== 작성 상태 =====
  const [form, setForm] = useState<ArticleWriteForm>(INITIAL_FORM);
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);

  // ============================================================
  // 목록 조회
  // ============================================================
  const loadList = useCallback(async (query: ArticleListQuery) => {
    setListLoading(true);
    setListError(null);
    try {
      const pageData = await articleApi.getList(query);
      setItems(pageData.content || []);
      setTotalElements(pageData.totalElements || 0);
      setTotalPages(pageData.totalPages || 0);
      setPage(query.page || 0);
    } catch (e: any) {
      console.error("목록 조회 실패:", e);
      setListError(e.message || "목록 조회에 실패했습니다.");
      setItems([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setListLoading(false);
    }
  }, []);

  // ============================================================
  // 상세 조회
  // ============================================================
  const loadView = useCallback(
    async (
      articleId: number,
      password?: string,
      menuKey?: string,
      templateCode?: string,
    ) => {
      setViewLoading(true);
      setViewError(null);
      try {
        const data = await articleApi.getView(articleId, password);
        setArticle(data);

        if (menuKey && templateCode) {
          try {
            const prevNextData = await articleApi.getPrevNext(
              articleId,
              menuKey,
              templateCode,
              "created_at",
              "DESC",
            );
            setPrevNext(
              prevNextData || {
                prevId: null,
                nextId: null,
                prevTitle: null,
                nextTitle: null,
              },
            );
          } catch (e) {
            console.warn("이전/다음글 조회 실패:", e);
            setPrevNext({
              prevId: null,
              nextId: null,
              prevTitle: null,
              nextTitle: null,
            });
          }
        }
      } catch (e: any) {
        console.error("상세 조회 실패:", e);
        setViewError(e.message || "게시글을 불러오지 못했습니다.");
        setArticle(null);
      } finally {
        setViewLoading(false);
      }
    },
    [],
  );

  // ============================================================
  // 비밀번호 확인
  // ============================================================
  const verifyPassword = useCallback(
    async (articleId: number, password: string) => {
      try {
        return await articleApi.verifyPassword(articleId, password);
      } catch (e) {
        console.error("비밀번호 검증 실패:", e);
        return false;
      }
    },
    [],
  );

  // ============================================================
  // 저장
  // ============================================================
  const saveArticle = useCallback(
    async (formData: FormData, isEdit: boolean, postId?: number) => {
      setWriteLoading(true);
      setWriteError(null);
      try {
        const result =
          isEdit && postId
            ? await articleApi.update(postId, formData)
            : await articleApi.save(formData);
        return result;
      } catch (e: any) {
        console.error("저장 실패:", e);
        setWriteError(e.message || "저장에 실패했습니다.");
        throw e;
      } finally {
        setWriteLoading(false);
      }
    },
    [],
  );

  // ============================================================
  // 삭제
  // ============================================================
  const deleteArticle = useCallback(async (articleId: number) => {
    await articleApi.delete(articleId);
  }, []);

  // ============================================================
  // 폼 리셋
  // ============================================================
  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setWriteError(null);
  }, []);

  // ============================================================
  // 반환 (✅ searchType, keyword, setter 추가)
  // ============================================================
  return {
    items,
    totalElements,
    totalPages,
    page,
    setPage,
    listLoading,
    listError,
    loadList,
    article,
    viewLoading,
    viewError,
    loadView,
    prevNext,
    verifyPassword,
    form,
    setForm,
    writeLoading,
    writeError,
    saveArticle,
    deleteArticle,
    resetForm,
    // ✅ bannerList 등에서 구조 분해 할당할 수 있도록 추가
    searchType,
    keyword,
    setSearchType,
    setKeyword,
  };
}

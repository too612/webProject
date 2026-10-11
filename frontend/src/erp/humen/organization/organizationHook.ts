import { useCallback, useEffect, useState } from "react";
import { organizationApi } from "./organizationApi";
import type { OrganizationDetail, OrganizationReorg } from "./organizationModel";

export function useOrganizationPage() {
  const [items, setItems] = useState<OrganizationReorg[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>();
  const [detail, setDetail] = useState<OrganizationDetail>();
  const [keyword, setKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await organizationApi.getReorgList({ page, size: 10, keyword: keyword || undefined });
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      if (!selectedKey && result.items[0]) setSelectedKey(result.items[0].reorgKey);
      if (selectedKey && !result.items.some((item) => item.reorgKey === selectedKey)) setSelectedKey(result.items[0]?.reorgKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "조직개편 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [keyword, page, selectedKey]);

  const loadDetail = useCallback(async (reorgKey: string) => {
    setDetailLoading(true);
    try {
      setDetail(await organizationApi.getReorg(reorgKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "조직개편 상세를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => { void loadList(); }, [loadList]);
  useEffect(() => { if (selectedKey) void loadDetail(selectedKey); }, [loadDetail, selectedKey]);

  return {
    items, detail, selectedKey, loading, detailLoading, error, page, totalPages, totalElements,
    inputKeyword, setInputKeyword, setSelectedKey,
    search: () => { setPage(0); setKeyword(inputKeyword.trim()); },
    previousPage: () => setPage((current) => Math.max(0, current - 1)),
    nextPage: () => setPage((current) => Math.min(Math.max(totalPages - 1, 0), current + 1)),
    reload: async () => { if (selectedKey) await loadDetail(selectedKey); await loadList(); },
  };
}

import { useCallback, useState } from "react";
import { contributionApi } from "./contributionApi";
import type { ContributionInfo } from "./contributionModel";

export function useContributionInfo() {
  const [info, setInfo] = useState<ContributionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setInfo(await contributionApi.getInfo());
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "조회 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { info, loading, error, loadInfo };
}

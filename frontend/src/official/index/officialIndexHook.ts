import { useCallback, useState } from 'react';
import { officialIndexApi } from './officialIndexApi';
import { EMPTY_OFFICIAL_INDEX_DATA, type OfficialIndexData } from './officialIndexModel';

export function useOfficialIndexData() {
  const [indexData, setIndexData] = useState<OfficialIndexData>(EMPTY_OFFICIAL_INDEX_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIndexData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await officialIndexApi.getIndexData();
      setIndexData(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '메인 화면 정보를 불러오지 못했습니다.';
      setError(message);
      setIndexData(EMPTY_OFFICIAL_INDEX_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    indexData,
    loading,
    error,
    loadIndexData,
  };
}

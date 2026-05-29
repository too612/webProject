import { useCallback, useState } from 'react';
import { erpIndexApi } from './erpIndexApi';
import { EMPTY_ERP_INDEX_DATA, type ErpIndexData } from './erpIndexModel';

export function useErpIndexData() {
  const [indexData, setIndexData] = useState<ErpIndexData>(EMPTY_ERP_INDEX_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIndexData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpIndexApi.getIndexData();
      setIndexData(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'ERP 메인 화면 정보를 불러오지 못했습니다.';
      setError(message);
      setIndexData(EMPTY_ERP_INDEX_DATA);
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

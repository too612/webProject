import { useCallback, useState } from 'react';
import { serviceGroupApi } from './serviceGroupApi';
import type { ServiceGroupContent } from './serviceGroupModel';

export function useServiceGroupContent() {
  const [serviceGroupContent, setServiceGroupContent] = useState<ServiceGroupContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServiceGroupContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceGroupApi.getServiceGroupContent();
      setServiceGroupContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    serviceGroupContent,
    loading,
    error,
    loadServiceGroupContent,
  };
}
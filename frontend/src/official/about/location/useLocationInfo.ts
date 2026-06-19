import { useCallback, useState } from 'react';
import { locationApi } from './locationApi';
import type { LocationInfo } from './LocationModel';

export function useLocationInfo() {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocationInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationApi.getLocationInfo();
      setLocationInfo(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    locationInfo,
    loading,
    error,
    loadLocationInfo,
  };
}
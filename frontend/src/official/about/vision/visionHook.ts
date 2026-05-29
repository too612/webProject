import { useCallback, useState } from 'react';
import { visionApi } from './visionApi';
import type { VisionContent } from './visionModel';

export function useVisionContent() {
  const [visionContent, setVisionContent] = useState<VisionContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVisionContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await visionApi.getVisionContent();
      setVisionContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    visionContent,
    loading,
    error,
    loadVisionContent,
  };
}

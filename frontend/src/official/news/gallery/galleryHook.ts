import { useCallback, useState } from 'react';
import { galleryApi } from './galleryApi';
import type { GalleryContent } from './galleryModel';

export function useGalleryContent() {
  const [galleryContent, setGalleryContent] = useState<GalleryContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGalleryContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryApi.getGalleryContent();
      setGalleryContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { galleryContent, loading, error, loadGalleryContent };
}
import { useCallback, useState } from 'react';
import { courseApi } from './courseApi';
import type { CourseContent } from './courseModel';

export function useCourseContent() {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourseContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseApi.getCourseContent();
      setCourseContent(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courseContent,
    loading,
    error,
    loadCourseContent,
  };
}
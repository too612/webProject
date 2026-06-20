import { useEffect } from 'react';
import { useCourseContent } from './courseHook';
import { DEFAULT_COURSE_CONTENT } from './courseModel';

export default function CoursePage() {
  const { courseContent, loading, error, loadCourseContent } = useCourseContent();

  useEffect(() => {
    loadCourseContent();
  }, [loadCourseContent]);

  const content = courseContent ?? DEFAULT_COURSE_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{content.summary}</p>
        </div>

        {loading && <div className="text-sm text-slate-500 py-4 text-center">양육과정 정보를 불러오는 중입니다.</div>}
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.courses.map((course) => (
            <article key={course.title} className="border border-slate-200 bg-white p-5 space-y-2">
              <h3 className="font-semibold text-brand-dark">{course.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
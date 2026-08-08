import { FormEvent, ReactNode } from "react";
import {
  ActionButton,
  Button,
  ErrorMessage,
  LoadingSpinner,
} from "../../../common/ui";

interface WriteLayoutProps {
  title: string;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  children: ReactNode;
  error?: string | null;
  loading?: boolean;
}

export function WriteLayout({
  title,
  onSubmit,
  onCancel,
  children,
  error,
  loading,
}: Readonly<WriteLayoutProps>) {
  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        <header className="pb-4 mb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{title}</h2>
        </header>

        {/* ★ ErrorMessage 공통 컴포넌트 적용 */}
        {error && <ErrorMessage message={error} className="mb-4" />}

        {/* ★ 로딩 중이면 스피너 표시 */}
        {loading ? (
          <LoadingSpinner text="불러오는 중..." />
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {children}

            <div className="flex gap-2 pt-2">
              <ActionButton action="save" type="submit" loading={loading} />
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
            </div>
          </form>
        )}
      </article>
    </section>
  );
}

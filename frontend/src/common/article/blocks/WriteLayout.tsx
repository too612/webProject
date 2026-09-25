import { FormEvent, ReactNode } from "react";
import {
  ActionButton,
  Button,
  ErrorMessage,
  LoadingSpinner,
} from "../../../common/ui";

interface WriteLayoutProps {
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  children: ReactNode;
  error?: string | null;
  loading?: boolean;
}

export function WriteLayout({
  onSubmit,
  onCancel,
  children,
  error,
  loading,
}: Readonly<WriteLayoutProps>) {
  return (
    <div className="space-y-5">
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
    </div>
  );
}

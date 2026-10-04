import { Loader2 } from "lucide-react";
import { Button } from "./button";

export interface AsyncFeedbackProps {
  readonly loading?: boolean;
  readonly loadingMessage?: string;
  readonly error?: string;
  readonly onRetry?: () => void;
}

export function AsyncFeedback({
  loading = false,
  loadingMessage = "불러오는 중...",
  error = "",
  onRetry,
}: AsyncFeedbackProps) {
  if (error) return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <p>{error}</p>
      {onRetry && <Button type="button" size="sm" variant="outline" onClick={onRetry}>다시 시도</Button>}
    </div>
  );
  if (loading) return (
    <div role="status" className="flex items-center gap-2 py-2 text-sm text-slate-500">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
      {loadingMessage}
    </div>
  );
  return null;
}

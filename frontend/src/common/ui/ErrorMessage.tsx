import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  onRetry,
  className = "",
}: Readonly<ErrorMessageProps>) {
  return (
    <div
      className={cn(
        "rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="size-4 shrink-0" />
        <span className="flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-destructive underline hover:no-underline font-medium text-xs"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}

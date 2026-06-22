import React from "react";

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
      className={`rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="material-icons text-red-500 text-base">
          error_outline
        </span>
        <span className="flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-700 underline hover:no-underline font-medium text-xs"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}

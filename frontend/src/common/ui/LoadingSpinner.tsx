import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text = "불러오는 중...",
  className = "",
}: Readonly<LoadingSpinnerProps>) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}
    >
      <div
        className={`${sizeMap[size]} rounded-full border-brand-primary border-t-transparent animate-spin`}
        role="status"
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}

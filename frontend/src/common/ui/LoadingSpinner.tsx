import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8",
        className,
      )}
    >
      <Loader2 className={cn(sizeMap[size], "animate-spin text-primary")} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

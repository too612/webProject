import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/common/ui/button";
import { cn } from "@/lib/utils";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingText?: string;
};

export function LoadingButton({
  children,
  loading = false,
  loadingText = "처리 중...",
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "min-w-[112px] gap-2 font-medium transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-80",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}

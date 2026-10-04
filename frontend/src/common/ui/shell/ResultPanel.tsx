import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ResultPanelProps {
  readonly children: ReactNode;
  readonly totalCount: number | null;
  readonly countUnit?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function ResultPanel({
  children,
  totalCount,
  countUnit = "건",
  actions,
  className,
}: ResultPanelProps) {
  const titleId = useId();

  return (
    <section
      data-ui="result-panel"
      aria-labelledby={titleId}
      className={cn("min-w-0 space-y-3", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={titleId} className="text-sm font-semibold text-slate-800">
          검색결과{" "}
          <span role="status" className="font-normal text-slate-500">
            {totalCount === null
              ? "(전체 건수 미확정)"
              : `(총 ${totalCount.toLocaleString()}${countUnit})`}
          </span>
        </h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

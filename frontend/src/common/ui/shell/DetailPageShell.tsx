import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMenu } from "../../menu/menuHook";
import { getCurrentMenuPageContent } from "../../menu/menuModel";
import { PageTitle } from "../title";

export interface DetailPageShellProps {
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly titleSuffix?: ReactNode;
  readonly actions?: ReactNode;
  readonly headerContent?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly panelClassName?: string;
  readonly contentClassName?: string;
}

export function DetailPageShell({
  title,
  description,
  titleSuffix,
  actions,
  headerContent,
  children,
  className,
  panelClassName,
  contentClassName,
}: DetailPageShellProps) {
  const { currentMenu, loading: menuLoading } = useMenu();
  const pageContent = getCurrentMenuPageContent(currentMenu, menuLoading);
  const resolvedTitle = title ?? pageContent.headline;
  const resolvedDescription = description ?? pageContent.summary;
  const displayTitle =
    titleSuffix && !menuLoading ? (
      <>
        {resolvedTitle} {titleSuffix}
      </>
    ) : (
      resolvedTitle
    );

  return (
    <section className={cn("space-y-5", className)}>
      <div
        className={cn(
          "space-y-5 rounded-none border border-slate-200 bg-white p-6 shadow-panel md:p-7",
          panelClassName,
        )}
      >
        {headerContent ?? (
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <PageTitle title={displayTitle} description={resolvedDescription} />
            {actions}
          </div>
        )}

        <div className={cn("space-y-4", contentClassName)}>{children}</div>
      </div>
    </section>
  );
}

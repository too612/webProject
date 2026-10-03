import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMenu } from "../../menu/menuHook";
import { getCurrentMenuPageContent } from "../../menu/menuModel";
import { PageTitle } from "../title";
import {
  WorkspaceActions,
  useWorkspaceTab,
} from "../../workspace/workspaceHook";

export interface ListPageShellProps {
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly titleSuffix?: ReactNode;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly panelClassName?: string;
  readonly headerClassName?: string;
  readonly contentClassName?: string;
}

export function ListPageShell({
  title,
  description,
  titleSuffix,
  actions,
  children,
  className,
  panelClassName,
  headerClassName,
  contentClassName,
}: ListPageShellProps) {
  const { currentMenu, loading: menuLoading } = useMenu();
  const workspace = useWorkspaceTab();
  const pageContent = getCurrentMenuPageContent(
    workspace?.menu ?? currentMenu,
    menuLoading,
  );
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

  return workspace ? (
    <section className={cn("space-y-4", className)}>
      <WorkspaceActions>{actions}</WorkspaceActions>
      <div
        className={cn(
          "flex items-start justify-between gap-4",
          headerClassName,
        )}
      >
        <PageTitle title={displayTitle} description={resolvedDescription} />
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  ) : (
    <section className={cn("space-y-5", className)}>
      <div
        className={cn(
          "rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-4 flex-wrap",
            headerClassName,
          )}
        >
          <PageTitle title={displayTitle} description={resolvedDescription} />
          {actions}
        </div>

        <div
          className={cn(
            "[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

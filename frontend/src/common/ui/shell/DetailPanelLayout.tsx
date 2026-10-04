import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useWorkspaceTab } from "../../workspace/workspaceHook";
import { Button } from "../button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "../sheet";

export interface DetailPanelNavigation {
  readonly canPrevious: boolean;
  readonly canNext: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly disabled?: boolean;
  readonly previousLabel?: string;
  readonly nextLabel?: string;
}

export interface DetailPanelLayoutProps {
  readonly children: ReactNode;
  readonly detail: ReactNode;
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onRestoreFocus?: () => void;
  readonly actions?: ReactNode;
  readonly navigation?: DetailPanelNavigation;
}

export function DetailPanelLayout({
  children,
  detail,
  title,
  description,
  open,
  onOpenChange,
  onRestoreFocus,
  actions,
  navigation,
}: DetailPanelLayoutProps) {
  const workspace = useWorkspaceTab();
  const active = workspace?.active ?? true;
  const titleId = useId();
  const listId = `${titleId}-list`;
  const detailId = `${titleId}-detail`;
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const autoFocusCaptured = useRef(false);
  const wasOpen = useRef(false);
  const [wide, setWide] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [detailSize, setDetailSize] = useState(45);

  const restoreFocus = () => {
    if (onRestoreFocus) onRestoreFocus();
    else if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWide(entry.contentRect.width >= 1000);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    if (open && !wasOpen.current) {
      if (!autoFocusCaptured.current) {
        returnFocusRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      headingRef.current?.focus();
    }
    if (!open && wasOpen.current) {
      setExpanded(false);
      restoreFocus();
      autoFocusCaptured.current = false;
    }
    wasOpen.current = open;
  }, [open, active, onRestoreFocus]);

  const inline = open && wide && !expanded;
  const header = (modal: boolean) => (
    <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-4">
      <div className="min-w-0">
        {modal ? (
          <SheetTitle>{title}</SheetTitle>
        ) : (
          <h2 id={titleId} ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
            {title}
          </h2>
        )}
        {modal ? (
          <SheetDescription className="mt-1">{description}</SheetDescription>
        ) : (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {navigation && (
          <>
            <Button type="button" size="icon" variant="ghost" aria-label={navigation.previousLabel ?? "이전 항목"}
              disabled={!navigation.canPrevious || navigation.disabled} onClick={navigation.onPrevious}>
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" aria-label={navigation.nextLabel ?? "다음 항목"}
              disabled={!navigation.canNext || navigation.disabled} onClick={navigation.onNext}>
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </>
        )}
        {actions}
        {!modal && (
          <Button type="button" size="icon" variant="ghost" aria-label="상세 확대" onClick={() => setExpanded(true)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        {modal && expanded && wide && (
          <Button type="button" variant="outline" size="sm" onClick={() => setExpanded(false)}>
            목록과 함께 보기
          </Button>
        )}
        <Button type="button" size="icon" variant="ghost" aria-label="상세 닫기" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-w-0" data-ui="detail-panel-layout">
      <Group
        orientation="horizontal"
        defaultLayout={{ [listId]: 100 - detailSize, [detailId]: detailSize }}
        onLayoutChanged={(layout) => {
          if (layout[detailId] != null) setDetailSize(layout[detailId]);
        }}
      >
        <Panel id={listId} minSize="360px" className="min-w-0">
          {children}
        </Panel>
        {inline && (
          <>
            <Separator
              aria-label="상세 패널 너비 조절"
              className="mx-2 w-2 rounded bg-slate-100 transition-colors hover:bg-slate-300 focus-visible:bg-primary/30 focus-visible:outline-none"
            />
            <Panel id={detailId} minSize="360px" maxSize="65%">
              <section
                aria-labelledby={titleId}
                className="flex h-[min(72dvh,760px)] min-h-96 flex-col overflow-hidden rounded-md border border-slate-200 bg-white motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:duration-200"
                onKeyDown={(event) => {
                  if (event.key === "Escape" && !event.defaultPrevented) onOpenChange(false);
                }}
              >
                {header(false)}
                <div className="min-h-0 flex-1 overflow-y-auto p-4">{detail}</div>
              </section>
            </Panel>
          </>
        )}
      </Group>
      <Sheet open={open && active && !inline} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className={`flex w-full flex-col gap-0 p-0 [&>button:last-child]:hidden data-[state=open]:duration-200 data-[state=closed]:duration-150 motion-reduce:animate-none ${expanded ? "sm:max-w-[min(1100px,95vw)]" : "sm:max-w-xl"}`}
          onOpenAutoFocus={() => {
            if (!wasOpen.current) {
              autoFocusCaptured.current = true;
              returnFocusRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
            }
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (active) restoreFocus();
          }}
        >
          {header(true)}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{detail}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

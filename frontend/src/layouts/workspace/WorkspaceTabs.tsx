import { useEffect, useRef } from "react";
import { MoreHorizontal, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../common/ui";
import type { WorkspaceTab } from "../../common/workspace/workspace.types";

type Props = Readonly<{
  tabs: WorkspaceTab[];
  activeId: string | null;
  onSelect: (href: string) => void;
  onClose: (ids: string[]) => void;
}>;

export default function WorkspaceTabs({
  tabs,
  activeId,
  onSelect,
  onClose,
}: Props) {
  const tabList = useRef<HTMLDivElement>(null);
  useEffect(() => {
    tabList.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeId]);

  return (
    <div className="workspace-tabs-bar">
      <div
        ref={tabList}
        className="workspace-tabs"
        role="tablist"
        aria-label="열린 작업"
      >
        {tabs.map((tab, index) => {
          const conditions = [
            ...new URLSearchParams(tab.href.split("?")[1] ?? "").entries(),
          ]
            .map(([key, value]) => `${key}=${value}`)
            .join(", ");
          const label = conditions ? `${tab.title} (${conditions})` : tab.title;
          return (
            <div
              key={tab.id}
              className={`workspace-tab${tab.id === activeId ? " is-active" : ""}`}
            >
              <button
                type="button"
                role="tab"
                id={`workspace-tab-${index}`}
                aria-controls={`workspace-panel-${index}`}
                aria-selected={tab.id === activeId}
                tabIndex={
                  tab.id === activeId || (!activeId && index === 0) ? 0 : -1
                }
                title={`${label}${tab.dirty ? " (미저장)" : ""}`}
                onClick={() => onSelect(tab.href)}
                onKeyDown={(event) => {
                  let next: number;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % tabs.length;
                  else if (event.key === "ArrowLeft")
                    next = (index + tabs.length - 1) % tabs.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = tabs.length - 1;
                  else if (event.key === "Delete") {
                    onClose([tab.id]);
                    return;
                  } else return;
                  event.preventDefault();
                  onSelect(tabs[next].href);
                  tabList.current
                    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                    [next]?.focus();
                }}
              >
                {tab.dirty && (
                  <span className="workspace-dirty" aria-label="미저장" />
                )}
                <span>{label}</span>
              </button>
              <button
                type="button"
                className="workspace-icon"
                title={`${label} 닫기`}
                aria-label={`${label} 닫기`}
                onClick={() => onClose([tab.id])}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        {tabs.length === 0 && (
          <span className="workspace-tabs-empty">열린 작업 없음</span>
        )}
      </div>
      <span className="workspace-tab-count" aria-label="열린 탭 수">
        {tabs.length}/8
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="workspace-icon"
            title="탭 관리"
            aria-label="탭 관리"
          >
            <MoreHorizontal size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={!activeId}
            onSelect={() => onClose(activeId ? [activeId] : [])}
          >
            현재 탭 닫기
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={tabs.length < 2}
            onSelect={() =>
              onClose(
                tabs.filter((tab) => tab.id !== activeId).map((tab) => tab.id),
              )
            }
          >
            나머지 닫기
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!tabs.length}
            onSelect={() => onClose(tabs.map((tab) => tab.id))}
          >
            전체 닫기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

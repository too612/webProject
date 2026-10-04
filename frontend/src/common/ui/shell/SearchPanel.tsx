import { useId, useState, type FormEventHandler, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { Label } from "../label";

export interface SearchPanelProps {
  readonly children: ReactNode;
  readonly onSearch: FormEventHandler<HTMLFormElement>;
  readonly formId: string;
  readonly pending?: boolean;
  readonly disabled?: boolean;
  readonly collapsible?: boolean;
}

export function SearchPanel({
  children,
  onSearch,
  formId,
  pending = false,
  disabled = false,
  collapsible = true,
}: SearchPanelProps) {
  const titleId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section
      data-ui="search-panel"
      aria-labelledby={titleId}
      className="@container min-w-0 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={titleId} className="text-sm font-semibold text-slate-800">
          검색조건
        </h2>
        <div className="flex items-center gap-2">
          <span role="status" className="text-xs text-slate-500">
            {pending ? "조건이 변경되었습니다. 조회를 눌러 적용하세요." : ""}
          </span>
          {collapsible && <Button type="button" size="sm" variant="ghost" aria-expanded={!collapsed}
            aria-controls={formId} onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? "펼치기" : "접기"}
            {collapsed ? <ChevronDown aria-hidden="true" className="ml-1 h-4 w-4" /> : <ChevronUp aria-hidden="true" className="ml-1 h-4 w-4" />}
          </Button>}
        </div>
      </div>
      <form
        id={formId}
        hidden={collapsible && collapsed}
        aria-labelledby={titleId}
        onSubmit={onSearch}
        className="rounded-md border border-slate-200 bg-slate-50/60 p-3 sm:p-4"
      >
        <fieldset
          disabled={disabled}
          className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 border-0 p-0 @3xl:grid-cols-3 @3xl:gap-x-6"
        >
          {children}
        </fieldset>
      </form>
    </section>
  );
}

export interface SearchFieldProps {
  readonly label: string;
  readonly children: (id: string) => ReactNode;
  readonly className?: string;
  readonly width?: "compact" | "medium" | "keyword" | "range";
}

const FIELD_WIDTHS = {
  compact: "max-w-40",
  medium: "max-w-56",
  keyword: "max-w-40 @3xl:max-w-56",
  range: "max-w-80",
} as const;

export function SearchField({ label, children, className, width = "medium" }: SearchFieldProps) {
  const id = useId();

  return (
    <div className={cn("grid min-w-0 gap-1.5 @3xl:grid-cols-[4.5rem_minmax(0,1fr)] @3xl:items-center @3xl:gap-2", className)}>
      <Label htmlFor={id} className="text-sm text-slate-600">
        {label}
      </Label>
      <div className={cn("min-w-0", FIELD_WIDTHS[width])}>{children(id)}</div>
    </div>
  );
}

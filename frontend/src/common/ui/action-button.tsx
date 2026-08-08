import * as React from "react";
import { Search, Save, Trash2, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/common/ui/button";
import { cn } from "@/lib/utils";

type ActionType = "search" | "save" | "delete" | "excel";

const actionConfig: Record<
  ActionType,
  { label: string; icon: React.ReactNode; className: string }
> = {
  search: {
    label: "검색",
    icon: <Search className="h-4 w-4" />,
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  save: {
    label: "저장",
    icon: <Save className="h-4 w-4" />,
    className: "bg-teal-600 text-white hover:bg-teal-700",
  },
  delete: {
    label: "삭제",
    icon: <Trash2 className="h-4 w-4" />,
    className:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  excel: {
    label: "엑셀 다운로드",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    className: "bg-green-600 text-white hover:bg-green-700",
  },
};

type ActionButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  action: ActionType;
  loading?: boolean;
  label?: string;
};

export function ActionButton({
  action,
  loading = false,
  label,
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  const config = actionConfig[action];
  const displayLabel = label ?? config.label;

  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "gap-2 font-semibold shadow-sm transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-80",
        config.className,
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {config.icon}
          <span>{displayLabel}</span>
        </>
      )}
    </Button>
  );
}

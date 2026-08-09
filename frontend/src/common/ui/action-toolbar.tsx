import { RotateCcw } from "lucide-react";
import { Button } from "@/common/ui/button";
import { ActionButton } from "@/common/ui/action-button";

type ActionToolbarProps = {
  searching?: boolean;
  onSearch?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onExcel?: () => void;
};

export function ActionToolbar({
  searching = false,
  onSearch,
  onReset,
  onSave,
  onDelete,
  onExcel,
}: Readonly<ActionToolbarProps>) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <ActionButton action="search" loading={searching} onClick={onSearch} />
        <Button variant="outline" className="gap-2" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          초기화
        </Button>
      </div>
      <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
        <ActionButton action="save" onClick={onSave} />
        <ActionButton action="delete" onClick={onDelete} />
        <ActionButton action="excel" onClick={onExcel} />
      </div>
    </div>
  );
}

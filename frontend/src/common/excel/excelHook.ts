import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { fn_exportExcel } from "./excel";
import { clearExcelScope } from "./excelRegistry";
import type { ExcelTarget } from "./excelModel";

export function useExcelExport() {
  const scope = useId();
  const controller = useRef<AbortController | null>(null);
  const [exporting, setExporting] = useState(false);
  useEffect(() => () => { controller.current?.abort(); clearExcelScope(scope); }, [scope]);
  const exportExcel = useCallback(async (targets: string | readonly ExcelTarget[], fileName: string) => {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setExporting(true);
    try { await fn_exportExcel(targets, fileName, { scope, signal: request.signal }); }
    catch (error) {
      if (!request.signal.aborted) toast.error(error instanceof Error ? error.message : "엑셀 다운로드에 실패했습니다.");
    } finally {
      if (!request.signal.aborted) setExporting(false);
      controller.current = null;
    }
  }, [scope]);
  return { scope, exporting, exportExcel };
}
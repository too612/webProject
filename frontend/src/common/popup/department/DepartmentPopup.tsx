import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { getApiErrorMessage } from "../../api/apiError";
import {
  ActionButton, AsyncFeedback, Button, Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, Input, ResultPanel, SearchField, SearchPanel,
} from "../../ui";
import TreeTable from "../../ui/tree/TreeTable";
import type { TreeColumn } from "../../ui/tree/tree.types";
import { useWorkspaceTab } from "../../workspace/workspaceHook";
import { departmentPopupApi } from "./departmentPopupApi";
import type {
  DepartmentPopupResult, DepartmentReorganization, DepartmentSelection, PopupDepartment,
} from "./departmentPopupModel";

const columns: TreeColumn<PopupDepartment>[] = [
  { type: "data", key: "number", header: "NO", headerClassName: "w-[72px]",
    cellClassName: "text-center", render: (_item, index) => index + 1 },
  { type: "data", key: "code", header: "부서코드", headerClassName: "w-32",
    cellClassName: "px-3 py-2 text-center font-mono text-xs", render: (item) => item.deptCd },
  { type: "tree", key: "name", header: "부서명 / 조직도", cellClassName: "text-left" },
];

export type DepartmentPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (department: DepartmentSelection) => void;
  initialDeptNm?: string;
  initialResult?: DepartmentPopupResult;
};

export default function DepartmentPopup({
  open, onOpenChange, onSelect, initialDeptNm = "", initialResult,
}: DepartmentPopupProps) {
  const workspace = useWorkspaceTab();
  const visible = open && (workspace?.active ?? true);
  const formId = useId();
  const [reorganizations, setReorganizations] = useState<DepartmentReorganization[]>([]);
  const [reorgKey, setReorgKey] = useState("");
  const [deptCd, setDeptCd] = useState("");
  const [deptNm, setDeptNm] = useState(initialDeptNm);
  const [appliedSearch, setAppliedSearch] = useState({ deptCd: "", deptNm: initialDeptNm });
  const [result, setResult] = useState<DepartmentPopupResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState("");
  const request = useRef<AbortController | null>(null);
  const datesRequest = useRef<AbortController | null>(null);
  const [datesError, setDatesError] = useState("");
  const [datesLoading, setDatesLoading] = useState(false);
  const initial = useRef({ initialDeptNm, initialResult });
  initial.current = { initialDeptNm, initialResult };

  const load = useCallback(async (key: string, code: string, name: string) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true); setError(""); setResult(undefined); setSelectedKey(""); setCollapsed(new Set());
    setAppliedSearch({ deptCd: code.trim(), deptNm: name.trim() });
    try {
      const next = await departmentPopupApi.getInfo({ reorgKey: key, deptCd: code.trim(), deptNm: name.trim() }, controller.signal);
      if (!controller.signal.aborted) {
        setResult(next);
        setReorgKey(next.reorganization?.reorgKey ?? "");
      }
    } catch (failure) {
      if (!controller.signal.aborted) setError(getApiErrorMessage(failure, "부서 조회에 실패했습니다."));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);
  const loadDates = useCallback(async () => {
    datesRequest.current?.abort();
    const controller = new AbortController();
    datesRequest.current = controller;
    setDatesLoading(true); setDatesError("");
    try {
      const dates = await departmentPopupApi.getReorganizations(controller.signal);
      if (!controller.signal.aborted) setReorganizations(dates);
    } catch (failure) {
      if (!controller.signal.aborted) setDatesError(getApiErrorMessage(failure, "조직개편일 조회에 실패했습니다."));
    } finally {
      if (!controller.signal.aborted) setDatesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const { initialDeptNm: name, initialResult: data } = initial.current;
    setDeptCd(""); setDeptNm(name); setCollapsed(new Set()); setSelectedKey(""); setError(""); setLoading(false);
    setReorgKey(data?.reorganization?.reorgKey ?? "");
    setResult(data);
    setAppliedSearch({ deptCd: "", deptNm: name.trim() });
    void loadDates();
    if (!data) void load("", "", name);
    return () => { request.current?.abort(); datesRequest.current?.abort(); };
  }, [open, load, loadDates]);

  const choose = (key: string) => {
    const item = result?.departments.find((department) => department.deptKey === key && department.matched);
    if (!item || loading || !visible) return;
    onSelect({ deptCd: item.deptCd, deptNm: item.deptNm });
    onOpenChange(false);
  };
  const search = (event: FormEvent) => { event.preventDefault(); void load(reorgKey, deptCd, deptNm); };
  return (
    <Dialog open={visible} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>부서 조회</DialogTitle>
          <DialogDescription>부서를 더블클릭하거나 행에서 Enter를 누르세요. 검색된 부서의 상위 부서는 경로 확인용입니다.</DialogDescription>
        </DialogHeader>
        <div data-ui="popup-actions" className="flex flex-wrap items-center justify-end gap-2">
          <ActionButton action="search" label="조회" type="submit" form={formId}
            loading={loading} disabled={datesLoading || Boolean(datesError) || !reorganizations.length} />
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>닫기</Button>
        </div>
        <SearchPanel formId={formId} onSearch={search}
          pending={deptCd.trim() !== appliedSearch.deptCd || deptNm.trim() !== appliedSearch.deptNm}>
          <SearchField label="조직개편일" width="compact">
            {(id) => <select id={id} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={reorgKey} disabled={datesLoading || Boolean(datesError) || !reorganizations.length}
              onChange={(event) => {
                setReorgKey(event.target.value);
                void load(event.target.value, deptCd, deptNm);
              }}>
              {!reorganizations.length && <option value="">등록된 조직개편일 없음</option>}
              {reorganizations.map((item) => <option key={item.reorgKey} value={item.reorgKey}>
                {item.reorgDt}
              </option>)}
            </select>}
          </SearchField>
          <SearchField label="부서코드" width="compact">
            {(id) => <Input id={id} value={deptCd} maxLength={30}
              onChange={(event) => setDeptCd(event.target.value)} />}
          </SearchField>
          <SearchField label="부서명" width="keyword">
            {(id) => <Input id={id} value={deptNm} maxLength={200}
              onChange={(event) => setDeptNm(event.target.value)} />}
          </SearchField>
        </SearchPanel>
        <AsyncFeedback loading={datesLoading} error={datesError} onRetry={() => void loadDates()} />
        <AsyncFeedback loading={loading} error={error} onRetry={() => void load(reorgKey, deptCd, deptNm)} />
        <ResultPanel totalCount={result && !loading ? result.matchCount : null}>
          {result && !loading &&
            <TreeTable items={result.departments.map((item) => ({
              id: item.deptKey, parentId: item.parentDeptKey, label: item.deptNm, data: item,
            }))} columns={columns} collapsed={collapsed} selectedId={selectedKey}
              onToggle={(key) => setCollapsed((current) => {
                const next = new Set(current);
                if (next.has(key)) next.delete(key); else next.add(key);
                return next;
              })}
              onSelect={setSelectedKey} onActivate={choose}
              minWidthClassName="min-w-[30rem]" emptyMessage="조회된 부서가 없습니다." showSummary={false} />
          }
        </ResultPanel>
      </DialogContent>
    </Dialog>
  );
}

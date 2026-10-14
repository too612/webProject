import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getApiErrorMessage } from "../../api/apiError";
import { Button, Input } from "../../ui";
import type { FormControlProps } from "../../ui/form/FormField";
import DepartmentPopup from "./DepartmentPopup";
import { departmentPopupApi } from "./departmentPopupApi";
import type { DepartmentPopupResult, DepartmentSelection } from "./departmentPopupModel";

type DepartmentFieldProps = Partial<FormControlProps> & {
  value: string;
  onChange: (code: string, department?: DepartmentSelection) => void;
  disabled?: boolean;
  active?: boolean;
};

export default function DepartmentField({
  value, onChange, disabled = false, active = true, ...control
}: DepartmentFieldProps) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [initialResult, setInitialResult] = useState<DepartmentPopupResult>();
  const [initialName, setInitialName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resolvedCode = useRef("");
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!active || disabled) { request.current?.abort(); setLoading(false); return; }
    if (value === resolvedCode.current) return;
    request.current?.abort();
    resolvedCode.current = "";
    setName(""); setError(""); setLoading(false);
    if (!value) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    void departmentPopupApi.getInfo({ deptCd: value, exactCode: true }, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      const match = result.departments.find((item) => item.matched);
      if (match) { resolvedCode.current = value; setName(match.deptNm); }
      else setError("최근 조직개편에 해당 부서가 없습니다. 부서를 다시 선택하세요.");
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) setError(getApiErrorMessage(failure, "부서명을 불러오지 못했습니다."));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [value, active, disabled]);
  useEffect(() => () => request.current?.abort(), []);

  const select = (department: DepartmentSelection) => {
    resolvedCode.current = department.deptCd;
    setName(department.deptNm); setError(""); setLoading(false);
    onChange(department.deptCd, department);
  };
  const showPopup = (data?: DepartmentPopupResult) => {
    request.current?.abort(); setLoading(false); setError("");
    setInitialName(name.trim()); setInitialResult(data); setOpen(true);
  };
  const resolveName = async () => {
    if (disabled || !active || loading) return;
    if (!name.trim()) { showPopup(); return; }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true); setError("");
    try {
      const data = await departmentPopupApi.getInfo({ deptNm: name.trim() }, controller.signal);
      if (controller.signal.aborted) return;
      const matches = data.departments.filter((item) => item.matched);
      if (matches.length === 1) select(matches[0]);
      else if (matches.length > 1) showPopup(data);
      else setError("조회된 부서가 없습니다. 검색어를 변경하거나 부서 조회를 이용하세요.");
    } catch (failure) {
      if (!controller.signal.aborted) setError(getApiErrorMessage(failure, "부서 조회에 실패했습니다."));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex items-center gap-1">
        <Input {...control} value={name} maxLength={200} placeholder="부서명 입력 후 Enter"
          disabled={disabled} className="min-w-0 flex-1"
          onChange={(event) => {
            request.current?.abort(); setLoading(false); setError(""); setName(event.target.value);
            resolvedCode.current = ""; onChange("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault(); event.stopPropagation(); void resolveName();
            }
          }} />
        <Button type="button" variant="outline" size="icon" aria-label="부서 조회"
          disabled={disabled || loading} onClick={() => showPopup()}>
          <Search className="size-4" />
        </Button>
        <Input aria-label="부서코드" value={value} disabled className="w-28 shrink-0" />
      </div>
      {loading && <p role="status" className="text-xs text-muted-foreground">부서 조회 중...</p>}
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <DepartmentPopup open={open && active && !disabled} onOpenChange={setOpen} onSelect={select}
        initialDeptNm={initialName} initialResult={initialResult} />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getApiErrorMessage } from "../../api/apiError";
import { Button, Input } from "../../ui";
import type { FormControlProps } from "../../ui/form/FormField";
import EmployeePopup from "./EmployeePopup";
import { employeePopupApi } from "./employeePopupApi";
import { ACTIVE_SERVICE_STATUS, type EmployeeSelection } from "./employeePopupModel";

type EmployeeFieldProps = Partial<FormControlProps> & {
  value: string;
  employee?: EmployeeSelection | null;
  onChange: (employee: EmployeeSelection | null) => boolean | void;
  nameValue?: string;
  onNameChange?: (name: string) => void;
  disabled?: boolean;
  active?: boolean;
};

export default function EmployeeField({
  value, employee, onChange, nameValue, onNameChange, disabled = false, active = true, ...control
}: EmployeeFieldProps) {
  const [name, setName] = useState(employee?.nameKo ?? "");
  const [employeeNo, setEmployeeNo] = useState(employee?.employeeNo ?? "");
  const [open, setOpen] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [initialServiceStatusCode, setInitialServiceStatusCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const resolvedKey = useRef(employee?.personKey ?? "");
  const displayedName = nameValue ?? name;

  useEffect(() => {
    if (!active) { request.current?.abort(); setLoading(false); return; }
    if (employee?.personKey === value && value) {
      request.current?.abort();
      resolvedKey.current = value;
      if (nameValue === undefined) setName(employee.nameKo);
      setEmployeeNo(employee.employeeNo);
      setLoading(false); setError(""); return;
    }
    if (value === resolvedKey.current) return;
    request.current?.abort();
    resolvedKey.current = ""; setName(""); setEmployeeNo(""); setError(""); setLoading(false);
    if (!value) return;
    const controller = new AbortController();
    request.current = controller; setLoading(true);
    void employeePopupApi.getInfo({ personKey: value, size: 1 }, controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      const match = data.content[0];
      if (match) {
        resolvedKey.current = value; setName(match.nameKo); setEmployeeNo(match.employeeNo);
      } else setError("대상 직원이 없습니다. 직원을 다시 선택하세요.");
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) setError(getApiErrorMessage(failure, "직원 정보를 불러오지 못했습니다."));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [value, employee, active, nameValue]);
  useEffect(() => {
    if (disabled) { request.current?.abort(); setLoading(false); }
  }, [disabled]);
  useEffect(() => () => request.current?.abort(), []);

  const select = (next: EmployeeSelection) => {
    if (!active || disabled || onChange(next) === false) return;
    resolvedKey.current = next.personKey;
    if (nameValue === undefined) setName(next.nameKo);
    onNameChange?.(next.nameKo);
    setEmployeeNo(next.employeeNo); setError(""); setLoading(false);
  };
  const showPopup = (serviceStatusCode = "") => {
    request.current?.abort(); setLoading(false); setError("");
    setInitialName(displayedName.trim()); setInitialServiceStatusCode(serviceStatusCode); setOpen(true);
  };
  const resolveName = async () => {
    if (disabled || !active || loading) return;
    if (!displayedName.trim()) { showPopup(); return; }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller; setLoading(true); setError("");
    try {
      const data = await employeePopupApi.getInfo({
        nameKo: displayedName.trim(), serviceStatusCode: ACTIVE_SERVICE_STATUS, size: 2,
      }, controller.signal);
      if (controller.signal.aborted) return;
      if (data.totalElements === 1 && data.content[0]) select(data.content[0]);
      else if (data.totalElements > 1) showPopup(ACTIVE_SERVICE_STATUS);
      else setError("조회된 재직 직원이 없습니다. 검색어를 변경하거나 직원 조회를 이용하세요.");
    } catch (failure) {
      if (!controller.signal.aborted) setError(getApiErrorMessage(failure, "직원 조회에 실패했습니다."));
    } finally { if (!controller.signal.aborted) setLoading(false); }
  };
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex items-center gap-1">
        <Input {...control} value={displayedName} maxLength={100} placeholder="성명 입력 후 Enter"
          disabled={disabled} className="min-w-0 flex-1"
          onChange={(event) => {
            if (value && onChange(null) === false) return;
            request.current?.abort(); setLoading(false); setError("");
            resolvedKey.current = "";
            if (nameValue === undefined) setName(event.target.value);
            onNameChange?.(event.target.value);
            setEmployeeNo("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault(); event.stopPropagation(); void resolveName();
            }
          }} />
        <Button type="button" variant="outline" size="icon" aria-label="직원 조회"
          disabled={disabled || loading} onClick={() => showPopup()}><Search className="size-4" /></Button>
        <Input aria-label="사번" value={employeeNo} disabled className="w-28 shrink-0" />
      </div>
      {loading && <p role="status" className="text-xs text-muted-foreground">직원 조회 중...</p>}
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <EmployeePopup open={open && active && !disabled} onOpenChange={setOpen} onSelect={select}
        initialNameKo={initialName} initialServiceStatusCode={initialServiceStatusCode} />
    </div>
  );
}

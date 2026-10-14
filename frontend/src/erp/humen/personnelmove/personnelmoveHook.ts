import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { blockToPage, type GridDataState, type GridLoadParams } from "../../../common/grid";
import { INITIAL_GRID_STATE } from "../../../common/grid/infiniteDatasource";
import { getApiErrorMessage } from "../../../common/api/apiError";
import { useAsyncResource, useSearchQuery } from "../../../common/ui";
import { focusFirstInvalid, type FieldErrors } from "../../../common/ui/form/formValidation";
import { personnelmoveApi } from "./personnelmoveApi";
import {
  EMPTY_FORM, EMPTY_OPTIONS, EMPTY_SEARCH, type AssignmentScope, type ConcurrentMaster,
  type EmployeeOption, type PersonnelMoveForm, type PersonnelMoveRow, type PersonnelMoveSearch,
} from "./personnelmoveModel";
import { equalSearch, formFromRow, isHistorical, normalizeAssignment, validateAssignment, validateSearch } from "./personnelmoveValidation";

export function usePersonnelMovePage(scope: AssignmentScope) {
  const [params] = useSearchParams();
  const [initialSearch] = useState<PersonnelMoveSearch>(() => ({
    ...EMPTY_SEARCH, keyword: params.get("keyword") ?? "", deptCd: params.get("deptCd") ?? "",
    gradeCode: params.get("gradeCode") ?? "", personKey: params.get("personKey") ?? "",
    concurrentKey: scope === "concurrent" ? params.get("concurrentKey") ?? "" : "",
    assignmentTypeCode: params.get("assignmentTypeCode") ?? "",
    assignmentDateFrom: params.get("assignmentDateFrom") ?? "",
    assignmentDateTo: params.get("assignmentDateTo") ?? "",
  }));
  const search = useSearchQuery(initialSearch, equalSearch);
  const [searchErrors, setSearchErrors] = useState<FieldErrors<PersonnelMoveSearch>>({});
  const options = useAsyncResource(personnelmoveApi.getOptions, "발령 선택항목을 불러오지 못했습니다.");
  const [gridState, setGridState] = useState<GridDataState>(INITIAL_GRID_STATE);
  const excelState = useRef<{ token?: string }>({});
  const [selectedRow, setSelectedRow] = useState<PersonnelMoveRow | null>(null);
  const [detail, setDetail] = useState<PersonnelMoveRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const detailRequest = useRef<AbortController | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PersonnelMoveForm>({ ...EMPTY_FORM });
  const [baseline, setBaseline] = useState<PersonnelMoveForm>({ ...EMPTY_FORM });
  const [editing, setEditing] = useState<PersonnelMoveRow | null>(null);
  const [formEmployee, setFormEmployee] = useState<EmployeeOption | null>(null);
  const [errors, setErrors] = useState<FieldErrors<PersonnelMoveForm>>({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
  const [message, setMessage] = useState("");
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [historicalDelete, setHistoricalDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const dirty = formOpen && JSON.stringify(form) !== JSON.stringify(baseline);

  const [employee, setEmployee] = useState<EmployeeOption | null>(null);
  const [master, setMaster] = useState<ConcurrentMaster | null>(null);
  const [masterSaving, setMasterSaving] = useState(false);
  const masterInFlight = useRef(false);
  const masterPerson = useRef("");
  const [masterError, setMasterError] = useState("");
  const [pendingEmployee, setPendingEmployee] = useState<EmployeeOption | null>(null);
  const [pendingMaster, setPendingMaster] = useState<ConcurrentMaster | null>(null);
  const [switchConfirm, setSwitchConfirm] = useState(false);
  const concurrentLoader = useCallback((signal: AbortSignal) =>
    personnelmoveApi.getConcurrent(employee?.personKey ?? "", signal), [employee?.personKey]);
  const masters = useAsyncResource(concurrentLoader, "겸임 인사를 불러오지 못했습니다.");

  const loadRows = useCallback(async ({ startRow, endRow, sortModel, signal }: GridLoadParams) => {
    const invalid = validateSearch(search.applied);
    if (Object.keys(invalid).length) throw new Error(Object.values(invalid).join(" "));
    const { page, size } = blockToPage(startRow, endRow);
    const sort = sortModel?.[0];
    const result = await personnelmoveApi.getList({
      ...search.applied, scope, page, size,
      ...(sort ? { sort: sort.colId, direction: sort.sort ?? "asc" } : {}),
    }, signal);
    if (!signal?.aborted) excelState.current.token = result.excelToken;
    return { rows: result.content, totalCount: result.totalElements };
  }, [scope, search.applied, search.revision]);
  useEffect(() => () => detailRequest.current?.abort(), []);
  const closeDetail = useCallback(() => {
    detailRequest.current?.abort();
    setDetailOpen(false);
  }, []);
  const selectRow = useCallback(async (row: PersonnelMoveRow) => {
    detailRequest.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    setSelectedRow(row); setDetail(null); setDetailOpen(true);
    setDetailError(""); setDetailLoading(true);
    setHistoricalDelete(false); setDeleteReason(""); setSaveError("");
    try {
      const result = await personnelmoveApi.getDetail(row.assignmentKey, controller.signal);
      if (!controller.signal.aborted) setDetail(result);
    } catch (error) {
      if (!controller.signal.aborted) setDetailError(getApiErrorMessage(error, "발령 상세 조회 실패"));
    } finally {
      if (!controller.signal.aborted) setDetailLoading(false);
    }
  }, []);
  const applySearch = useCallback((event: FormEvent) => {
    event.preventDefault();
    const found = validateSearch(search.draft);
    setSearchErrors(found);
    if (Object.keys(found).length) {
      const target = event.currentTarget;
      if (target instanceof HTMLFormElement) requestAnimationFrame(() => focusFirstInvalid(target));
      return;
    }
    search.apply({ ...search.draft, keyword: search.draft.keyword.trim(), deptCd: search.draft.deptCd.trim() });
    closeDetail();
  }, [search.apply, search.draft, closeDetail]);
  const updateSearch = (key: keyof PersonnelMoveSearch, value: string) => {
    search.setDraft((current) => ({ ...current, [key]: value }));
    setSearchErrors((current) => ({ ...current, [key]: undefined }));
  };
  const discardForm = () => {
    setFormOpen(false); setForm({ ...EMPTY_FORM }); setBaseline({ ...EMPTY_FORM });
    setFormEmployee(null);
    setEditing(null); setErrors({}); setSaveError(""); setDiscardConfirm(false);
  };
  const closeForm = () => {
    if (inFlight.current) return;
    if (dirty) setDiscardConfirm(true);
    else discardForm();
  };
  const openCreate = () => {
    if (inFlight.current) return;
    const next = {
      ...EMPTY_FORM, personKey: employee?.personKey ?? search.applied.personKey,
      concurrentKey: scope === "concurrent" ? master?.concurrentKey ?? search.applied.concurrentKey : "",
      deptCd: master?.deptCd ?? employee?.deptCd ?? "",
      gradeCode: master?.gradeCode ?? employee?.gradeCode ?? "",
    };
    setForm(next); setBaseline(next); setEditing(null); setErrors({}); setSaveError("");
    setFormEmployee(employee);
    setFormOpen(true); setMessage("");
  };
  const openEdit = () => {
    if (!detail || inFlight.current) return;
    const next = formFromRow(detail);
    setForm(next); setBaseline(next); setEditing(detail); setErrors({}); setSaveError(""); setFormOpen(true);
    setFormEmployee(detail);
  };
  const updateForm = <K extends keyof PersonnelMoveForm>(key: K, value: PersonnelMoveForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined })); setSaveError("");
  };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const found = validateAssignment(form, scope, editing);
    setErrors(found);
    if (Object.keys(found).length) {
      const target = event.currentTarget;
      requestAnimationFrame(() => focusFirstInvalid(target));
      return;
    }
    if (options.loading || options.error) {
      setSaveError("선택항목을 불러온 후 저장할 수 있습니다."); return;
    }
    inFlight.current = true; setSaving(true); setSaveError("");
    try {
      const saved = await personnelmoveApi.save(normalizeAssignment(form, scope, editing), editing?.assignmentKey);
      discardForm(); closeDetail(); search.refresh();
      setMessage(`${saved.syncPaused ? "저장되었습니다. 동기화가 중지되어 인사 마스터 반영은 재개 후 처리됩니다." :
        saved.currentEffective ? "저장되었습니다. 현재 유효 발령은 인사 마스터에 즉시 반영됩니다." :
        "저장되었습니다. 미래 발령은 적용일에 반영되며, 과거 이력 정정은 현재 인사정보를 변경하지 않습니다."} 현재 검색조건에 따라 목록에 보이지 않을 수 있습니다.`);
    } catch (error) {
      setSaveError(getApiErrorMessage(error, "발령 저장 실패"));
    } finally { inFlight.current = false; setSaving(false); }
  };
  const requestDelete = () => {
    if (!detail || inFlight.current) return;
    if (isHistorical(detail) && (!historicalDelete || !deleteReason.trim())) {
      setSaveError("과거 이력 삭제 허용과 편집 사유가 필요합니다."); return;
    }
    setDeleteConfirm(true);
  };
  const remove = async () => {
    if (!detail || inFlight.current) return;
    inFlight.current = true; setSaving(true); setDeleteConfirm(false); setSaveError("");
    try {
      await personnelmoveApi.remove(detail, historicalDelete, deleteReason.trim());
      closeDetail(); search.refresh();
      setMessage(detail.syncPaused ? "삭제되었습니다(소프트 삭제). 동기화 중지 중이며 재개 후 반영됩니다."
        : "삭제되었습니다(소프트 삭제). 현재 유효 발령은 다시 계산되어 반영됩니다.");
    } catch (error) {
      setSaveError(getApiErrorMessage(error, "발령 삭제 실패"));
    } finally { inFlight.current = false; setSaving(false); }
  };
  const changeTarget = (nextEmployee: EmployeeOption | null, nextMaster: ConcurrentMaster | null) => {
    setEmployee(nextEmployee); setMaster(nextMaster); setMasterError("");
    masterPerson.current = nextEmployee?.personKey ?? "";
    const next = {
      ...search.draft, personKey: nextEmployee?.personKey ?? "",
      concurrentKey: scope === "concurrent" ? nextMaster?.concurrentKey ?? "" : "",
    };
    search.setDraft(next); search.apply(next); closeDetail();
  };
  const requestTarget = (nextEmployee: EmployeeOption | null, nextMaster: ConcurrentMaster | null) => {
    if (inFlight.current || masterInFlight.current) return false;
    if (dirty) {
      setPendingEmployee(nextEmployee); setPendingMaster(nextMaster); setSwitchConfirm(true);
      return false;
    } else {
      if (formOpen) discardForm();
      changeTarget(nextEmployee, nextMaster);
      return true;
    }
  };
  const confirmSwitch = () => {
    discardForm(); setSwitchConfirm(false); changeTarget(pendingEmployee, pendingMaster);
    setPendingEmployee(null); setPendingMaster(null);
  };
  const createMaster = async () => {
    if (!employee || masterInFlight.current || inFlight.current) return;
    const personKey = employee.personKey;
    masterInFlight.current = true; setMasterSaving(true); setMasterError("");
    try {
      const created = await personnelmoveApi.createConcurrent(personKey);
      if (masterPerson.current === personKey) {
        masters.retry();
        if (dirty) {
          setPendingEmployee(employee); setPendingMaster(created); setSwitchConfirm(true);
        } else {
          if (formOpen) discardForm();
          changeTarget(employee, created);
        }
        setMessage(`${created.employeeNo} 겸임 인사 마스터가 생성되었습니다. 발령은 별도로 등록하세요.`);
      }
    } catch (error) {
      if (masterPerson.current === personKey) setMasterError(getApiErrorMessage(error, "겸임 인사 생성 실패"));
    } finally { masterInFlight.current = false; setMasterSaving(false); }
  };
  return {
    scope, search, searchErrors, updateSearch, applySearch, loadRows, gridState, setGridState, excelState,
    options: options.data ?? EMPTY_OPTIONS, optionsLoading: options.loading, optionsError: options.error,
    retryOptions: options.retry, selectedRow, detail, detailOpen, detailLoading, detailError,
    selectRow, closeDetail, formOpen, form, editing, errors, saveError, saving, message,
    openCreate, openEdit, closeForm, updateForm, save, dirty, discardConfirm, setDiscardConfirm, discardForm,
    deleteConfirm, setDeleteConfirm, historicalDelete, setHistoricalDelete, deleteReason, setDeleteReason,
    requestDelete, remove, formEmployee,
    selectFormEmployee: (nextEmployee: EmployeeOption | null) => {
      setFormEmployee(nextEmployee); updateForm("personKey", nextEmployee?.personKey ?? "");
    },
    employee, master, masters, requestTarget, createMaster, masterSaving, masterError,
    switchConfirm, setSwitchConfirm, confirmSwitch,
  };
}

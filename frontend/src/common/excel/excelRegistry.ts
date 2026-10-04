import type { ExcelSheet } from "./excelModel";

interface Entry {
  readonly scope: string;
  readonly id: string;
  readonly classNames: readonly string[];
  readonly snapshot: () => ExcelSheet;
  saved?: ExcelSheet;
  invalid?: string;
  active: boolean;
}
const entries = new Map<string, Entry>();
const key = (scope: string, id: string) => JSON.stringify([scope, id]);

export function registerExcelGrid(entry: Omit<Entry, "active" | "saved" | "invalid">) {
  const entryKey = key(entry.scope, entry.id);
  if (entries.get(entryKey)?.active) throw new Error(`엑셀 그리드 ID가 중복되었습니다: ${entry.id}`);
  entries.set(entryKey, { ...entry, active: true });
}
export function retainExcelGrid(scope: string, id: string) {
  const entry = entries.get(key(scope, id));
  if (!entry) return;
  entry.active = false;
  if (entry.invalid) return;
  try { entry.saved = entry.snapshot(); }
  catch (error) {
    entry.saved = undefined;
    entry.invalid = error instanceof Error ? error.message : "엑셀 조회 상태 보관에 실패했습니다.";
  }
}
export function invalidateExcelGrid(scope: string, id: string, message: string) {
  const entry = entries.get(key(scope, id));
  if (entry) { entry.saved = undefined; entry.invalid = message; }
}
export function markExcelGridReady(scope: string, id: string) {
  const entry = entries.get(key(scope, id));
  if (entry?.active) entry.invalid = undefined;
}
export function clearExcelScope(scope: string) {
  for (const [entryKey, entry] of entries) if (entry.scope === scope) entries.delete(entryKey);
}
export function resolveExcelGrid(target: string, scope?: string): ExcelSheet {
  const matches = [...entries.values()].filter(entry => (!scope || entry.scope === scope) &&
    (target.startsWith("#") ? entry.id === target.slice(1) :
      target.startsWith(".") ? entry.classNames.includes(target.slice(1)) : entry.id === target));
  if (matches.length !== 1) throw new Error(matches.length ? `엑셀 대상이 여러 개입니다: ${target}` : `조회하지 않은 엑셀 대상입니다: ${target}`);
  const entry = matches[0];
  if (entry.invalid) throw new Error(entry.invalid);
  return entry.saved ?? entry.snapshot();
}
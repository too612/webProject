import type { PersonnelMoveRow } from "./personnelmoveModel";

export function todayLocal(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: "year" | "month" | "day") => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function assignmentStatus(row: Pick<PersonnelMoveRow,
  "applied" | "currentEffective" | "syncPaused" | "pending">) {
  if (row.applied) return "반영";
  if (row.currentEffective) return row.syncPaused ? "반영 보류" : "반영 대기";
  return row.pending ? "예정" : "과거 이력";
}

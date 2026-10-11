import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";
import { mkdir, rm } from "node:fs/promises";

let server, rules, model, status;
const cacheDir = "node_modules/.personnelmove-unit-cache";
before(async () => {
  await mkdir(cacheDir, { recursive: true });
  server = await createServer({
    cacheDir, server: { middlewareMode: true, hmr: false, watch: null }, appType: "custom",
  });
  [rules, model, status] = await Promise.all([
    "/src/erp/humen/personnelmove/personnelmoveValidation.ts",
    "/src/erp/humen/personnelmove/personnelmoveModel.ts",
    "/src/erp/humen/personnelmove/personnelmoveStatus.ts",
  ].map((path) => server.ssrLoadModule(path)));
});
test("calendar range filters reject invalid and reversed dates", () => {
  assert.deepEqual(rules.validateSearch({ ...model.EMPTY_SEARCH, assignmentDateFrom: "2026-01-01", assignmentDateTo: "2026-10-09" }), {});
  assert.ok(rules.validateSearch({ ...model.EMPTY_SEARCH, assignmentDateFrom: "2026-02-30" }).assignmentDateFrom);
  assert.ok(rules.validateSearch({ ...model.EMPTY_SEARCH, assignmentDateFrom: "2026-10-10", assignmentDateTo: "2026-10-09" }).assignmentDateTo);
});
test("status uses server pending flag and business dates use Seoul midnight", () => {
  assert.equal(status.assignmentStatus({ ...row(), pending: false, applied: false, syncPaused: true }), "과거 이력");
  assert.equal(status.assignmentStatus({ ...row(), pending: true, applied: false, currentEffective: true, syncPaused: true }), "반영 보류");
  assert.equal(status.assignmentStatus({ ...row(), pending: true, applied: false, currentEffective: true, syncPaused: false }), "반영 대기");
  assert.equal(status.assignmentStatus({ ...row(), pending: true, applied: false }), "예정");
  assert.equal(status.assignmentStatus({ ...row(), applied: true }), "반영");
  assert.equal(status.todayLocal(new Date("2026-10-08T16:00:00Z")), "2026-10-09");
});
after(async () => { await server?.close(); await rm(cacheDir, { recursive: true, force: true }); });
const valid = () => ({ ...model.EMPTY_FORM, personKey: "person1", assignmentDate: "2026-10-09",
  assignmentOrder: "2", deptCd: "DEPT", gradeCode: "102-010", assignmentTypeCode: "105-010" });
const row = () => ({
  ...rules.normalizeAssignment(valid(), "main", null), assignmentKey: "assignment1",
  employeeNo: "E1", nameKo: "인사", version: 1, assignmentDate: "2026-01-01", currentEffective: false,
});

test("required department, grade, calendar date, positive order and concurrent target", () => {
  assert.deepEqual(rules.validateAssignment(valid(), "main", null, "2026-10-09"), {});
  assert.ok(rules.validateAssignment({ ...valid(), assignmentTypeCode: "" }, "main", null).assignmentTypeCode);
  for (const assignmentOrder of ["0", "-1", "1.1", "1e2", "2147483648"]) {
    assert.ok(rules.validateAssignment({ ...valid(), assignmentOrder }, "main", null).assignmentOrder);
  }
  const errors = rules.validateAssignment({ ...valid(), deptCd: " ", gradeCode: "", assignmentDate: "2026-02-30" }, "concurrent", null);
  for (const field of ["deptCd", "gradeCode", "assignmentDate", "concurrentKey"]) assert.ok(errors[field]);
  assert.ok(rules.validateAssignment({ ...valid(), assignmentEndDate: "2026-01-01" }, "main", null).assignmentEndDate);
});
test("same date distinct orders allowed and optional selections clear to null", () => {
  const first = rules.normalizeAssignment(valid(), "main", null);
  const second = rules.normalizeAssignment({ ...valid(), assignmentOrder: "3" }, "main", null);
  assert.equal(first.assignmentDate, second.assignmentDate);
  assert.notEqual(first.assignmentOrder, second.assignmentOrder);
  for (const field of ["positionCode", "employmentTypeCode", "jobTitleCode", "concurrentKey"]) assert.equal(first[field], null);
});
test("past edits require explicit checkbox/reason and preserve non-effective ordering", () => {
  const original = row();
  const form = rules.formFromRow(original);
  assert.ok(rules.validateAssignment(form, "main", original, "2026-10-09").historicalEdit);
  assert.ok(rules.validateAssignment(form, "main", original, "2026-10-09").historicalReason);
  const permitted = { ...form, historicalEdit: true, historicalReason: "이력 정정" };
  assert.deepEqual(rules.validateAssignment(permitted, "main", original, "2026-10-09"), {});
  assert.ok(rules.validateAssignment({ ...permitted, assignmentOrder: "3" }, "main", original, "2026-10-09").assignmentOrder);
  assert.ok(rules.validateAssignment({ ...permitted, assignmentDate: "2026-01-02" }, "main", original, "2026-10-09").assignmentDate);
  assert.equal(rules.normalizeAssignment(permitted, "main", original).version, 1);
});

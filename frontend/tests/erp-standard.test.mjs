import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let server;
let cacheDir;
let validation, manager, datasource, columns, apiErrors, fields, search, actions, feedback, detail;
before(async () => {
  cacheDir = await mkdtemp(join(tmpdir(), "webproject-erp-unit-"));
  server = await createServer({
    cacheDir,
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: "custom",
  });
  [validation, manager, datasource, columns, apiErrors, fields, search, actions, feedback, detail] =
    await Promise.all([
      "/src/common/ui/form/formValidation.ts",
      "/src/erp/humen/manager/managerValidation.ts",
      "/src/common/grid/infiniteDatasource.ts",
      "/src/common/grid/erpGrid.ts",
      "/src/common/api/apiError.ts",
      "/src/common/ui/form/FormField.tsx",
      "/src/common/ui/shell/SearchPanel.tsx",
      "/src/common/ui/shell/ListPageActions.tsx",
      "/src/common/ui/AsyncFeedback.tsx",
      "/src/common/grid/useGridDetail.ts",
    ].map((path) => server.ssrLoadModule(path)));
});
after(async () => {
  await server?.close();
  if (cacheDir) await rm(cacheDir, { recursive: true });
});

test("엑셀 registry는 방문한 세 탭의 마지막 조회를 보관하고 무효·미조회·다른 scope를 거절한다", async () => {
  const registry = await server.ssrLoadModule("/src/common/excel/excelRegistry.ts");
  const scope = "three-tabs";
  for (let index = 1; index <= 3; index++) {
    registry.registerExcelGrid({ scope, id: `grid-${index}`, classNames: [`tab-${index}`],
      snapshot: () => ({ name: `탭${index}`, columns: [{ id: "name", title: "이름", width: 100 }],
        blocks: [{ token: `token-${index}`, indexes: [0, 1] }] }) });
    if (index < 3) registry.retainExcelGrid(scope, `grid-${index}`);
  }
  assert.deepEqual([1, 2, 3].map(index => registry.resolveExcelGrid(`#grid-${index}`, scope).name), ["탭1", "탭2", "탭3"]);
  assert.equal(registry.resolveExcelGrid(".tab-1", scope).blocks[0].token, "token-1");
  assert.throws(() => registry.resolveExcelGrid("#missing", scope), /조회하지 않은/);
  assert.throws(() => registry.resolveExcelGrid("#grid-1", "different"), /조회하지 않은/);
  registry.invalidateExcelGrid(scope, "grid-1", "조건 변경");
  assert.throws(() => registry.resolveExcelGrid("#grid-1", scope), /조건 변경/);
  registry.invalidateExcelGrid(scope, "grid-3", "조회 중");
  assert.throws(() => registry.resolveExcelGrid("#grid-3", scope), /조회 중/);
  registry.markExcelGridReady(scope, "grid-3");
  assert.equal(registry.resolveExcelGrid("#grid-3", scope).name, "탭3");
  registry.clearExcelScope(scope);
  assert.throws(() => registry.resolveExcelGrid("#grid-3", scope), /조회하지 않은/);
});

const validPerson = () => ({ employeeNo: "TEST", nameKo: "Person", serviceStatusCode: "101-010" });
const emptySearch = () => ({
  keyword: "", deptCd: "", gradeCode: "", positionCode: "", employmentTypeCode: "", serviceStatusCode: "",
});
function deferred() {
  let resolve, reject;
  const promise = new Promise((success, failure) => { resolve = success; reject = failure; });
  return { promise, resolve, reject };
}
function block(startRow = 0, sort = "asc") {
  const calls = { successes: [], failures: 0 };
  return {
    params: {
      startRow, endRow: startRow + 50,
      sortModel: [{ colId: "employeeNo", sort }], filterModel: {},
      successCallback: (...args) => calls.successes.push(args),
      failCallback: () => { calls.failures += 1; },
    },
    calls,
  };
}

test("field rules reject whitespace, overlength and invalid calendar dates", () => {
  const errors = manager.validateManagerCreate({
    ...validPerson(), employeeNo: " ", nameKo: "x".repeat(101),
    nameEn: "x".repeat(101), birthDate: "2025-02-29", hireDate: "2024-02-30", serviceStatusCode: "",
  });
  assert.deepEqual(Object.keys(errors), ["employeeNo", "nameKo", "nameEn", "birthDate", "hireDate", "serviceStatusCode"]);
  assert.deepEqual(manager.validateManagerCreate({
    ...validPerson(), employeeNo: "x".repeat(30), nameKo: "x".repeat(100), birthDate: "2024-02-29",
  }), {});
  assert.ok(manager.validateManagerCreate({ ...validPerson(), employeeNo: "x".repeat(31) }).employeeNo);
  assert.ok(manager.validateManagerCreate({ ...validPerson(), hireDate: "0000-01-01" }).hireDate);
  assert.ok(!validation.isIsoDate("2025-1-01"));
  assert.equal(validation.isIsoDate("2025-12-31"), true);
});

test("normalization and pending comparisons keep domain values out of generic hooks", () => {
  const input = { ...validPerson(), employeeNo: " TEST ", nameKo: " Person ", nameEn: " ", hireDate: "" };
  const normalized = manager.normalizeManagerCreate(input);
  assert.equal(normalized.employeeNo, "TEST");
  assert.equal(normalized.nameKo, "Person");
  assert.equal(normalized.nameEn, undefined);
  assert.equal(normalized.hireDate, undefined);
  assert.equal(input.employeeNo, " TEST ");
  assert.equal(manager.equalManagerSearch({ ...emptySearch(), keyword: " a " }, { ...emptySearch(), keyword: "a" }), true);
  assert.equal(manager.equalManagerSearch({ ...emptySearch(), gradeCode: "102-010" }, emptySearch()), false);
  assert.equal(manager.hasManagerSearch(emptySearch()), false);
  assert.equal(manager.hasManagerSearch({ ...emptySearch(), deptCd: "D01" }), true);
});

test("block paging validates exact boundaries and integer ranges", () => {
  assert.deepEqual(datasource.blockToPage(50, 100), { page: 1, size: 50 });
  assert.deepEqual(datasource.blockToPage(0, 100), { page: 0, size: 100 });
  for (const [start, end] of [[-50, 0], [0, 0], [0, 101], [1, 51], [0.5, 50.5], [0, NaN]]) {
    assert.throws(() => datasource.blockToPage(start, end), /블록/);
  }
});

test("infinite loading distinguishes first block, additional block and empty result", async () => {
  const states = [];
  const first = deferred(), second = deferred();
  let requests = 0;
  const source = datasource.createInfiniteDatasource(() => ++requests === 1 ? first.promise : second.promise, (state) => states.push(state));
  const initial = block(), more = block(50);
  const one = source.getRows(initial.params);
  assert.equal(states.at(-1).phase, "initialLoading");
  first.resolve({ rows: [{ id: 1 }], totalCount: 51 });
  await one;
  assert.equal(states.at(-1).phase, "ready");
  assert.equal(states.at(-1).totalCount, 51);
  const two = source.getRows(more.params);
  assert.equal(states.at(-1).phase, "loadingMore");
  second.resolve({ rows: [{ id: 51 }], totalCount: 51 });
  await two;
  assert.equal(states.at(-1).pendingRequests, 0);
  assert.equal(more.calls.successes.length, 1);
  source.destroy();
  const emptyStates = [];
  const empty = datasource.createInfiniteDatasource(async () => ({ rows: [], totalCount: 0 }), (state) => emptyStates.push(state));
  await empty.getRows(block().params);
  assert.equal(emptyStates.at(-1).phase, "empty");
  empty.destroy();
});

test("concurrent additional blocks keep pending counts and failures until their own retry", async () => {
  const failed = deferred(), success = deferred();
  const states = [];
  const source = datasource.createInfiniteDatasource(
    ({ startRow }) => startRow === 50 ? failed.promise : success.promise,
    (state) => states.push(state),
  );
  const bad = block(50), good = block();
  const one = source.getRows(bad.params), two = source.getRows(good.params);
  assert.equal(states.at(-1).pendingRequests, 2);
  failed.reject(new Error("temporary failure"));
  await one;
  success.resolve({ rows: [], totalCount: 100 });
  await two;
  assert.equal(states.at(-1).phase, "error");
  assert.equal(states.at(-1).error, "temporary failure");
  assert.equal(bad.calls.failures, 1);
  failed.promise = Promise.resolve({ rows: [], totalCount: 100 });
  await source.getRows(bad.params);
  assert.equal(states.at(-1).phase, "ready");
  assert.equal(states.at(-1).error, null);
  source.destroy();
});

test("sort races cancel stale results and reset first-load state", async () => {
  const old = deferred(), current = deferred();
  const states = [], signals = [];
  const source = datasource.createInfiniteDatasource(({ sortModel, signal }) => {
    signals.push(signal);
    return sortModel[0].sort === "asc" ? old.promise : current.promise;
  }, (state) => states.push(state));
  const a = block(), b = block(0, "desc");
  const first = source.getRows(a.params), next = source.getRows(b.params);
  assert.equal(signals[0].aborted, true);
  assert.equal(states.at(-1).phase, "initialLoading");
  current.resolve({ rows: [{ id: 2 }], totalCount: 1 });
  await next;
  const final = states.at(-1);
  old.resolve({ rows: [{ id: 1 }], totalCount: 999 });
  await first;
  assert.equal(states.at(-1), final);
  assert.equal(a.calls.successes.length, 0);
  assert.equal(b.calls.successes[0][1], 1);
  source.destroy();
});

test("destroyed datasource does not publish stale failures", async () => {
  const pending = deferred(), states = [];
  const source = datasource.createInfiniteDatasource(() => pending.promise, (state) => states.push(state));
  const request = block();
  const task = source.getRows(request.params);
  source.destroy();
  const count = states.length;
  pending.reject(new Error("late failure"));
  await task;
  assert.equal(states.length, count);
  assert.equal(request.calls.failures, 0);
});

test("invalid server totals and oversized blocks remain errors, not empty results", async () => {
  for (const result of [
    { rows: [], totalCount: -1 },
    { rows: [], totalCount: 0.5 },
    { rows: Array(51).fill({}), totalCount: 51 },
  ]) {
    const states = [], request = block();
    const source = datasource.createInfiniteDatasource(async () => result, (state) => states.push(state));
    await source.getRows(request.params);
    assert.equal(states.at(-1).phase, "error");
    assert.equal(request.calls.failures, 1);
    assert.equal(request.calls.successes.length, 0);
    source.destroy();
  }
});

test("semantic alignment and continuous NO are defaults, with explicit overrides", () => {
  assert.equal(columns.erpColumn("number", {}).cellStyle.textAlign, "right");
  assert.equal(columns.erpColumn("name", {}).cellStyle.textAlign, "left");
  assert.equal(columns.erpColumn("status", {}).cellStyle.textAlign, "center");
  assert.equal(columns.erpColumn("name", { cellStyle: { textAlign: "center" } }).cellStyle.textAlign, "center");
  const no = columns.rowNumberColumn();
  assert.equal(no.pinned, "left");
  assert.equal(no.sortable, false);
  assert.equal(no.valueGetter({ node: { rowIndex: 50 } }), 51);
  assert.equal(no.valueGetter({ node: null }), "");
});

test("error helper prioritizes server messages and preserves explicit client errors", () => {
  assert.equal(apiErrors.getApiErrorMessage({ response: { data: { message: "server" } } }, "fallback"), "server");
  assert.equal(apiErrors.getApiErrorMessage(new Error("client"), "fallback"), "client");
  assert.equal(apiErrors.getApiErrorMessage({ response: { data: { message: "" } } }, "fallback"), "fallback");
  assert.equal(apiErrors.getApiErrorMessage(null, "fallback"), "fallback");
});

test("form field links visible labels and inline errors to its control", () => {
  const html = renderToStaticMarkup(createElement(fields.FormField, {
    label: "Name", required: true, error: "Required",
    children: (control) => createElement("input", control),
  }));
  const id = html.match(/<input\s+id="([^"]+)"/)?.[1];
  assert.ok(id);
  assert.ok(html.includes(`for="${id}"`));
  assert.ok(html.includes('aria-invalid="true"'));
  assert.ok(html.includes(`aria-describedby="${id}-error"`));
  assert.ok(html.includes(`id="${id}-error"`));
});

test("search panel and actions share a form, keep lookup/create order and opt-in capabilities", () => {
  const html = renderToStaticMarkup(createElement(search.SearchPanel, {
    formId: "search-test", onSearch: () => {}, pending: true,
    children: createElement(search.SearchField, {
      label: "Grade", width: "compact", children: (id) => createElement("input", { id }),
    }),
  }));
  assert.ok(html.indexOf("검색조건") < html.indexOf("<form"));
  assert.ok(html.includes('aria-controls="search-test"'));
  assert.ok(html.includes("max-w-40"));
  const toolbar = renderToStaticMarkup(createElement(actions.ListPageActions, {
    searchFormId: "search-test", onCreate: () => {},
  }));
  assert.ok(toolbar.includes('form="search-test"'));
  assert.ok(toolbar.indexOf("조회") < toolbar.indexOf("신규 등록"));
  const denied = renderToStaticMarkup(createElement(actions.ListPageActions, {
    searchFormId: "search-test", onCreate: () => {}, searchAllowed: false, createAllowed: false,
  }));
  assert.ok(!denied.includes("<button"));
  const loading = renderToStaticMarkup(createElement(actions.ListPageActions, { searchFormId: "search-test", searching: true }));
  assert.ok(loading.includes("조회"));
  assert.ok(loading.includes('aria-busy="true"'));
});

test("async feedback exposes loading and retryable failures without success-shaped fallbacks", () => {
  const loading = renderToStaticMarkup(createElement(feedback.AsyncFeedback, { loading: true }));
  assert.ok(loading.includes('role="status"'));
  const error = renderToStaticMarkup(createElement(feedback.AsyncFeedback, { error: "Failure", onRetry: () => {} }));
  assert.ok(error.includes('role="alert"'));
  assert.ok(error.includes("다시 시도"));
  assert.equal(renderToStaticMarkup(createElement(feedback.AsyncFeedback, {})), "");
});

test("cached detail lookup uses domain identity and skips unloaded placeholders", () => {
  const rows = [{ rowIndex: 0 }, { rowIndex: 9, data: { key: "B" } }, { rowIndex: 5, data: { key: "A" } }];
  const api = { forEachNode: (callback) => rows.forEach(callback) };
  assert.equal(detail.findCachedRow(api, "A", (row) => row.key).rowIndex, 5);
  assert.equal(detail.findCachedRow(api, "missing", (row) => row.key), null);
});

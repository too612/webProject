import { expect, test, type Page } from "@playwright/test";
import type { PersonnelMoveRequest, PersonnelMoveRow } from "../src/erp/humen/personnelmove/personnelmoveModel";
import type { ExcelSheet } from "../src/common/excel/excelModel";
test.setTimeout(120000);

const PATH = "/erp/humen/personnelmove";
const BASE = "/api/erp/humen/personnelmove";
const OPTIONS = {
  assignmentTypes: [{ code: "105-010", codeName: "임명" }],
  grades: [{ code: "102-010", codeName: "직급 102" }],
  positions: [{ code: "103-010", codeName: "직위" }],
  employmentTypes: [{ code: "104-010", codeName: "정규직" }],
  jobTitles: [{ code: "106-010", codeName: "직책" }],
};
const EMPLOYEES = [
  { personKey: "P1", employeeNo: "E1", nameKo: "인사 하나", deptCd: "D1", gradeCode: "102-010" },
  { personKey: "P2", employeeNo: "E2", nameKo: "인사 둘", deptCd: "D2", gradeCode: "102-010" },
];
const POPUP_EMPLOYEES = EMPLOYEES.map((employee) => ({
  ...employee, deptName: employee.deptCd === "D1" ? "인사팀" : "인사운영팀",
  gradeName: "직급 102", positionCode: "103-010", positionName: "직위",
  serviceStatusCode: "101-010", serviceStatusName: "재직",
}));
const ROW: PersonnelMoveRow = {
  ...EMPLOYEES[0], assignmentKey: "A1", concurrentKey: null, scope: "main",
  assignmentDate: "2020-01-01", assignmentOrder: 1, assignmentTypeCode: "105-010",
  positionCode: null, employmentTypeCode: null, jobTitleCode: null, assignmentContent: null,
  assignmentEndDate: null, dispatchCountryCode: null, remark: null, version: 3,
  currentEffective: false, applied: false, pending: false, syncPaused: true,
};
async function setup(page: Page, failOptions = false) {
  const state = { lists: [] as URL[], saves: [] as PersonnelMoveRequest[], masterCreates: 0,
    deletes: [] as URL[], optionsFailed: failOptions,
    departmentQueries: [] as URL[], departmentFailure: false, reorganizationFailure: false, departmentDelay: "",
    employeeQueries: [] as URL[], employeeFailure: false, employeeContextFailure: false, employeeDelay: "",
    employeeRows: [...POPUP_EMPLOYEES],
    exports: [] as { fileName: string; sheets: ExcelSheet[] }[] };
  await page.addInitScript(() => sessionStorage.setItem("authStore", JSON.stringify({
    isAuthenticated: true, user: { userId: "assignment-test", userName: "테스트" }, token: null,
  })));
  await page.route(/^https?:\/\/[^/]+\/api\//, async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const json = (data: unknown, status = 200, message = "처리 완료") => route.fulfill({
      status, contentType: "application/json", body: JSON.stringify({ success: status < 400, data, statusCode: status, message }),
    });
    if (url.pathname === "/api/auth/check") return json({ authenticated: true });
    if (url.pathname === "/api/auth/me") return json({ userId: "assignment-test", userName: "테스트" });
    if (url.pathname === "/api/common/popup/employee/context") {
      return state.employeeContextFailure ? json(null, 409, "현재 적용된 확정·사용 조직개편이 없습니다.") : json({
        reorganization: { reorgKey: "confirmed-current", reorgDt: "2026-01-01" },
        departments: [
          { deptKey: "root", parentDeptKey: null, deptCd: "D0", deptNm: "본부" },
          { deptKey: "one", parentDeptKey: "root", deptCd: "D1", deptNm: "인사팀" },
          { deptKey: "child", parentDeptKey: "one", deptCd: "D3", deptNm: "하위팀" },
          { deptKey: "two", parentDeptKey: "root", deptCd: "D2", deptNm: "인사운영팀" },
        ],
        grades: [{ code: "102-010", name: "직급 102" }],
        positions: [{ code: "103-010", name: "직위" }],
        serviceStatuses: [{ code: "101-010", name: "재직" }, { code: "101-020", name: "퇴직" }],
      });
    }
    if (url.pathname === "/api/common/popup/employee") {
      state.employeeQueries.push(url);
      const query = url.searchParams;
      if (state.employeeFailure) return json(null, 503, "직원 조회 실패");
      if (query.get("nameKo") === state.employeeDelay) await new Promise((resolve) => setTimeout(resolve, 300));
      const matches = state.employeeRows.filter((item) =>
        (!query.get("personKey") || item.personKey === query.get("personKey")) &&
        item.nameKo.includes(query.get("nameKo") ?? "") &&
        item.employeeNo.includes(query.get("employeeNo") ?? "") &&
        item.deptName.includes(query.get("deptName") ?? "") &&
        (!query.get("deptCd") || item.deptCd === query.get("deptCd")) &&
        (!query.get("gradeCode") || item.gradeCode === query.get("gradeCode")) &&
        (!query.get("positionCode") || item.positionCode === query.get("positionCode")) &&
        (!query.get("serviceStatusCode") || item.serviceStatusCode === query.get("serviceStatusCode")));
      const size = Number(query.get("size") ?? 50);
      const number = Number(query.get("page") ?? 0);
      return json({ content: matches.slice(number * size, (number + 1) * size), totalElements: matches.length, number, size });
    }
    if (url.pathname === "/api/common/popup/department/reorganizations") return state.reorganizationFailure
      ? json(null, 503, "조직개편일 조회 실패") : json([
      { reorgKey: "latest", reorgDt: "2027-01-01", confYn: "N", useYn: "Y", reorgTitle: "미래 조직" },
      { reorgKey: "old", reorgDt: "2020-01-01", confYn: "Y", useYn: "N", reorgTitle: "과거 조직" },
    ]);
    if (url.pathname === "/api/common/popup/department") {
      state.departmentQueries.push(url);
      if (state.departmentFailure) return json(null, 503, "부서 조회 실패");
      const old = url.searchParams.get("reorgKey") === "old";
      const departments = [
        { deptKey: "root", parentDeptKey: null, deptCd: "D0", deptNm: "본부" },
        { deptKey: "one", parentDeptKey: "root", deptCd: "D1", deptNm: old ? "과거팀" : "인사팀" },
        { deptKey: "two", parentDeptKey: "root", deptCd: "D2", deptNm: "인사운영팀" },
      ];
      const code = url.searchParams.get("deptCd") ?? "";
      const name = url.searchParams.get("deptNm") ?? "";
      if (name === state.departmentDelay) await new Promise((resolve) => setTimeout(resolve, 300));
      const exact = url.searchParams.get("exactCode") === "true";
      const matched = departments.filter((item) => (exact ? item.deptCd === code : item.deptCd.includes(code)) && item.deptNm.includes(name));
      const keys = new Set(matched.map((item) => item.deptKey));
      if (matched.some((item) => item.parentDeptKey)) keys.add("root");
      return json({
        reorganization: { reorgKey: old ? "old" : "latest", reorgDt: old ? "2020-01-01" : "2027-01-01",
          confYn: old ? "Y" : "N", useYn: old ? "N" : "Y", reorgTitle: null },
        departments: departments.filter((item) => keys.has(item.deptKey))
          .map((item) => ({ ...item, matched: matched.some((match) => match.deptKey === item.deptKey) })),
        matchCount: matched.length,
      });
    }
    if (url.pathname === "/api/common/excel/download") {
      state.exports.push(route.request().postDataJSON());
      return route.fulfill({ contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        body: Buffer.from("PK-test"), headers: { "Content-Disposition": "attachment; filename=test.xlsx" } });
    }
    if (url.pathname.startsWith("/api/menu/")) {
      const child = { menuId: "ASSIGNMENT", menuName: "인사발령 관리", menuSummary: "발령 조회", path: PATH, menuUrl: PATH, level: 2, orderNo: 1 };
      const root = { ...child, menuId: "ASSIGNMENT_ROOT", level: 1, subMenus: [child] };
      return json(url.pathname.endsWith("hierarchical") || url.pathname.endsWith("top") ? [root] : child);
    }
    if (url.pathname === `${BASE}/options`) return state.optionsFailed ? json(null, 503, "선택항목 실패") : json(OPTIONS);
    if (url.pathname === `${BASE}/employees`) return json({ content: EMPLOYEES, totalElements: 2, number: 0, size: 50, totalPages: 1 });
    if (url.pathname === `${BASE}/concurrent`) {
      if (method === "POST") {
        state.masterCreates++;
        return json({ ...EMPLOYEES[0], employeeNo: `E1_${state.masterCreates}`, concurrentKey: `C${state.masterCreates}` });
      }
      return json(state.masterCreates ? [{ ...EMPLOYEES[0], employeeNo: "E1_1", concurrentKey: "C1" }] : []);
    }
    if (url.pathname === BASE && method === "GET") {
      state.lists.push(url);
      const main = url.searchParams.get("scope") === "main";
      const hasKeyword = Boolean(url.searchParams.get("keyword"));
      return route.fulfill({ contentType: "application/json", headers: { "X-Excel-Snapshot": "assignment-snapshot" },
        body: JSON.stringify({ success: true, statusCode: 200, data: {
          content: main && !hasKeyword ? [ROW] : [], totalElements: main && !hasKeyword ? 1 : 0, number: 0, size: 50, totalPages: 1,
        } }) });
    }
    if ((url.pathname === BASE && method === "POST") || (url.pathname === `${BASE}/A1` && method === "PUT")) {
      const request: PersonnelMoveRequest = route.request().postDataJSON();
      state.saves.push(request);
      return json({ ...ROW, ...request, assignmentKey: "A1", syncPaused: true });
    }
    if (url.pathname === `${BASE}/A1` && method === "DELETE") {
      state.deletes.push(url); return json(null);
    }
    if (url.pathname === `${BASE}/A1`) return json(ROW);
    return route.abort();
  });
  await page.goto(PATH, { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-assignment-scope="main"] .ag-center-cols-container [col-id="nameKo"]').first()).toHaveText("인사 하나", { timeout: 90000 });
  return state;
}
const main = (page: Page) => page.locator('[data-assignment-scope="main"]');
const concurrent = (page: Page) => page.locator('[data-assignment-scope="concurrent"]');
async function choose(page: Page, selector: ReturnType<typeof main>, label: string, option: string) {
  await selector.getByLabel(label, { exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}
async function chooseEmployee(selector: ReturnType<typeof main>, label: string, name: string, employeeNo: string) {
  const input = selector.getByRole("textbox", { name: label, exact: true }).last();
  await input.fill(name);
  await input.press("Enter");
  await expect(selector.getByLabel("사번", { exact: true }).last()).toHaveValue(employeeNo);
}
async function selectEmployeeFromDetail(selector: ReturnType<typeof main>, name: string) {
  await selector.locator('.ag-center-cols-container [col-id="nameKo"]').first().click();
  const input = selector.getByRole("textbox", { name: "성명", exact: true }).last();
  await expect(input).toBeVisible();
  await expect(selector.getByLabel("사번", { exact: true }).last()).toBeDisabled();
  await input.fill(name);
  await input.press("Enter");
}

test("직원 성명 Enter 단일 재직 자동 입력·수정 해제·0건·오류·늦은 응답 무시", async ({ page }) => {
  const state = await setup(page);
  const searchName = main(page).getByRole("textbox", { name: "성명", exact: true }).first();
  await expect(searchName).toBeVisible();
  await expect(main(page).getByLabel("사번", { exact: true }).first()).toBeDisabled();
  await expect(main(page).getByRole("button", { name: "직원 조회", exact: true }).first()).toBeVisible();
  await selectEmployeeFromDetail(main(page), "인사 하나");
  await expect(page.getByRole("dialog", { name: "직원 조회" })).toHaveCount(0);
  const singleEmployeeQuery = state.employeeQueries.filter((url) =>
    url.searchParams.get("nameKo") === "인사 하나").at(-1);
  expect(singleEmployeeQuery?.searchParams.get("serviceStatusCode")).toBe("101-010");
  expect(singleEmployeeQuery?.searchParams.get("size")).toBe("2");
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("personKey")).toBe("P1");
  await selectEmployeeFromDetail(main(page), "없는직원");
  await expect(main(page).getByLabel("사번", { exact: true }).last()).toHaveValue("");
  await expect(main(page).getByRole("alert")).toContainText("조회된 재직 직원이 없습니다.");
  state.employeeFailure = true;
  await searchName.fill("인사 하나");
  await searchName.press("Enter");
  await expect(main(page).getByText("직원 조회 실패", { exact: true })).toBeVisible();
  state.employeeFailure = false;
  state.employeeDelay = "인사 하나";
  await searchName.press("Enter");
  await expect.poll(() => state.employeeQueries.filter((url) => url.searchParams.get("nameKo") === "인사 하나").length).toBe(3);
  await searchName.fill("인사 둘");
  await searchName.press("Enter");
  await page.waitForTimeout(350);
  await expect(main(page).getByLabel("사번", { exact: true }).first()).toHaveValue("E2");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("personKey")).toBe("P2");
});

test("직원 동명이인 팝업·부서 클릭·select 자동 조회·정렬 초기화·더블클릭 반환", async ({ page }) => {
  const state = await setup(page);
  await selectEmployeeFromDetail(main(page), "인사");
  const popup = page.getByRole("dialog", { name: "직원 조회" });
  await expect(popup.getByLabel("성명", { exact: true })).toHaveValue("인사");
  await expect(popup.getByLabel("재직구분", { exact: true })).toContainText("재직");
  await expect(popup.getByLabel("직급", { exact: true })).toContainText("선택");
  await expect(popup.getByLabel("직위", { exact: true })).toContainText("선택");
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 2건)");
  await expect(popup.getByRole("button", { name: "선택", exact: true })).toHaveCount(0);
  await expect(popup.locator('[data-ui="tree-summary"]')).toHaveCount(0);
  await expect(popup.getByText("조직개편일 2026-01-01", { exact: true })).toBeVisible();
  await expect(popup.locator('[draggable="true"]')).toHaveCount(0);
  await popup.locator('[data-tree-id="one"]').click();
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
  expect(state.employeeQueries.at(-1)?.searchParams.get("deptCd")).toBe("D1");
  await popup.getByRole("button", { name: "전체 부서", exact: true }).click();
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 2건)");
  await popup.locator('[data-tree-id="one"]').getByRole("button", { name: "하위 항목 접기" }).click();
  await expect(popup.locator('[data-tree-id="child"]')).toHaveCount(0);
  await popup.locator('[data-tree-id="one"]').getByRole("button", { name: "하위 항목 펼치기" }).click();
  await expect(popup.locator('[data-tree-id="child"]')).toBeVisible();
  await popup.locator('.ag-header-cell[col-id="nameKo"]').click();
  await expect.poll(() => state.employeeQueries.at(-1)?.searchParams.get("sortField")).toBe("nameKo");
  await choose(page, popup, "직급", "직급 102");
  await expect.poll(() => state.employeeQueries.at(-1)?.searchParams.get("gradeCode")).toBe("102-010");
  expect(state.employeeQueries.at(-1)?.searchParams.has("sortField")).toBe(false);
  await choose(page, popup, "직위", "직위");
  await expect.poll(() => state.employeeQueries.at(-1)?.searchParams.get("positionCode")).toBe("103-010");
  await choose(page, popup, "재직구분", "선택");
  await expect.poll(() => state.employeeQueries.at(-1)?.searchParams.get("serviceStatusCode")).toBe("");
  await popup.getByLabel("부서명", { exact: true }).fill("운영");
  await popup.getByLabel("부서명", { exact: true }).press("Enter");
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
  await popup.locator('.ag-center-cols-container [col-id="nameKo"]').first().dblclick();
  await expect(popup).toHaveCount(0);
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("personKey")).toBe("P2");
});

test("직원 돋보기·검색 버튼·중첩 등록 폼·모바일 키보드 반환·취소와 재시도", async ({ page }) => {
  const state = await setup(page);
  await page.getByRole("button", { name: "신규 등록", exact: true }).click();
  const edit = page.getByRole("dialog", { name: "인사발령 등록" });
  await edit.getByRole("button", { name: "직원 조회", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "직원 조회" });
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 2건)");
  await expect(popup.getByLabel("재직구분", { exact: true })).toContainText("선택");
  expect(state.employeeQueries.at(-1)?.searchParams.get("serviceStatusCode")).toBe("");
  const actions = popup.locator('[data-ui="popup-actions"]');
  const geometry = await popup.evaluate((element) => {
    const actions = element.querySelector('[data-ui="popup-actions"]')!;
    const search = element.querySelector('[data-ui="search-panel"]')!;
    const tree = element.querySelector('[data-ui="tree-table"]')!;
    return { above: actions.getBoundingClientRect().bottom <= search.getBoundingClientRect().top,
      aligned: getComputedStyle(actions).justifyContent, radius: getComputedStyle(tree).borderRadius };
  });
  expect(geometry).toEqual({ above: true, aligned: "flex-end", radius: "6px" });
  await popup.getByLabel("성명", { exact: true }).fill("인사 둘");
  await popup.getByLabel("사번", { exact: true }).fill("E2");
  await actions.getByRole("button", { name: "검색", exact: true }).click();
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
  await page.setViewportSize({ width: 390, height: 844 });
  const cell = popup.locator('.ag-center-cols-container [col-id="nameKo"]').first();
  await cell.focus(); await cell.press("Enter");
  await expect(popup).toHaveCount(0);
  await expect(edit.getByRole("textbox", { name: "성명", exact: true })).toHaveValue("인사 둘");
  await expect(edit.getByLabel("사번", { exact: true })).toHaveValue("E2");
  await expect(edit.getByLabel("사번", { exact: true })).toBeDisabled();
  expect(state.saves).toHaveLength(0);
  await edit.getByRole("button", { name: "직원 조회", exact: true }).click();
  await expect(popup.getByLabel("성명", { exact: true })).toHaveValue("인사 둘");
  await expect(popup.getByLabel("재직구분", { exact: true })).toContainText("선택");
  await popup.getByRole("button", { name: "닫기", exact: true }).last().click();
  await expect(edit.getByLabel("사번", { exact: true })).toHaveValue("E2");
  state.employeeContextFailure = true;
  await edit.getByRole("button", { name: "직원 조회", exact: true }).click();
  await expect(popup.getByRole("alert")).toContainText("확정·사용 조직개편이 없습니다.");
  state.employeeContextFailure = false;
  await popup.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
});

test("직원 50명 초과 결과도 전체 건수로 팝업을 열고 50행 서버 블록을 사용한다", async ({ page }) => {
  const state = await setup(page);
  state.employeeRows = Array.from({ length: 70 }, (_, index) => ({
    ...POPUP_EMPLOYEES[0], personKey: `PX${index}`, employeeNo: `EX${index}`, nameKo: "동명이인",
  }));
  await selectEmployeeFromDetail(main(page), "동명이인");
  const popup = page.getByRole("dialog", { name: "직원 조회" });
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 70건)");
  expect(state.employeeQueries.some((url) => url.searchParams.get("size") === "2")).toBe(true);
  expect(state.employeeQueries.some((url) => url.searchParams.get("size") === "50"
    && url.searchParams.get("reorgKey") === "confirmed-current")).toBe(true);
});

test("50행 서버 조회, 수동 필터 적용·정렬 초기화, 정확한 두 탭", async ({ page }) => {
  const state = await setup(page);
  await expect(page.getByRole("tab", { name: "인사발령", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "겸임발령", exact: true })).toBeVisible();
  expect(state.lists.every((url) => url.searchParams.get("size") === "50")).toBeTruthy();
  await main(page).locator('.ag-header-cell[col-id="assignmentDate"]').click();
  await expect.poll(() => state.lists.filter((url) => url.searchParams.get("scope") === "main").at(-1)?.searchParams.get("sort")).toBe("assignmentDate");
  await main(page).getByLabel("발령일 시작", { exact: true }).fill("2026-10-10");
  await main(page).getByLabel("발령일 종료", { exact: true }).fill("2026-10-09");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect(main(page).getByText("종료일은 시작일 이후여야 합니다.")).toBeVisible();
  expect(state.lists.every((url) => !url.searchParams.has("assignmentDateFrom"))).toBeTruthy();
  await main(page).getByLabel("발령일 시작", { exact: true }).fill("2020-01-01");
  await main(page).getByLabel("발령일 종료", { exact: true }).fill("2099-01-01");
  const before = state.lists.length;
  await main(page).getByRole("textbox", { name: "성명", exact: true }).first().fill("없는 인사");
  expect(state.lists.length).toBe(before);
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("keyword")).toBe("없는 인사");
  expect(state.lists.at(-1)?.searchParams.get("sort")).toBeNull();
  expect(state.lists.at(-1)?.searchParams.get("assignmentDateFrom")).toBe("2020-01-01");
  expect(state.lists.at(-1)?.searchParams.get("assignmentDateTo")).toBe("2099-01-01");
  await expect(main(page).getByText("조회된 발령이 없습니다.", { exact: true })).toBeVisible();
});

test("엑셀은 해당 내부 탭의 현재 캐시·표시 열 snapshot만 내보낸다", async ({ page }) => {
  const state = await setup(page);
  const listCount = state.lists.length;
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "엑셀 다운로드", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("인사발령.xlsx");
  expect(state.lists.length).toBe(listCount);
  expect(state.exports).toHaveLength(1);
  expect(state.exports[0].sheets[0].blocks).toEqual([{ token: "assignment-snapshot", indexes: [0] }]);
  expect(state.exports[0].sheets[0].columns.some((column) => column.id === "assignmentTypeCode")).toBeTruthy();
});

test("필수 입력 검증, 선택 null, 동기화 중지 저장 안내", async ({ page }) => {
  const state = await setup(page);
  await page.getByRole("button", { name: "신규 등록", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "저장", exact: true }).click();
  await expect(dialog.getByText("부서 코드를 입력하세요.")).toBeVisible();
  await expect(dialog.getByText("직급을 선택하세요.")).toBeVisible();
  await chooseEmployee(dialog, "성명", "인사 하나", "E1");
  await dialog.getByLabel("발령일", { exact: true }).fill("2099-01-01");
  await dialog.getByLabel("발령 순서", { exact: true }).fill("2");
  await dialog.getByLabel("부서명", { exact: true }).fill("인사팀");
  await dialog.getByLabel("부서명", { exact: true }).press("Enter");
  await expect(dialog.getByLabel("부서코드", { exact: true })).toHaveValue("D1");
  await choose(page, dialog, "직급", "직급 102");
  await choose(page, dialog, "발령 종류", "임명");
  await dialog.getByRole("button", { name: "저장", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(state.saves).toHaveLength(1);
  expect(state.saves[0].positionCode).toBeNull();
  expect(state.saves[0].employmentTypeCode).toBeNull();
  expect(state.saves[0].jobTitleCode).toBeNull();
  await expect(main(page).getByText(/동기화가 중지되어 인사 마스터 반영은 재개 후/)).toBeVisible();
});

test("과거 편집 명시 허용·사유 및 낙관적 버전, 삭제도 동일 정책", async ({ page }) => {
  const state = await setup(page);
  await main(page).locator('.ag-center-cols-container [col-id="nameKo"]').first().click();
  await page.getByRole("button", { name: "수정", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("발령일", { exact: true })).toBeDisabled();
  await dialog.getByRole("button", { name: "저장", exact: true }).click();
  await expect(dialog.getByText("과거 이력 편집을 명시적으로 허용하세요.")).toBeVisible();
  await dialog.getByLabel("과거 이력 편집 허용").check();
  await dialog.getByLabel("과거 이력 편집 사유").fill("이력 정정");
  await dialog.getByRole("button", { name: "저장", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(state.saves[0].version).toBe(3);
  expect(state.saves[0].historicalEdit).toBe(true);
  await main(page).locator('.ag-center-cols-container [col-id="nameKo"]').first().click();
  await page.getByRole("button", { name: "삭제", exact: true }).click();
  await expect(page.getByText("과거 이력 삭제 허용과 편집 사유가 필요합니다.")).toBeVisible();
  await page.getByLabel("과거 이력 삭제 허용").check();
  await page.getByLabel("과거 이력 편집 사유", { exact: true }).fill("중복 이력 삭제");
  await page.getByRole("button", { name: "삭제", exact: true }).click();
  await page.getByRole("dialog", { name: "발령 삭제" }).getByRole("button", { name: "확인" }).click();
  await expect.poll(() => state.deletes.length).toBe(1);
  expect(state.deletes[0].searchParams.get("version")).toBe("3");
  expect(state.deletes[0].searchParams.get("historicalReason")).toBe("중복 이력 삭제");
});

test("겸임 마스터 독립 생성, 대상 변경 유예, 비활성 탭 포털 숨김과 입력 보존", async ({ page }) => {
  const state = await setup(page);
  await page.getByRole("tab", { name: "겸임발령", exact: true }).click();
  await chooseEmployee(concurrent(page), "성명", "인사 하나", "E1");
  await page.getByRole("button", { name: "겸임 인사 생성", exact: true }).click();
  await expect.poll(() => state.masterCreates).toBe(1);
  await expect(concurrent(page).getByLabel("겸임 인사", { exact: true })).toContainText("인사 하나 · E1_1");
  expect(state.saves).toHaveLength(0);
  await page.getByRole("button", { name: "신규 등록", exact: true }).click();
  await page.getByRole("dialog").getByLabel("비고", { exact: true }).fill("겸임 입력 유지");
  await page.getByRole("tab", { name: "인사발령", exact: true, includeHidden: true }).dispatchEvent("mousedown", { button: 0, ctrlKey: false });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("tab", { name: "겸임발령", exact: true }).click();
  await expect(page.getByRole("dialog").getByLabel("비고", { exact: true })).toHaveValue("겸임 입력 유지");
  await page.getByRole("dialog").getByRole("button", { name: "취소", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "입력 취소" })).toBeVisible();
  await page.getByRole("dialog", { name: "입력 취소" }).getByRole("button", { name: "확인" }).click();
  await chooseEmployee(concurrent(page), "성명", "인사 둘", "E2");
  await expect(concurrent(page).getByRole("textbox", { name: "성명", exact: true }).last()).toHaveValue("인사 둘");
});

test("옵션 실패 재시도와 모바일 핵심 컬럼·키보드 상세", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await setup(page, true);
  await expect(main(page).getByLabel("직급", { exact: true })).toBeDisabled();
  await expect(main(page).getByText("선택항목 실패")).toBeVisible();
  state.optionsFailed = false;
  await main(page).getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(main(page).getByLabel("직급", { exact: true })).toBeEnabled();
  await expect(main(page).locator('.ag-header-cell[col-id="deptCd"]')).toHaveCount(0);
  const employee = main(page).locator('.ag-center-cols-container [col-id="nameKo"]').first();
  await employee.focus();
  await employee.press("Enter");
  await expect(page.getByRole("button", { name: "수정", exact: true })).toBeVisible();
});

test("부서명 Enter 단일 결과 자동 입력, 이름 수정 시 코드 해제, 0건과 오류 표시", async ({ page }) => {
  const state = await setup(page);
  const name = main(page).getByLabel("부서명", { exact: true });
  const code = main(page).getByLabel("부서코드", { exact: true });
  const lists = state.lists.length;
  await name.fill("인사팀");
  await name.press("Enter");
  await expect(code).toHaveValue("D1");
  await expect(code).toBeDisabled();
  await expect(page.getByRole("dialog", { name: "부서 조회" })).toHaveCount(0);
  expect(state.lists.length).toBe(lists);
  await name.fill("없는팀");
  await expect(code).toHaveValue("");
  await name.press("Enter");
  await expect(main(page).getByRole("alert")).toContainText("조회된 부서가 없습니다.");
  state.departmentFailure = true;
  await name.fill("인사팀");
  await name.press("Enter");
  await expect(main(page).getByRole("alert")).toContainText("부서 조회 실패");
  state.departmentFailure = false;
  await name.press("Enter");
  await expect(code).toHaveValue("D1");
});

test("복수 결과 팝업은 검색어·상위 경로를 유지하고 실제 일치 부서만 더블클릭 선택", async ({ page }) => {
  const state = await setup(page);
  await main(page).getByLabel("부서명", { exact: true }).fill("인사");
  await main(page).getByLabel("부서명", { exact: true }).press("Enter");
  const popup = page.getByRole("dialog", { name: "부서 조회" });
  await expect(popup).toBeVisible();
  await expect(popup.getByLabel("부서명", { exact: true })).toHaveValue("인사");
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 2건)");
  await expect(popup.locator('tr[draggable="true"]')).toHaveCount(0);
  expect(state.departmentQueries.filter((url) => url.searchParams.get("deptNm") === "인사")).toHaveLength(1);
  const parent = popup.getByRole("row").filter({ hasText: "본부" });
  await parent.dblclick();
  await expect(popup).toBeVisible();
  await popup.getByRole("row").filter({ hasText: "인사운영팀" }).dblclick();
  await expect(popup).toHaveCount(0);
  await expect(main(page).getByLabel("부서명", { exact: true })).toHaveValue("인사운영팀");
  await expect(main(page).getByLabel("부서코드", { exact: true })).toHaveValue("D2");
});

test("돋보기에서 최신 미확정 기본 선택·과거 미사용 일자 변경·코드 Enter·키보드 선택", async ({ page }) => {
  await setup(page);
  await main(page).getByRole("button", { name: "부서 조회", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "부서 조회" });
  await expect(popup.getByLabel("조직개편일")).toHaveValue("latest");
  await popup.getByLabel("조직개편일").selectOption("old");
  await expect(popup.getByRole("row").filter({ hasText: "과거팀" })).toBeVisible();
  await popup.getByLabel("부서코드", { exact: true }).fill("D1");
  await popup.getByLabel("부서코드", { exact: true }).press("Enter");
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
  const row = popup.getByRole("row").filter({ hasText: "과거팀" });
  await row.focus();
  await row.press("Enter");
  await expect(popup).toHaveCount(0);
  await expect(main(page).getByLabel("부서명", { exact: true })).toHaveValue("과거팀");
  await expect(main(page).getByLabel("부서코드", { exact: true })).toHaveValue("D1");
});

test("편집 폼 중첩 부서 팝업의 조회는 저장하지 않고 선택 코드만 저장 계약에 반영", async ({ page }) => {
  const state = await setup(page);
  await main(page).locator('.ag-center-cols-container [col-id="nameKo"]').first().click();
  await page.getByRole("button", { name: "수정", exact: true }).click();
  const edit = page.getByRole("dialog", { name: "인사발령 수정" });
  await expect(edit.getByLabel("부서명", { exact: true })).toHaveValue("인사팀");
  await edit.getByRole("button", { name: "부서 조회", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "부서 조회" });
  await popup.getByLabel("부서명", { exact: true }).fill("인사운영팀");
  await popup.getByRole("button", { name: "조회", exact: true }).click();
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
  expect(state.saves).toHaveLength(0);
  await popup.getByRole("row").filter({ hasText: "인사운영팀" }).dblclick();
  await expect(edit.getByLabel("부서코드", { exact: true })).toHaveValue("D2");
  await edit.getByLabel("과거 이력 편집 허용").check();
  await edit.getByLabel("과거 이력 편집 사유").fill("부서 정정");
  await edit.getByRole("button", { name: "저장", exact: true }).click();
  await expect.poll(() => state.saves.length).toBe(1);
  expect(state.saves[0].deptCd).toBe("D2");
  expect(state.saves[0]).not.toHaveProperty("deptNm");
});

test("팝업 실패 재시도·닫기와 모바일 선택, 이전 이름 조회는 새 입력을 덮어쓰지 않음", async ({ page }) => {
  const state = await setup(page);
  const name = main(page).getByLabel("부서명", { exact: true });
  state.departmentDelay = "인사팀";
  await name.fill("인사팀");
  await name.press("Enter");
  await expect.poll(() => state.departmentQueries.some((url) => url.searchParams.get("deptNm") === "인사팀")).toBe(true);
  await name.fill("인사운영팀");
  await name.press("Enter");
  await expect(main(page).getByLabel("부서코드", { exact: true })).toHaveValue("D2");
  await expect(name).toHaveValue("인사운영팀");
  state.departmentFailure = true;
  await main(page).getByRole("button", { name: "부서 조회", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "부서 조회" });
  await expect(popup.getByRole("alert")).toContainText("부서 조회 실패");
  state.departmentFailure = false;
  await popup.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(popup.locator('[data-ui="result-panel"]')).toContainText("검색결과 (총 1건)");
  await popup.getByRole("button", { name: "닫기", exact: true }).last().click();
  await expect(popup).toHaveCount(0);
  await expect(main(page).getByLabel("부서코드", { exact: true })).toHaveValue("D2");

  state.reorganizationFailure = true;
  await main(page).getByRole("button", { name: "부서 조회", exact: true }).click();
  await expect(popup.getByRole("alert")).toContainText("조직개편일 조회 실패");
  state.reorganizationFailure = false;
  await popup.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(popup.getByLabel("조직개편일")).toBeEnabled();
  await page.setViewportSize({ width: 390, height: 844 });
  await popup.getByRole("row").filter({ hasText: "인사운영팀" }).dblclick();
  await expect(popup).toHaveCount(0);
});

test("부서 팝업 공통 검색·결과 레이아웃과 ERP 정렬, 연속 연결선, 불필요 선택 UI 제거", async ({ page }) => {
  await setup(page);
  await main(page).getByRole("button", { name: "부서 조회", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "부서 조회" });
  const result = popup.locator('[data-ui="result-panel"]');
  await expect(result).toContainText("검색결과 (총 3건)");
  await expect(popup.locator('[data-ui="search-panel"]')).toBeVisible();
  await expect(popup.getByLabel("조직개편일").locator("option")).toHaveText(["2027-01-01", "2020-01-01"]);
  await expect(popup.getByRole("columnheader")).toHaveText(["NO", "부서코드", "부서명 / 조직도"]);
  await expect(popup.getByRole("button", { name: /선택/ })).toHaveCount(0);
  await expect(popup.getByText("선택 가능", { exact: true })).toHaveCount(0);
  await expect(popup.locator('[data-ui="tree-summary"]')).toHaveCount(0);
  const actions = popup.locator('[data-ui="popup-actions"]');
  const geometry = await popup.evaluate((dialog) => {
    const action = dialog.querySelector('[data-ui="popup-actions"]')!;
    const search = dialog.querySelector('[data-ui="search-panel"]')!;
    const table = dialog.querySelector('[data-ui="tree-table"]')!;
    const headers = [...dialog.querySelectorAll("th")];
    const root = dialog.querySelector('[data-tree-id="root"]')!;
    const first = dialog.querySelector('[data-tree-id="one"]')!;
    const last = dialog.querySelector('[data-tree-id="two"]')!;
    const connector = (row: Element, kind: string) =>
      row.querySelector(`[data-tree-connector="${kind}"]`)!.getBoundingClientRect();
    return {
      actionsAboveSearch: action.getBoundingClientRect().bottom <= search.getBoundingClientRect().top,
      actionAlignment: getComputedStyle(action).justifyContent,
      radius: getComputedStyle(table).borderRadius,
      headersCentered: headers.every((header) => getComputedStyle(header).textAlign === "center"),
      codeAlignment: getComputedStyle(first.children[1]).textAlign,
      nameAlignment: getComputedStyle(first.children[2]).textAlign,
      headerHeight: headers[0].getBoundingClientRect().height,
      rowHeight: first.getBoundingClientRect().height,
      firstTopGap: connector(first, "branch").top - first.getBoundingClientRect().top,
      rootJoinGap: connector(first, "branch").top - connector(root, "children").bottom,
      siblingJoinGap: connector(last, "branch").top - connector(first, "branch").bottom,
      lastEnd: connector(last, "branch").bottom,
      lastMiddle: last.getBoundingClientRect().top + last.getBoundingClientRect().height / 2,
      elbowWidth: connector(first, "elbow").width,
    };
  });
  expect(geometry.actionsAboveSearch).toBe(true);
  expect(geometry.actionAlignment).toBe("flex-end");
  expect(geometry.radius).toBe("6px");
  expect(geometry.headersCentered).toBe(true);
  expect(geometry.codeAlignment).toBe("center");
  expect(geometry.nameAlignment).toBe("left");
  expect(geometry.headerHeight).toBeCloseTo(44, 0);
  expect(geometry.rowHeight).toBeCloseTo(52, 0);
  expect(Math.abs(geometry.firstTopGap)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.rootJoinGap)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.siblingJoinGap)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.lastEnd - geometry.lastMiddle)).toBeLessThanOrEqual(1);
  expect(geometry.elbowWidth).toBe(24);
  await popup.getByRole("button", { name: "접기", exact: true }).click();
  await expect(popup.getByLabel("부서명", { exact: true })).toBeHidden();
  await expect(actions.getByRole("button", { name: "조회", exact: true })).toBeVisible();
  await actions.getByRole("button", { name: "조회", exact: true }).click();
  await expect(result).toContainText("검색결과 (총 3건)");
});

test("조직관리 TREE도 여러 깊이의 L자·조상 연결선을 행 사이에서 끊지 않는다", async ({ page }) => {
  await setup(page);
  const reorganization = {
    reorgKey: "test-tree", reorgDt: "2027-01-01", confYn: "Y", useYn: "Y",
    reorgTitle: "연결선 검증 조직", departmentCount: 4,
  };
  const departments = [
    { deptKey: "root", parentDeptKey: null, deptCd: "D0", deptNm: "검증 본부", deptLevel: 1 },
    { deptKey: "first", parentDeptKey: "root", deptCd: "D1", deptNm: "첫 부서", deptLevel: 2 },
    { deptKey: "grandchild", parentDeptKey: "first", deptCd: "D3", deptNm: "손자 부서", deptLevel: 3 },
    { deptKey: "last", parentDeptKey: "root", deptCd: "D2", deptNm: "마지막 부서", deptLevel: 2 },
  ].map((item) => ({
    ...item, reorgKey: reorganization.reorgKey, sortOrder: 1, changeTypeCd: "NEW",
    deptSysCd: item.deptCd, useYn: "Y", memberCount: 0,
  }));
  await page.route("**/api/erp/humen/organization**", (route) => route.fulfill({
    contentType: "application/json", body: JSON.stringify({
      success: true, statusCode: 200,
      data: new URL(route.request().url()).pathname.endsWith("/test-tree")
        ? { ...reorganization, departments, histories: [] }
        : { content: [reorganization], number: 0, size: 10, totalElements: 1, totalPages: 1 },
    }),
  }));
  await page.goto("/erp/humen/organization", { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: "조직도(TREE)", exact: true }).click();
  const tree = page.locator('[data-ui="tree-table"]');
  await expect(tree.getByText("손자 부서", { exact: true })).toBeVisible();
  const connections = await tree.evaluate((table) => {
    const box = (id: string, kind: string) =>
      table.querySelector(`[data-tree-id="${id}"] [data-tree-connector="${kind}"]`)!.getBoundingClientRect();
    const ancestor = box("grandchild", "ancestor");
    const grandchildBranch = box("grandchild", "branch");
    const firstChildren = box("first", "children");
    const lastBranch = box("last", "branch");
    return {
      ancestorTopGap: ancestor.top - box("first", "branch").bottom,
      ancestorBottomGap: lastBranch.top - ancestor.bottom,
      childGap: grandchildBranch.top - firstChildren.bottom,
      childXDifference: grandchildBranch.x - firstChildren.x,
      ancestorXDifference: ancestor.x - lastBranch.x,
      ancestorHeight: ancestor.height,
    };
  });
  expect(Math.abs(connections.ancestorTopGap)).toBeLessThanOrEqual(1);
  expect(Math.abs(connections.ancestorBottomGap)).toBeLessThanOrEqual(1);
  expect(Math.abs(connections.childGap)).toBeLessThanOrEqual(1);
  expect(connections.childXDifference).toBe(0);
  expect(connections.ancestorXDifference).toBe(0);
  expect(connections.ancestorHeight).toBeGreaterThanOrEqual(52);
  await tree.getByRole("row").filter({ hasText: "첫 부서" })
    .getByRole("button", { name: "하위 항목 접기" }).click();
  await expect(tree.getByText("손자 부서", { exact: true })).toHaveCount(0);
  await expect(tree.getByText("마지막 부서", { exact: true })).toBeVisible();
});

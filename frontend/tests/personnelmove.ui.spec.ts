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
  await main(page).getByLabel("성명 / 사번").fill("없는 인사");
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
  await choose(page, dialog, "대상 인사", "인사 하나 · E1");
  await dialog.getByLabel("발령일", { exact: true }).fill("2099-01-01");
  await dialog.getByLabel("발령 순서", { exact: true }).fill("2");
  await dialog.getByLabel("부서 코드", { exact: true }).fill("D1");
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
  await choose(page, concurrent(page), "기준 인사", "인사 하나 · E1");
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
  await choose(page, concurrent(page), "기준 인사", "인사 둘 · E2");
  await expect(concurrent(page).getByLabel("기준 인사", { exact: true })).toContainText("인사 둘 · E2");
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

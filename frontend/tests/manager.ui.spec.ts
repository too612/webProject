import { expect, test, type Page } from "@playwright/test";
import type { ManagerCreateRequest, ManagerFilterOptions, ManagerRow } from "../src/erp/humen/manager/managerModel";

const PATH = "/erp/humen/manager";
const OPTIONS: ManagerFilterOptions = {
  departments: [{ code: "D1", name: "운영부" }, { code: "D2", name: "기획부" }],
  grades: [{ code: "G1", name: "긴 직급 명칭 전체를 확인할 수 있는 관리자" }],
  positions: [{ code: "P1", name: "팀장" }],
  employmentTypes: [{ code: "T1", name: "정규직" }],
  serviceStatuses: [{ code: "101-010", name: "재직" }],
};
const ROWS: ManagerRow[] = Array.from({ length: 103 }, (_, index) => ({
  personKey: `person-${index + 1}`,
  employeeNo: `E${String(index + 1).padStart(4, "0")}`,
  nameKo: `직원 ${String(index + 1).padStart(3, "0")}`,
  deptCd: index % 2 ? "D2" : "D1", deptName: index % 2 ? "기획부" : "운영부",
  gradeCode: "G1", gradeName: "관리자", positionCode: "P1", positionName: "팀장",
  employmentTypeCode: "T1", employmentTypeName: "정규직",
  serviceStatusCode: "101-010", serviceStatusName: "재직", hireDate: "2024-01-01",
}));

function deferred() {
  let resolve: () => void = () => {};
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}
const response = (data: unknown, message = "정상 처리", statusCode = 200) =>
  ({ success: statusCode < 400, statusCode, message, data });

async function setup(page: Page) {
  const state = {
    failOptions: false, failList: false, failCreate: false,
    holdFirst: false, holdMore: false, holdCreate: false,
    first: deferred(), more: deferred(), create: deferred(),
    lists: [] as URL[], creates: [] as ManagerCreateRequest[],
    exports: [] as { fileName: string; sheets: { columns: { id: string }[]; blocks: { token: string; indexes: number[] }[] }[] }[],
    errors: [] as string[],
  };
  page.on("pageerror", (error) => state.errors.push(error.message));
  await page.addInitScript(() => {
    sessionStorage.setItem("authStore", JSON.stringify({
      isAuthenticated: true, user: { userId: "erp-ui-test", userName: "테스트" }, token: null,
    }));
  });
  await page.route(/^https?:\/\/[^/]+\/api\//, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const json = async (data: unknown, message?: string, status = 200) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(response(data, message, status)) });
    if (url.pathname === "/api/auth/check") return json({ authenticated: true });
    if (url.pathname === "/api/auth/me") return json({ userId: "erp-ui-test", userName: "테스트" });
    if (url.pathname === "/api/common/excel/download") {
      state.exports.push(request.postDataJSON());
      return route.fulfill({ contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        body: Buffer.from("PK-test"), headers: { "Content-Disposition": "attachment; filename=test.xlsx" } });
    }
    if (url.pathname.startsWith("/api/menu/")) {
      const child = { menuId: "ERP_TEST_LIST", menuName: "인사관리", menuSummary: "ERP 기준 조회 화면", path: PATH, menuUrl: PATH, level: 2, orderNo: 1 };
      const filtered = { ...child, menuId: "ERP_TEST_FILTER", menuName: "인사-기획", param: "deptCd=D2", orderNo: 2 };
      const root = { menuId: "ERP_TEST_ROOT", menuName: "인사", path: PATH, menuUrl: PATH, level: 1, orderNo: 1, subMenus: [child, filtered] };
      return json(url.pathname.endsWith("hierarchical") || url.pathname.endsWith("top") ? [root] : child);
    }
    if (url.pathname === "/api/erp/humen/manager/options") {
      return state.failOptions ? json(null, "검색조건 조회 실패", 503) : json(OPTIONS);
    }
    if (url.pathname === "/api/erp/humen/manager" && request.method() === "POST") {
      state.creates.push(request.postDataJSON());
      if (state.holdCreate) await state.create.promise;
      return state.failCreate ? json(null, "이미 등록된 사번입니다.", 409) : json(null, "등록 완료");
    }
    if (url.pathname === "/api/erp/humen/manager") {
      state.lists.push(url);
      const pageIndex = Number(url.searchParams.get("page") ?? 0);
      const size = Number(url.searchParams.get("size") ?? 50);
      if (state.holdFirst && pageIndex === 0) await state.first.promise;
      if (state.holdMore && pageIndex > 0) await state.more.promise;
      if (state.failList) return json(null, "목록 조회 실패", 503);
      let rows = ROWS.filter((row) => {
        const keyword = url.searchParams.get("keyword") ?? "";
        if (keyword && !row.nameKo.includes(keyword) && !row.employeeNo.includes(keyword)) return false;
        for (const key of ["deptCd", "gradeCode", "positionCode", "employmentTypeCode", "serviceStatusCode"] as const) {
          const value = url.searchParams.get(key);
          if (value && row[key] !== value) return false;
        }
        return true;
      });
      const sortField = url.searchParams.get("sortField") ?? "employeeNo";
      if (!["employeeNo", "nameKo", "gradeName", "positionName", "deptName", "employmentTypeName", "hireDate", "serviceStatusName"].includes(sortField)) {
        return json(null, "지원하지 않는 정렬", 400);
      }
      const field = sortField as keyof ManagerRow;
      const direction = url.searchParams.get("sortDirection") === "desc" ? -1 : 1;
      rows = [...rows].sort((a, b) => direction * String(a[field]).localeCompare(String(b[field])) || a.employeeNo.localeCompare(b.employeeNo));
      return route.fulfill({ contentType: "application/json", headers: { "X-Excel-Snapshot": `snapshot-${pageIndex}` },
        body: JSON.stringify(response({ content: rows.slice(pageIndex * size, (pageIndex + 1) * size), number: pageIndex, size, totalElements: rows.length, totalPages: Math.ceil(rows.length / size) })) });
    }
    if (url.pathname.startsWith("/api/erp/humen/manager/")) {
      const row = ROWS.find((item) => item.employeeNo === decodeURIComponent(url.pathname.split("/").at(-1) ?? ""));
      if (!row) return json(null, "인사정보를 찾을 수 없습니다.", 404);
      return json({ ...row, nameEn: "Test Person", careers: [], assignments: [] });
    }
    await route.abort();
    throw new Error(`Unexpected test API: ${request.method()} ${url.pathname}`);
  });
  return state;
}

const grid = (page: Page) => page.locator('[role="tabpanel"]:visible [data-ui="erp-grid"]');
const searchPanel = (page: Page) => page.locator('[role="tabpanel"]:visible [data-ui="search-panel"]');
const cell = (page: Page, row: number, col = "nameKo") =>
  grid(page).locator(`.ag-center-cols-container [row-index="${row}"] [col-id="${col}"]`);
async function ready(page: Page) {
  await expect(cell(page, 0)).toHaveText("직원 001");
  await expect(page.getByRole("button", { name: "조회", exact: true })).toBeEnabled();
}
async function openManager(page: Page) {
  await page.goto(PATH, { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-ui="list-actions"]')).toBeVisible({ timeout: 60000 });
}

test("신규 등록 오른쪽 엑셀 버튼은 현재 캐시 행·표시 열만 요청한다", async ({ page }) => {
  test.setTimeout(90000);
  const state = await setup(page);
  await openManager(page);
  await ready(page);
  await expect(page.locator('[data-ui="list-actions"] button')).toHaveText(["조회", "신규 등록", "엑셀 다운로드"]);
  const before = state.lists.length;
  await cell(page, 0).click();
  await expect(page.getByRole("heading", { name: "직원 001" })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "엑셀 다운로드", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("인사관리.xlsx");
  expect(state.lists.length).toBe(before);
  expect(state.exports).toHaveLength(1);
  expect(state.exports[0].fileName).toBe("인사관리");
  expect(state.exports[0].sheets).toHaveLength(1);
  const sheet = state.exports[0].sheets[0];
  expect(sheet.columns.map(column => column.id)).toEqual([
    "rowNumber", "nameKo", "employeeNo", "profilePhotoUrl", "gradeName", "positionName",
    "deptName", "employmentTypeName", "hireDate", "serviceStatusName", "detail",
  ]);
  expect(sheet.blocks).toEqual([{ token: "snapshot-0", indexes: Array.from({ length: 50 }, (_, index) => index) }]);
  expect(state.errors).toEqual([]);
});

test("검색 옵션 실패·재시도, 수동 조건 적용과 접힌 상태 조회", async ({ page }) => {
  const state = await setup(page);
  state.failOptions = true;
  await openManager(page);
  await ready(page);
  await expect(page.getByRole("alert")).toContainText("검색조건 조회 실패");
  await expect(searchPanel(page).getByRole("combobox").first()).toBeDisabled();
  state.failOptions = false;
  await page.getByRole("button", { name: "다시 시도" }).click();
  await expect(searchPanel(page).getByRole("combobox").first()).toBeEnabled();
  const before = state.lists.length;
  await searchPanel(page).getByLabel("성명 / 사번").fill("직원 002");
  await expect(searchPanel(page)).toContainText("조건이 변경되었습니다");
  expect(state.lists.length).toBe(before);
  await searchPanel(page).getByRole("button", { name: "접기", exact: true }).click();
  await expect(searchPanel(page).locator("form")).toBeHidden();
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect(cell(page, 0)).toHaveText("직원 002");
  expect(state.lists.at(-1)?.searchParams.get("keyword")).toBe("직원 002");
  const applied = state.lists.length;
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect.poll(() => state.lists.length).toBeGreaterThan(applied);
  await searchPanel(page).getByRole("button", { name: "펼치기" }).click();
  await searchPanel(page).getByLabel("성명 / 사번").fill("NOT_FOUND");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect(grid(page)).toContainText("조회된 인사정보가 없습니다.");
  await expect(page.getByRole("status").filter({ hasText: "(총 0명)" })).toBeVisible();
  expect(state.errors).toEqual([]);
});

test("최초·추가 블록 로딩 구분, NO 51, 추가 로딩 중 재검색", async ({ page }) => {
  const state = await setup(page);
  state.holdFirst = true;
  await openManager(page);
  await expect(page.getByRole("button", { name: "조회", exact: true })).toBeDisabled();
  await expect(grid(page)).toContainText("조회 중...");
  state.first.resolve();
  state.holdFirst = false;
  await ready(page);
  state.holdMore = true;
  await grid(page).locator(".ag-body-vertical-scroll-viewport").evaluate((element) => { element.scrollTop = 2600; });
  await expect.poll(() => state.lists.some((url) => url.searchParams.get("page") === "1")).toBe(true);
  await expect(grid(page)).toContainText("추가 결과를 불러오는 중...");
  await expect(page.getByRole("button", { name: "조회", exact: true })).toBeEnabled();
  await searchPanel(page).getByLabel("성명 / 사번").fill("E0002");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  state.more.resolve();
  state.holdMore = false;
  await expect(cell(page, 0)).toHaveText("직원 002");
  await searchPanel(page).getByLabel("성명 / 사번").fill("");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await ready(page);
  await grid(page).locator(".ag-body-vertical-scroll-viewport").evaluate((element) => { element.scrollTop = 2600; });
  await expect(grid(page).locator('.ag-pinned-left-cols-container [row-index="50"] [col-id="rowNumber"]')).toHaveText("51");
  expect(state.errors).toEqual([]);
});

test("검색 시 XML 기본 정렬로 초기화하고 이후 헤더 정렬을 서버에 전달", async ({ page }) => {
  const state = await setup(page);
  state.failList = true;
  await openManager(page);
  await expect(grid(page).getByRole("alert")).toContainText("목록 조회 실패");
  await expect(grid(page)).not.toContainText("조회된 인사정보가 없습니다.");
  state.failList = false;
  await grid(page).getByRole("button", { name: "다시 시도" }).click();
  await ready(page);
  await expect(grid(page).getByRole("alert")).toHaveCount(0);
  expect(state.lists.at(-1)?.searchParams.has("sortField")).toBe(false);
  expect(state.lists.at(-1)?.searchParams.has("sortDirection")).toBe(false);
  const gradeHeader = grid(page).locator('.ag-header-cell[col-id="gradeName"]');
  await gradeHeader.click();
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("sortField")).toBe("gradeName");
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("sortDirection")).toBe("asc");
  await gradeHeader.click();
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("sortDirection")).toBe("desc");

  await searchPanel(page).getByLabel("성명 / 사번").fill("직원 00");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await ready(page);
  expect(state.lists.at(-1)?.searchParams.has("sortField")).toBe(false);
  expect(state.lists.at(-1)?.searchParams.has("sortDirection")).toBe(false);
  await expect(gradeHeader).not.toHaveClass(/ag-header-cell-sorted-(asc|desc)/);
  expect(state.errors).toEqual([]);
});

test("ERP 헤더에서 열 이동과 열 너비 조절을 허용", async ({ page }) => {
  const state = await setup(page);
  await openManager(page);
  await ready(page);

  const source = grid(page).locator('.ag-header-cell[col-id="employeeNo"]');
  const target = grid(page).locator('.ag-header-cell[col-id="gradeName"]');
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("이동 대상 헤더가 표시되지 않았습니다.");
  expect(sourceBox.x).toBeLessThan(targetBox.x);
  const startX = sourceBox.x + sourceBox.width / 2;
  const headerY = sourceBox.y + sourceBox.height / 2;
  await page.mouse.move(startX, headerY);
  await page.mouse.down();
  await page.mouse.move(startX + 8, headerY, { steps: 2 });
  await page.mouse.move(targetBox.x + targetBox.width - 2, headerY, { steps: 12 });
  await page.mouse.up();
  await expect.poll(async () => (await source.boundingBox())?.x)
    .toBeGreaterThan((await target.boundingBox())!.x);

  const employeeHeader = grid(page).locator('.ag-header-cell[col-id="employeeNo"]');
  const initialWidth = (await employeeHeader.boundingBox())?.width;
  const resizeHandle = employeeHeader.locator(".ag-header-cell-resize");
  const handleBox = await resizeHandle.boundingBox();
  if (initialWidth == null || !handleBox) throw new Error("사번 헤더 크기를 확인할 수 없습니다.");
  const handleX = handleBox.x + handleBox.width / 2;
  const handleY = handleBox.y + handleBox.height / 2;
  await page.mouse.move(handleX, handleY);
  await page.mouse.down();
  await page.mouse.move(handleX - 35, handleY, { steps: 5 });
  await page.mouse.up();
  await expect.poll(async () => (await employeeHeader.boundingBox())?.width)
    .toBeLessThan(initialWidth);
  expect(state.errors).toEqual([]);
});

test("상세 이전·다음, 확대·축소 탭 유지, 키보드 포커스 복귀", async ({ page }) => {
  const state = await setup(page);
  await openManager(page);
  await ready(page);
  await cell(page, 0).click();
  await expect(page.getByRole("button", { name: "이전 인사정보" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "다음 인사정보" })).toBeEnabled();
  await page.getByRole("button", { name: "다음 인사정보" }).click();
  await expect(page.getByRole("heading", { name: "직원 002" })).toBeVisible();
  await page.getByRole("button", { name: "이전 인사정보" }).click();
  await expect(page.getByRole("heading", { name: "직원 001" })).toBeVisible();
  await page.getByRole("tab", { name: "사역/근무" }).click();
  await page.getByRole("button", { name: "상세 확대" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("tab", { name: "사역/근무" })).toHaveAttribute("data-state", "active");
  await page.getByRole("button", { name: "목록과 함께 보기" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const separator = page.getByRole("separator", { name: "상세 패널 너비 조절" });
  const width = await separator.getAttribute("aria-valuenow");
  await separator.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(separator).not.toHaveAttribute("aria-valuenow", width ?? "");
  await page.getByRole("button", { name: "상세 닫기" }).click();
  await expect(cell(page, 0)).toBeFocused();
  expect(state.errors).toEqual([]);
});

test("모바일 2열 검색, 핵심 컬럼, 긴 선택값 확인과 모달 상세", async ({ page }) => {
  const state = await setup(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await openManager(page);
  await ready(page);
  const input = searchPanel(page).getByLabel("성명 / 사번");
  const grade = searchPanel(page).getByRole("combobox", { name: "직급", exact: true });
  const a = await input.boundingBox(), b = await grade.boundingBox();
  expect(a && b && Math.abs(a.y - b.y) < 1).toBe(true);
  expect(a?.width).toBeLessThanOrEqual(160);
  expect(b?.width).toBeLessThanOrEqual(160);
  await expect(grid(page).locator(".ag-header-cell").filter({ has: page.locator(".ag-header-cell-text") })).toHaveCount(3);
  await expect(grid(page).locator(".ag-header-cell-text")).toHaveText(["NO", "성명", "사번"]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await grade.click();
  await page.getByRole("option", { name: OPTIONS.grades[0].name }).click();
  await expect(grade).toHaveAttribute("title", OPTIONS.grades[0].name);
  await cell(page, 0).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "상세 확대" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(cell(page, 0)).toBeFocused();
  expect(state.errors).toEqual([]);
});

test("등록 공백 검증·포커스, 중복 제출 차단, 실패 재시도·필터 안내", async ({ page }) => {
  const state = await setup(page);
  await openManager(page);
  await ready(page);
  await searchPanel(page).getByLabel("성명 / 사번").fill("E0001");
  await page.getByRole("button", { name: "조회", exact: true }).click();
  await expect.poll(() => state.lists.at(-1)?.searchParams.get("keyword")).toBe("E0001");
  await page.getByRole("button", { name: "신규 등록" }).click();
  const dialog = page.getByRole("dialog", { name: "신규 교직원 등록" });
  await dialog.getByLabel("사번", { exact: true }).fill(" ");
  await dialog.getByRole("button", { name: "등록", exact: true }).click();
  await expect(dialog.getByLabel("사번", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.getByLabel("사번", { exact: true })).toBeFocused();
  expect(state.creates).toHaveLength(0);
  await dialog.getByLabel("사번", { exact: true }).fill(" TEST ");
  await dialog.getByLabel("성명", { exact: true }).fill(" 새 직원 ");
  state.failCreate = true;
  await dialog.getByRole("button", { name: "등록", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("이미 등록된 사번입니다.");
  expect(state.creates[0].employeeNo).toBe("TEST");
  state.failCreate = false;
  state.holdCreate = true;
  await dialog.getByRole("button", { name: "등록", exact: true }).click();
  await expect(dialog.getByLabel("사번", { exact: true })).toBeDisabled();
  await expect(dialog.getByRole("button", { name: "취소", exact: true })).toBeDisabled();
  await dialog.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit());
  expect(state.creates).toHaveLength(2);
  state.create.resolve();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("status").filter({ hasText: "새 직원 등록이 완료되었습니다" })).toContainText("검색조건에 따라 목록에 보이지 않을 수 있습니다");
  await page.getByRole("button", { name: "신규 등록" }).click();
  await expect(dialog.getByLabel("사번", { exact: true })).toHaveValue("");
  await dialog.getByRole("button", { name: "취소", exact: true }).click();
  expect(state.errors).toEqual([]);
});

test("미저장 입력 취소 확인 유지", async ({ page }) => {
  const state = await setup(page);
  await openManager(page);
  await ready(page);
  await page.getByRole("button", { name: "신규 등록" }).click();
  const dialog = page.getByRole("dialog", { name: "신규 교직원 등록" });
  await dialog.getByLabel("사번", { exact: true }).fill("UNSAVED");
  await dialog.getByRole("button", { name: "취소", exact: true }).click();
  await page.getByRole("button", { name: "계속 작성" }).click();
  await expect(dialog.getByLabel("사번", { exact: true })).toHaveValue("UNSAVED");
  await dialog.getByRole("button", { name: "취소", exact: true }).click();
  await page.getByRole("button", { name: "입력 버리기" }).click();
  await expect(dialog).toHaveCount(0);
  expect(state.creates).toHaveLength(0);
  expect(state.errors).toEqual([]);
});

test("상세 호출 컬럼이 모바일에서 숨겨져도 같은 행의 핵심 컬럼으로 포커스 복귀", async ({ page }) => {
  const state = await setup(page);
  await openManager(page);
  await ready(page);
  await cell(page, 0).focus();
  await page.keyboard.press("Control+ArrowRight");
  await cell(page, 0, "detail").getByRole("button", { name: "상세보기" }).click();
  await expect(page.getByRole("button", { name: "다음 인사정보" })).toBeEnabled();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(grid(page).locator('.ag-header-cell[col-id="detail"]')).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(cell(page, 0)).toBeFocused();
  expect(state.errors).toEqual([]);
});

test("메뉴 조건별 workspace 탭 상태 유지와 비활성 탭의 상세 포털 차단", async ({ page }) => {
  const state = await setup(page);
  await openManager(page);
  await ready(page);
  await cell(page, 0).click();
  await expect(page.getByRole("button", { name: "다음 인사정보" })).toBeEnabled();
  await page.getByRole("button", { name: "인사-기획", exact: true }).click();
  await expect(cell(page, 0)).toHaveText("직원 002");
  await expect(searchPanel(page).getByRole("combobox", { name: "소속 부서", exact: true })).toContainText("기획부");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("tab", { name: "인사관리", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "직원 001" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(cell(page, 0)).toBeFocused();
  expect(state.errors).toEqual([]);
});

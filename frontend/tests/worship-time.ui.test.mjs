import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { createServer } from "vite";

let server;
let browser;
let baseURL;

before(async () => {
  server = await createServer({
    root: fileURLToPath(new URL("..", import.meta.url)),
    server: { host: "127.0.0.1", port: 0, open: false },
  });
  await server.listen();
  baseURL = server.resolvedUrls.local[0];
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
});

async function setup({ editable = true, existing = true, loadFailure = false } = {}) {
  const context = await browser.newContext();
  await context.addInitScript((canEdit) => {
    sessionStorage.setItem("authStore", JSON.stringify({
      isAuthenticated: true,
      user: {
        name: "Test",
        permissions: {
          PROGRAM_HOME: {
            canRead: true, canWrite: canEdit, canUpdate: canEdit, canDelete: canEdit,
          },
        },
      },
      token: null,
    }));
  }, editable);
  const state = {
    items: existing ? [
      { timeId: 1, title: "주일오전 축제예배", time: "10:00", location: "본당", orderNo: 1 },
      { timeId: 2, title: "새벽기도", time: "05:00", location: "본당", orderNo: 2 },
    ] : [],
    requests: [],
    saveFailure: false,
    deleteFailure: false,
    loadFailure,
  };
  await context.route(/\/api\//, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (!path.startsWith("/api/")) return route.continue();
    if (!path.startsWith("/api/official/worship/time/")) {
      return route.fulfill({ json: { success: true, data: [], statusCode: 200 } });
    }
    if ((path.endsWith("/getInfo") && state.loadFailure)
      || (request.method() === "DELETE" && state.deleteFailure)
      || (["POST", "PUT"].includes(request.method()) && state.saveFailure)) {
      return route.fulfill({
        status: 500, json: { success: false, message: "테스트 오류", statusCode: 500 },
      });
    }
    if (request.method() !== "GET") {
      state.requests.push({ method: request.method(), path, data: request.postDataJSON() });
      state.items = request.method() === "DELETE" ? [] : request.postDataJSON();
    }
    await route.fulfill({ json: { success: true, data: state.items, statusCode: 200 } });
  });
  const page = await context.newPage();
  return { context, page, state };
}

test("view/edit routes preserve editing, ordering, cancellation and save errors", async () => {
  const { context, page, state } = await setup();
  try {
    await page.goto(`${baseURL}worship/time`);
    await page.getByRole("button", { name: "편집", exact: true }).click();
    await expect(page).toHaveURL(/\/worship\/time\/write$/);
    const title = page.getByRole("textbox", { name: "예배명", exact: true }).first();
    await expect(title).toHaveValue("주일오전 축제예배");
    await title.press("End");
    await title.pressSequentially(" 수정");
    await expect(title).toBeFocused();
    await page.getByRole("button", { name: "취소", exact: true }).click();
    await expect(page).toHaveURL(/\/worship\/time$/);
    assert.equal(state.requests.length, 0);

    await page.getByRole("button", { name: "편집", exact: true }).click();
    await expect(title).toHaveValue("주일오전 축제예배");
    await page.getByRole("button", { name: "모두 펼치기", exact: true }).click();
    await title.fill("주일오전 축제예배 수정");
    await page.getByRole("button", { name: "아래로", exact: true }).first().click();
    await expect(title).toHaveValue("새벽기도");
    await page.getByRole("button", { name: "+ 예배 시간 추가", exact: true }).click();
    await page.getByRole("textbox", { name: "예배명", exact: true }).last().fill("추가 예배");
    await page.getByRole("button", { name: "삭제", exact: true }).last().click();

    state.saveFailure = true;
    await page.getByRole("button", { name: "저장", exact: true }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "예배명", exact: true }).nth(1))
      .toHaveValue("주일오전 축제예배 수정");
    state.saveFailure = false;
    await page.getByRole("button", { name: "저장", exact: true }).click();
    await expect(page).toHaveURL(/\/worship\/time$/);
    assert.equal(state.requests[0].method, "PUT");
    assert.deepEqual(state.requests[0].data.map((item) => item.orderNo), [1, 2]);
    assert.equal(state.requests[0].data[0].title, "새벽기도");
    await expect(page.getByText("주일오전 축제예배 수정", { exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("direct edit supports empty creation, delete errors and confirmed deletion", async () => {
  const { context, page, state } = await setup({ existing: false });
  try {
    await page.goto(`${baseURL}worship/time/write`);
    await page.getByRole("button", { name: "+ 예배 시간 추가", exact: true }).click();
    await page.getByRole("textbox", { name: "예배명", exact: true }).fill("새 예배");
    await page.getByRole("button", { name: "저장", exact: true }).click();
    await expect(page).toHaveURL(/\/worship\/time$/);
    assert.equal(state.requests[0].method, "POST");
    await page.getByRole("button", { name: "편집", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "예배명", exact: true })).toHaveValue("새 예배");

    page.once("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("button", { name: "전체 삭제", exact: true }).click();
    assert.equal(state.requests.length, 1);
    state.deleteFailure = true;
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "전체 삭제", exact: true }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "예배명", exact: true })).toHaveValue("새 예배");
    state.deleteFailure = false;
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "전체 삭제", exact: true }).click();
    await expect(page).toHaveURL(/\/worship\/time$/);
    assert.equal(state.requests[1].method, "DELETE");
  } finally {
    await context.close();
  }
});

test("load failure blocks saving until retry succeeds", async () => {
  const { context, page, state } = await setup({ loadFailure: true });
  try {
    await page.goto(`${baseURL}worship/time/write`);
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("button", { name: "저장", exact: true })).toBeDisabled();
    state.loadFailure = false;
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "예배명", exact: true }).first())
      .toHaveValue("주일오전 축제예배");
  } finally {
    await context.close();
  }
});

test("read-only users cannot open the edit route", async () => {
  const { context, page } = await setup({ editable: false });
  try {
    await page.goto(`${baseURL}worship/time/write`);
    await expect(page).toHaveURL(/\/worship\/time$/);
    await expect(page.getByRole("button", { name: "편집", exact: true })).toHaveCount(0);
  } finally {
    await context.close();
  }
});

for (const width of [320, 1280]) {
  test(`cards support folding, keyboard editing and responsive layout at ${width}px`, async () => {
    const { context, page } = await setup();
    try {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${baseURL}worship/time/write`);
      const cards = page.locator("[data-worship-item]");
      await expect(cards).toHaveCount(2);
      await expect(cards.first().getByRole("textbox", { name: "예배명", exact: true }))
        .toBeVisible();
      await expect(cards.last().getByRole("textbox", { name: "예배명", exact: true }))
        .toHaveCount(0);
      await expect(cards.first().getByRole("button", { name: "위로", exact: true }))
        .toBeDisabled();
      await expect(cards.last().getByRole("button", { name: "아래로", exact: true }))
        .toBeDisabled();

      await cards.first().getByRole("textbox", { name: "시간", exact: true }).fill("주일 오전 11:00");
      await cards.first().getByRole("textbox", { name: "비고", exact: true }).fill("첫째 줄\n둘째 줄");
      await page.getByRole("button", { name: "모두 접기", exact: true }).click();
      await expect(page.getByRole("textbox")).toHaveCount(0);
      const toggle = cards.first().getByRole("button", { name: /주일오전 축제예배/ });
      await expect(toggle).toContainText("주일 오전 11:00");
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(cards.first().getByRole("textbox", { name: "비고", exact: true }))
        .toHaveValue("첫째 줄\n둘째 줄");
      await page.getByRole("button", { name: "+ 예배 시간 추가", exact: true }).click();
      await expect(cards.last().getByRole("textbox", { name: "예배명", exact: true }))
        .toBeVisible();
      await cards.last().getByRole("button", { name: "삭제", exact: true }).click();
      await page.getByRole("button", { name: "+ 예배 시간 추가", exact: true }).click();
      await expect(cards.last().getByRole("textbox", { name: "예배명", exact: true }))
        .toBeVisible();
      await expect(cards.first().getByRole("textbox", { name: "비고", exact: true }))
        .toHaveValue("첫째 줄\n둘째 줄");
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        true,
      );
    } finally {
      await context.close();
    }
  });
}

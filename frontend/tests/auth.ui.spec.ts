import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.getByLabel("Username").fill("test-user");
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/login", (route) => route.fulfill({
    json: { success: true, statusCode: 200, data: { userId: "test-user", username: "Test" } },
  }));
  await page.route("**/api/auth/check", (route) => route.fulfill({
    json: { success: true, statusCode: 200, data: { authenticated: true } },
  }));
});

test("login enters ERP and preserves query and hash", async ({ page }) => {
  await page.goto("/tests/auth-fixture.html");
  await login(page);
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  await expect(page.getByTestId("path")).toHaveText("/erp?menu=test#detail");
});

for (const failure of ["network", "server", "invalid"]) {
  test(`session ${failure} failure keeps auth and offers retry`, async ({ page }) => {
    await page.route("**/api/auth/check", (route) => {
      if (failure === "network") return route.abort("failed");
      return route.fulfill({
        status: failure === "server" ? 503 : 200,
        json: failure === "server"
          ? { success: false, statusCode: 503, message: "Service unavailable" }
          : { success: true, statusCode: 200, data: {} },
      });
    });
    await page.goto("/tests/auth-fixture.html");
    await login(page);
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
    await expect(page.getByTestId("path")).toHaveText("/erp?menu=test#detail");
    await expect(page.getByText("ERP content", { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("authStore")!).isAuthenticated)).toBe(true);
    await page.unroute("**/api/auth/check");
    await page.route("**/api/auth/check", (route) => route.fulfill({
      json: { success: true, statusCode: 200, data: { authenticated: true } },
    }));
    await page.getByRole("button", { name: "다시 시도" }).click();
    await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  });
}

test("a genuinely expired session returns to login", async ({ page }) => {
  await page.route("**/api/auth/check", (route) => route.fulfill({
    json: { success: true, statusCode: 200, data: { authenticated: false } },
  }));
  await page.goto("/tests/auth-fixture.html");
  await login(page);
  await expect(page.getByTestId("path")).toHaveText("/auth/login");
  await expect(page.getByLabel("Password")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("authStore")!).isAuthenticated)).toBe(false);
});

test("a late pre-login 401 does not log out the new session", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  let started!: () => void;
  const ready = new Promise<void>((resolve) => { started = resolve; });
  await page.route("**/api/probe", async (route) => {
    started();
    await held;
    await route.fulfill({ status: 401, json: { success: false, statusCode: 401 } });
  });
  await page.goto("/tests/auth-fixture.html");
  await page.getByRole("button", { name: "Start request" }).click();
  await ready;
  await login(page);
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  const completed = page.waitForResponse("**/api/probe");
  release();
  await completed;
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("authStore")!).isAuthenticated)).toBe(true);
});

test("duplicate form submissions send a single login request", async ({ page }) => {
  let count = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/auth/login", async (route) => {
    count += 1;
    await held;
    await route.fulfill({ json: { success: true, statusCode: 200, data: { userId: "test-user" } } });
  });
  await page.goto("/tests/auth-fixture.html");
  await page.getByLabel("Username").fill("test-user");
  await page.getByLabel("Password").fill("test-password");
  await page.locator("form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await expect.poll(() => count).toBe(1);
  release();
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  expect(count).toBe(1);
});

test("a current ERP request 401 expires auth", async ({ page }) => {
  await page.route("**/api/probe", (route) => route.fulfill({
    status: 401, json: { success: false, statusCode: 401 },
  }));
  await page.goto("/tests/auth-fixture.html");
  await login(page);
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start request" }).click();
  await expect(page.getByTestId("path")).toHaveText("/auth/login");
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("authStore")!).isAuthenticated)).toBe(false);
});

test("a stale negative session check cannot undo a newer login", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  let oldRequests = 0;
  let holdChecks = true;
  await page.route("**/api/auth/check", async (route) => {
    const old = holdChecks;
    if (old) {
      oldRequests += 1;
      await held;
    }
    await route.fulfill({ json: {
      success: true, statusCode: 200, data: { authenticated: !old },
    } });
  });
  await page.goto("/tests/auth-fixture.html");
  await login(page);
  await expect.poll(() => oldRequests).toBeGreaterThan(0);
  holdChecks = false;
  await page.getByRole("button", { name: "New login" }).click();
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  const completed = page.waitForResponse("**/api/auth/check");
  release();
  await completed;
  await expect(page.getByText("ERP content", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("authStore")!).isAuthenticated)).toBe(true);
});

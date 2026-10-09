import { expect, test, type Page } from "@playwright/test";

const fixture = "/tests/official-popup-fixture.html";
const key = (id: number) => `official-popup-dismiss:banner-${id}`;

async function setup(page: Page, query = "") {
  await page.route("**/popup-test-image/*", async (route) => {
    const dimensions = new URL(route.request().url()).pathname.split("/").pop()!.replace(".svg", "").split("-");
    const [width, height] = dimensions.map(Number);
    await route.fulfill({ contentType: "image/svg+xml", body:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 100}" height="${height * 100}" viewBox="0 0 ${width * 100} ${height * 100}"><rect width="100%" height="100%" fill="#5c6bc0"/><text x="20" y="50" fill="white">Banner ${width}:${height}</text></svg>` });
  });
  await page.goto(fixture + query);
  await page.getByRole("button", { name: "공지 열기", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".official-popup-image img").first()).toBeVisible();
}

for (const [width, height] of [[320, 568], [390, 844], [844, 390], [768, 1024], [1440, 900]]) {
  test(`image ratios, controls and bounds at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await setup(page, "?ratios=16:9,1:1,3:4,1:3");
    let checked = 0;
    while (true) {
      await expect(page.locator(".official-popup-image img").first()).toBeVisible();
      await expect.poll(async () => page.locator(".official-popup-image img").evaluateAll((images) =>
        images.every((image) => image instanceof HTMLImageElement && image.complete))).toBe(true);
      const bounds = await page.locator('[data-ui="official-popup"]').boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(15);
      expect(bounds!.y).toBeGreaterThanOrEqual(15);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width - 15);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height - 15);
      expect(bounds!.width).toBeLessThanOrEqual(width < 768 ? Math.min(322, width * 0.86 + 2) : 658);
      expect(bounds!.height).toBeLessThanOrEqual(Math.min(height * 0.78, width < 768 ? 600 : 640) + 2);
      const images = await page.locator(".official-popup-image img").evaluateAll((elements) =>
        elements.map((element) => {
          const image = element as HTMLImageElement;
          const bounds = image.getBoundingClientRect();
          const region = image.closest(".official-popup-image")!;
          return { ratio: bounds.width / bounds.height, naturalRatio: image.naturalWidth / image.naturalHeight,
            scroll: region.getAttribute("data-scroll"), overflow: region.scrollHeight > region.clientHeight };
        }));
      images.forEach((image) => {
        expect(image.ratio).toBeCloseTo(image.naturalRatio, 3);
        expect(image.overflow).toBe(image.scroll === "true");
      });
      if (width < 768) expect(images).toHaveLength(1);
      expect(images.length).toBeLessThanOrEqual(2);
      if (width < 768) images.forEach((image) => expect(image.overflow).toBe(false));
      checked += images.length;
      for (const button of await page.locator(".official-popup-button").all()) {
        const box = await button.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.y + box!.height).toBeLessThanOrEqual(height - 15);
      }
      const next = page.getByRole("button", { name: "다음 공지" });
      if (await next.isDisabled()) break;
      await next.click();
    }
    expect(checked).toBe(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("mobile resize preserves active banner and recomputes dimensions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page, "?ratios=3:4,1:3");
  await page.getByRole("button", { name: "다음 공지" }).click();
  await expect(page.getByRole("img", { name: "공지 2", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.getByRole("img", { name: "공지 2", exact: true })).toBeVisible();
  const box = await page.locator('[data-ui="official-popup"]').boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(375);
  await expect(page.getByRole("button", { name: "팝업 전체 닫기" })).toBeVisible();
});

test("second mobile banner returns to its complete desktop group and back", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page, "?ratios=3:4,3:4,3:4");
  await page.getByRole("button", { name: "다음 공지" }).click();
  await expect(page.getByRole("img", { name: "공지 2", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".official-popup-card")).toHaveCount(2);
  await expect(page.getByRole("img", { name: "공지 1", exact: true })).toBeVisible();
  await expect(page.getByText("페이지 1 / 2", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("img", { name: "공지 2", exact: true })).toBeVisible();
  await expect(page.getByText("페이지 2 / 3", { exact: true })).toBeVisible();
});

test("twenty banners are reachable in ten desktop pages without duplicates", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setup(page, `?ratios=${Array(20).fill("3:4").join(",")}`);
  const titles: string[] = [];
  for (let index = 0; index < 10; index++) {
    await expect(page.locator(".official-popup-card")).toHaveCount(2);
    await expect(page.getByText(`페이지 ${index + 1} / 10`, { exact: true })).toBeVisible();
    titles.push(...await page.locator(".official-popup-card").evaluateAll((cards) => cards.map((card) => card.getAttribute("aria-label")!)));
    if (index < 9) await page.getByRole("button", { name: "다음 공지" }).click();
  }
  expect(titles).toEqual(Array.from({ length: 20 }, (_, i) => `공지 ${i + 1}`));
  await expect(page.getByRole("button", { name: "다음 공지" })).toBeDisabled();
  await page.getByRole("button", { name: "이전 공지" }).click();
  await expect(page.getByText("페이지 9 / 10", { exact: true })).toBeVisible();
});

test("one desktop group uses the same page numbering as mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setup(page, "?ratios=3:4,3:4");
  await expect(page.getByText("페이지 1 / 1", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "다음 공지" })).toBeDisabled();
});

test("single banner uses page 1 of 1 on both desktop and mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setup(page, "?ratios=3:4");
  await expect(page.getByText("페이지 1 / 1", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText("페이지 1 / 1", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "이전 공지" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "다음 공지" })).toBeDisabled();
});

test("popup and image top remain above the site's high-z-index navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await setup(page, "?ratios=1:3");
  const region = page.locator(".official-popup-image");
  expect(await region.evaluate((element) => element.scrollTop)).toBe(0);
  expect(await page.getByRole("img", { name: "공지 1", exact: true }).evaluate((image) => {
    const bounds = image.getBoundingClientRect();
    const region = image.closest(".official-popup-image")!;
    return {
      topVisible: bounds.top >= region.getBoundingClientRect().top - 1,
      aboveHeader: image.contains(document.elementFromPoint(bounds.left + 10, bounds.top + 10)),
    };
  })).toEqual({ topVisible: true, aboveHeader: true });
  expect(await page.getByRole("heading", { name: "소식안내" }).evaluate((heading) => {
    const bounds = heading.getBoundingClientRect();
    return heading.contains(document.elementFromPoint(bounds.left + 2, bounds.top + 2));
  })).toBe(true);
});

test("closing the middle desktop banner preserves other visible cards", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setup(page);
  await expect(page.locator(".official-popup-card")).toHaveCount(2);
  await page.getByRole("article", { name: "공지 2", exact: true }).getByRole("button", { name: "닫기", exact: true }).click();
  await expect(page.getByRole("img", { name: "공지 1", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "공지 3", exact: true })).toBeVisible();
  await expect(page.getByRole("article", { name: "공지 2", exact: true })).toHaveCount(0);
});

test("DB policies persist by ID, survive reload and do not hide reordered banners", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  await page.getByRole("button", { name: "하루 안보기" }).click();
  const record = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)!), key(0));
  expect(record.option).toBe("DAY");
  expect(record.expiresAt - Date.now()).toBeGreaterThan(23 * 3600000);
  await page.getByRole("button", { name: "4시간 안보기" }).click();
  await expect(page.getByRole("button", { name: "일주일 안보기" })).toBeVisible();
  await page.getByRole("button", { name: "일주일 안보기" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const state = await page.context().storageState();
  const context = await browser.newContext({ storageState: state, viewport: { width: 390, height: 844 } });
  const restored = await context.newPage();
  await restored.goto(fixture);
  await restored.getByRole("button", { name: "공지 열기" }).click();
  await expect(restored.getByRole("dialog")).not.toBeVisible();
  await restored.getByRole("button", { name: "순서 변경" }).click();
  await expect(restored.getByRole("dialog")).not.toBeVisible();
  await context.close();
});

test("reordering keeps the active ID and hides only the saved banner ID", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  await page.getByRole("button", { name: "하루 안보기" }).click();
  await expect(page.getByRole("img", { name: "공지 2", exact: true })).toBeVisible();
  await page.locator("button").filter({ hasText: /^순서 변경$/ }).evaluate((button) =>
    button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  await expect(page.getByRole("img", { name: "공지 2", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "이전 공지" }).click();
  await expect(page.getByRole("img", { name: "공지 3", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "공지 1", exact: true })).not.toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([key(0)]);
});

test("expiry boundary and policy changes restore banner; NONE has no period button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.install({ time: new Date("2026-10-09T00:00:00Z") });
  await page.addInitScript(({ storageKey, expiresAt }) => {
    localStorage.setItem(storageKey, JSON.stringify({ option: "WEEK", expiresAt }));
  }, { storageKey: key(0), expiresAt: Date.parse("2026-10-09T00:00:02Z") });
  await setup(page, "?ratios=16:9,3:4&options=WEEK,NONE");
  await expect(page.getByRole("img", { name: "공지 1", exact: true })).not.toBeVisible();
  await expect(page.getByRole("button", { name: /안보기/ })).toHaveCount(0);
  await page.clock.runFor(2000);
  await page.getByRole("button", { name: "이전 공지" }).click();
  await expect(page.getByRole("button", { name: "일주일 안보기" })).toBeVisible();
  await page.goto(fixture + "?ratios=16:9&options=NONE");
  await page.getByRole("button", { name: "공지 열기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: /안보기/ })).toHaveCount(0);
});

test("keyboard focus, explicit closing and link contracts", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page, "?ratios=16:9,3:4");
  await expect(page.getByRole("link", { name: "공지 1 자세히 보기 (새 탭)", exact: true })).toHaveAttribute("href", "/external-test");
  await expect(page.getByRole("link", { name: "공지 1 자세히 보기 (새 탭)", exact: true })).toHaveAttribute("target", "_blank");
  await page.mouse.click(4, 4);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await expect(page.getByRole("button", { name: "팝업 전체 닫기" })).toBeFocused();
  await expect(page.getByRole("link", { name: "공지 2 자세히 보기 (새 탭)", exact: true })).toHaveAttribute("href", "/news/banner/view?rqstNo=banner-1");
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await page.getByRole("dialog").evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true);
  }
  const scroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "공지 열기", exact: true })).toBeFocused();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test("image failures expose retry and closing without blocking navigation", async ({ page }) => {
  let fail = true;
  await page.route("**/popup-test-image/*", (route) => fail
    ? route.fulfill({ status: 404, body: "missing" })
    : route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="1200"><rect width="100%" height="100%" fill="#5c6bc0"/></svg>' }));
  await page.goto(fixture + "?ratios=1:3");
  await page.getByRole("button", { name: "공지 열기" }).click();
  await expect(page.getByRole("alert")).toContainText("이미지를 불러오지 못했습니다.");
  fail = false;
  await page.getByRole("button", { name: "다시 시도" }).click();
  await expect(page.getByRole("img", { name: "공지 1", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("corrupt storage is diagnosed and cleared without hiding a valid banner", async ({ page }) => {
  await page.addInitScript((storageKey) => localStorage.setItem(storageKey, "{broken"), key(0));
  await setup(page, "?ratios=16:9");
  await expect(page.getByText("팝업 숨김 정보가 손상되어 초기화했습니다.")).toBeVisible();
  expect(await page.evaluate((storageKey) => localStorage.getItem(storageKey), key(0))).toBeNull();
  await expect(page.getByRole("button", { name: "하루 안보기" })).toBeVisible();
});

test("image loading keeps closing available and tiny height keeps controls reachable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 180 });
  let complete: (() => void) | undefined;
  const waiting = new Promise<void>((resolve) => { complete = resolve; });
  await page.route("**/popup-test-image/*", async (route) => {
    await waiting;
    await route.fulfill({ status: 404, body: "missing" });
  });
  await page.goto(fixture + "?ratios=16:9");
  await page.getByRole("button", { name: "공지 열기" }).click();
  await expect(page.getByText("이미지 불러오는 중")).toBeVisible();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  complete?.();
});

test("blocked storage reports failure and leaves ordinary closing available", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await setup(page, "?ratios=16:9");
  await page.getByRole("button", { name: "하루 안보기" }).click();
  await expect(page.getByText("팝업 숨김 기간을 유지할 수 없습니다. 브라우저 저장소 설정을 확인해주세요.")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

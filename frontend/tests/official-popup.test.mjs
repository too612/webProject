import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/official/index/officialIndexModel.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const model = {};
vm.runInNewContext(outputText, { exports: model });

test("DB policies retain exact labels and durations", () => {
  for (const [option, label, hours] of [
    ["NONE", "", 0], ["HOURS_4", "4시간 안보기", 4],
    ["DAY", "하루 안보기", 24], ["WEEK", "일주일 안보기", 168],
  ]) {
    assert.equal(model.getPopupDismissOption(option), option);
    assert.equal(model.POPUP_DISMISS_POLICIES[option].label, label);
    assert.equal(model.POPUP_DISMISS_POLICIES[option].duration, hours * 3600000);
  }
  assert.equal(model.getPopupDismissOption(), "DAY");
  assert.throws(() => model.getPopupDismissOption("BAD"), /숨김 설정/);
  assert.notEqual(model.popupStorageKey("1"), model.popupStorageKey("2"));
});

test("stored dismissals reject corrupt, non-finite and invalid policy data", () => {
  assert.equal(model.parsePopupDismissal('{"option":"WEEK","expiresAt":12345}').expiresAt, 12345);
  for (const value of [
    "{", "null", "[]", '{"option":"NONE","expiresAt":1}',
    '{"option":"BAD","expiresAt":1}', '{"option":"","expiresAt":1}',
    '{"option":"DAY","expiresAt":"123"}', '{"option":"DAY","expiresAt":0}',
    '{"option":"DAY","expiresAt":1e999}',
  ]) assert.throws(() => model.parsePopupDismissal(value));
});

test("all DB periods expire exactly at the boundary and policy changes override saved data", () => {
  for (const option of ["HOURS_4", "DAY", "WEEK"]) {
    const record = { option, expiresAt: 1000 + model.POPUP_DISMISS_POLICIES[option].duration };
    assert.equal(model.isPopupDismissed({ dismissOption: option }, record, record.expiresAt - 1), true);
    assert.equal(model.isPopupDismissed({ dismissOption: option }, record, record.expiresAt), false);
    assert.equal(model.isPopupDismissed({ dismissOption: option }, record, record.expiresAt + 1), false);
    assert.equal(model.isPopupDismissed({ dismissOption: "NONE" }, record, 1001), false);
    assert.equal(model.isPopupDismissed({ dismissOption: option === "DAY" ? "WEEK" : "DAY" }, record, 1001), false);
  }
  assert.equal(model.isPopupDismissed({}, { option: "DAY", expiresAt: 10000 }, 1000), true);
  assert.equal(model.isPopupDismissed({ dismissOption: "DAY" }, undefined, 1000), false);
});

for (const [width, height] of [[320, 568], [390, 844], [844, 390], [768, 1024], [1440, 900]]) {
  for (const [iw, ih] of [[1600, 900], [600, 600], [900, 1200], [400, 1200]]) {
    test(`layout fits ${width}x${height} for ${iw}:${ih} without distortion`, () => {
      const available = { width: width - 34, height: height - 34 - 56 - 45 - 45 };
      const layout = model.getPopupLayout({ width: iw, height: ih }, available, width < 768);
      assert.ok(layout.width <= available.width);
      assert.ok(layout.height <= available.height);
      assert.ok(Math.abs(layout.imageWidth / layout.imageHeight - iw / ih) < 0.00001);
      assert.equal(layout.scroll, layout.imageHeight > available.height);
      if (!layout.scroll) assert.ok(layout.imageHeight <= available.height);
    });
  }
}

test("mobile long portrait fits entirely without scrolling and keeps controls wide", () => {
  const available = { width: 356, height: 650 };
  assert.equal(model.getPopupLayout({ width: 3, height: 4 }, available, true).scroll, false);
  const long = model.getPopupLayout({ width: 1, height: 3 }, available, true);
  assert.equal(long.scroll, false);
  assert.equal(long.width, 240);
  assert.equal(long.height, 650);
  assert.ok(Math.abs(long.imageWidth - 650 / 3) < 0.001);
  assert.equal(model.getPopupLayout({ width: 1, height: 3 }, available, false).scroll, true);
  assert.throws(() => model.getPopupLayout({ width: 0, height: 3 }, available, true));
});

test("popup budget leaves room around the card rather than filling the viewport", () => {
  for (const [width, height] of [[320, 568], [390, 844], [844, 390], [1440, 900]]) {
    const budget = model.getPopupBudget({ width, height }, width < 768);
    assert.ok(budget.height <= height * 0.78);
    assert.ok(budget.height <= (width < 768 ? 600 : 640));
    assert.ok(budget.width <= (width < 768 ? Math.min(320, width * 0.86) : 960));
  }
  const layout = model.getPopupLayout({ width: 16, height: 9 }, { width: 960, height: 490 }, false);
  assert.equal(layout.width, 320);
});

test("mobile shows one and desktop has stable pages of at most two cards", () => {
  assert.equal(model.getPopupPage([480, 360, 240], 0, 1400, true).end, 1);
  assert.equal(model.getPopupPage([480, 360, 240], 0, 1100, false).end, 2);
  assert.equal(model.getPopupPage([480, 360, 240], 0, 1120, false).end, 2);
  assert.equal(model.getPopupPage([480, 360, 240], 2, 1100, false).start, 2);
  assert.equal(model.getPopupPage([], 0, 500, false).end, 0);
  assert.equal(model.getPopupPage([320, 320, 320], 1, 656, false).start, 0);
  assert.equal(model.getPopupPage([320, 320, 320], 2, 656, false).total, 2);
  for (const count of [1, 2, 3, 20]) {
    const widths = Array(count).fill(320);
    const visited = [];
    let active = 0;
    while (active < count) {
      const page = model.getPopupPage(widths, active, 656, false);
      assert.ok(page.end - page.start <= 2);
      visited.push(...Array.from({ length: page.end - page.start }, (_, i) => page.start + i));
      active = page.end;
    }
    assert.deepEqual(visited, Array.from({ length: count }, (_, i) => i));
    if (count > 1) assert.equal(model.getPopupPage(widths, 1, 500, false).end, 2);
  }
});

test("home popup query does not truncate active banners to five", () => {
  const xml = readFileSync(new URL("../../src/main/resources/mapper/official/index/OfficialIndexMapper.xml", import.meta.url), "utf8");
  const query = xml.match(/<select id="selectPopupBanners"[\s\S]*?<\/select>/)?.[0];
  assert.ok(query);
  assert.match(query, /ORDER BY cp\.order_no ASC\s*<\/select>/);
  assert.match(query, /ORDER BY cf\.file_id ASC LIMIT 1/);
});

test("publication period keeps inclusive start and end boundaries", () => {
  const start = Date.parse("2026-10-01T00:00:00Z");
  const end = Date.parse("2026-10-08T00:00:00Z");
  const banner = { startDt: "2026-10-01T00:00:00Z", endDt: "2026-10-08T00:00:00Z" };
  assert.equal(model.isPopupInPeriod(banner, start - 1), false);
  assert.equal(model.isPopupInPeriod(banner, start), true);
  assert.equal(model.isPopupInPeriod(banner, end), true);
  assert.equal(model.isPopupInPeriod(banner, end + 1), false);
});

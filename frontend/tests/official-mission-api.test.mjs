import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const domains = [
  {
    source: "../src/official/training/outreach/outreachApi.ts",
    api: "outreachApi",
    method: "getOutreachContent",
    endpoint: "/official/training/outreach/getInfo",
    collection: "activities",
  },
  {
    source: "../src/official/news/mission/missionApi.ts",
    api: "missionApi",
    method: "getMissionContent",
    endpoint: "/official/news/mission/getInfo",
    collection: "missionaries",
  },
];

function loadApi(domain, get) {
  const source = readFileSync(new URL(domain.source, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require(name) {
      if (name.endsWith("api.client")) return { default: { get } };
      if (name.endsWith("apiError")) {
        return { getApiErrorMessage: (error, fallback) => error.message || fallback };
      }
      if (name === "./outreachModel") return loadOutreachModel();
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return exports[domain.api];
}

function loadOutreachModel() {
  const source = readFileSync(new URL("../src/official/training/outreach/outreachModel.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports });
  return exports;
}

test("outreach country coordinate notice and coordinate guard agree with defaults", () => {
  const model = loadOutreachModel();
  assert.match(model.OUTREACH_MAP_NOTICE, /국가 대표 위치/);
  assert.match(model.OUTREACH_MAP_NOTICE, /실제 파견지 또는 사역지를 의미하지 않습니다/);
  assert.equal(model.DEFAULT_OUTREACH_CONTENT.missionSectionDescription, model.OUTREACH_MAP_NOTICE);
  for (const [latitude, longitude, expected] of [
    [0, 0, true], [-90, -180, true], [90, 180, true],
    [12.879721, 121.774017, true], [null, null, false],
    [undefined, undefined, false], [NaN, 0, false], [0, Infinity, false],
    [91, 0, false], [0, -181, false], ["12", 121, false],
  ]) {
    assert.equal(model.hasOutreachCoordinates({ latitude, longitude }), expected);
  }
});

test("outreach keeps country-only and missing-coordinate records in the list", async () => {
  const api = loadApi(domains[0], async () => ({
    data: { success: true, data: [
      { employeeNo: "000098", name: "Test", country: "Philippines", countryCode: "PH",
        latitude: 12.879721, longitude: 121.774017, dispatchDate: "2011-03-01",
        city: null, region: null, assignmentContent: "Dispatch" },
      { employeeNo: "000099", name: "Test 2", country: "Cambodia", countryCode: "KH",
        latitude: null, longitude: null, assignmentContent: "Dispatch" },
    ] },
  }));
  const content = await api.getOutreachContent();
  assert.equal(content.activities.length, 2);
  assert.equal(content.activities[0].latitude, 12.879721);
  assert.equal(content.activities[0].city, null);
  assert.equal(content.activities[1].latitude, null);
  assert.equal(content.missionSectionDescription, loadOutreachModel().OUTREACH_MAP_NOTICE);
});

for (const domain of domains) {
  test(`${domain.api} uses its own endpoint and preserves screen data`, async () => {
    const calls = [];
    const api = loadApi(domain, async (url) => {
      calls.push(url);
      return {
        data: {
          success: true,
          data: [{
            employeeNo: "TEST-SEOUL-01",
            name: "Test name",
            country: "Korea",
            countryCode: "KR",
            city: "Seoul",
            region: "Seoul",
            latitude: 37.5665,
            longitude: 126.9780,
            dispatchedDate: "2020-03-01",
            assignmentContent: "Test assignment",
            groupKey: "KR",
          }],
        },
      };
    });
    const result = await api[domain.method]();
    assert.deepEqual(calls, [domain.endpoint]);
    const [item] = result[domain.collection];
    assert.equal(item.missionaryName, "Test name");
    assert.equal(item.country, "Korea");
    assert.equal(item.sentYear, 2020);
    if (domain.collection === "activities") {
      assert.equal(item.latitude, 37.5665);
      assert.equal(item.longitude, 126.9780);
      assert.equal(item.city, "Seoul");
      assert.equal(item.assignmentContent, "Test assignment");
    } else {
      assert.equal(item.groupKey, "KR");
      assert.equal(item.countryFlag, "KR");
      assert.equal(item.description, "Test assignment");
      assert.equal(result.letters.length, 0);
    }
  });

  test(`${domain.api} accepts an empty list`, async () => {
    const api = loadApi(domain, async () => ({ data: { success: true, data: [] } }));
    const result = await api[domain.method]();
    assert.equal(result[domain.collection].length, 0);
  });

  test(`${domain.api} rejects failures and invalid response shapes`, async () => {
    for (const response of [
      { success: false, message: "Query failed", data: [] },
      { success: true },
      { success: true, message: "OK", data: { missionaries: [] } },
    ]) {
      const api = loadApi(domain, async () => ({ data: response }));
      await assert.rejects(() => api[domain.method]());
    }
    const invalidApi = loadApi(domain, async () => ({
      data: { success: true, message: "OK", data: {} },
    }));
    await assert.rejects(() => invalidApi[domain.method](), (error) => error.message !== "OK");
    const api = loadApi(domain, async () => { throw new Error("Network failed"); });
    await assert.rejects(() => api[domain.method](), /Network failed/);
  });
}

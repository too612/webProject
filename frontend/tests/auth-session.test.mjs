import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function load(path, dependencies = {}, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8")
    .replace("import.meta.env.VITE_API_BASE_URL", "undefined");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, Error, ...globals,
    require: (name) => {
      if (name in dependencies) return dependencies[name];
      if (name === "axios" || name === "zustand") return require(name);
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return exports;
}

function setup() {
  const globals = { sessionStorage: storage(), localStorage: storage() };
  const store = load("../src/common/auth/authStore.ts", {}, globals);
  const client = load("../src/common/api/api.client.ts", { "../auth/authStore": store }, globals).default;
  return { ...globals, store: store.useAuthStore, client };
}

const user = { userId: "test-user" };
const apiError = load("../src/common/api/apiError.ts");

test("late HTTP and envelope 401 cannot erase a newer login", async () => {
  for (const httpError of [true, false]) {
    const { store, client } = setup();
    store.getState().setAuth(user);
    let finish;
    let started;
    const ready = new Promise((resolve) => { started = resolve; });
    const pending = client.get("/probe", {
      adapter: (config) => new Promise((resolve, reject) => {
        finish = () => {
          const response = { config, status: httpError ? 401 : 200, data: { statusCode: 401 } };
          if (httpError) reject(new (require("axios").AxiosError)("Unauthorized", undefined, config, undefined, response));
          else resolve(response);
        };
        started();
      }),
    }).catch(() => null);
    await ready;
    store.getState().setAuth(user);
    const revision = store.getState().authRevision;
    finish();
    await pending;
    assert.equal(store.getState().isAuthenticated, true);
    assert.equal(store.getState().authRevision, revision);
  }
});

test("current request 401 clears auth, but login credential failure does not", async () => {
  for (const url of ["/probe", "/auth/login"]) {
    const { store, client } = setup();
    store.getState().setAuth(user);
    await assert.rejects(client.post(url, {}, {
      adapter: async (config) => {
        throw new (require("axios").AxiosError)("Unauthorized", undefined, config, undefined, { status: 401 });
      },
    }));
    assert.equal(store.getState().isAuthenticated, url === "/auth/login");
  }
});

test("session-only login removes a legacy bearer token and guards stale session checks", () => {
  const { store, localStorage, sessionStorage } = setup();
  store.getState().setAuth(user, "legacy-token");
  const oldRevision = store.getState().authRevision;
  store.getState().setAuth(user);
  store.getState().clearAuth(oldRevision);
  assert.equal(store.getState().isAuthenticated, true);
  assert.equal(localStorage.getItem("authToken"), null);
  assert.equal(JSON.parse(sessionStorage.getItem("authStore")).isAuthenticated, true);
  store.getState().clearAuth(store.getState().authRevision);
  assert.equal(store.getState().isAuthenticated, false);
});

function authApi(get) {
  return load("../src/common/auth/authApi.ts", {
    "../../common/api/api.client": { default: { get } },
    "../api/apiError": apiError,
  }).authApi;
}

test("session check distinguishes authenticated, expired, and failed checks", async () => {
  for (const authenticated of [true, false]) {
    assert.equal(await authApi(async () => ({
      data: { success: true, statusCode: 200, data: { authenticated } },
    })).checkSession(), authenticated);
  }
  assert.equal(await authApi(async () => { throw { response: { status: 401 } }; }).checkSession(), false);
  assert.equal(await authApi(async () => ({ data: { statusCode: 401 } })).checkSession(), false);
  for (const data of [
    { success: true, data: {} },
    { success: true, data: { authenticated: "false" } },
    { success: false, data: { authenticated: false } },
  ]) {
    await assert.rejects(authApi(async () => ({ data })).checkSession(), /응답/);
  }
  await assert.rejects(authApi(async () => { throw new Error("Network failed"); }).checkSession(), /Network failed/);
  await assert.rejects(authApi(async () => {
    throw { response: { status: 503, data: { message: "Service unavailable" } } };
  }).checkSession(), /Service unavailable/);
});

test("login API rejects a failure envelope even when it contains user data", async () => {
  const api = load("../src/common/auth/login/loginApi.ts", {
    "../../api/api.client": { default: { post: async () => ({ data: { success: false, data: user } }) } },
    "../../api/apiError": apiError,
  }).loginApi;
  await assert.rejects(api.login({ username: "test-user", password: "test" }), /응답/);
});

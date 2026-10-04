import { defineConfig } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.ERP_TEST_PORT ?? 5187);
const baseURL = `http://127.0.0.1:${port}`;
const outputDir = process.env.ERP_TEST_OUTPUT ?? join(tmpdir(), `webproject-erp-playwright-${process.pid}`);
process.env.ERP_TEST_OUTPUT = outputDir;

export default defineConfig({
  testDir: ".",
  testMatch: "manager.ui.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  outputDir,
  use: {
    baseURL,
    viewport: { width: 1680, height: 1050 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/ui-server.mjs",
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    url: baseURL,
    reuseExistingServer: false,
  },
});

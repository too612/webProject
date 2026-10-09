import { defineConfig } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.ERP_TEST_PORT ?? 5187);

export default defineConfig({
  testDir: ".",
  testMatch: "official-popup.ui.spec.ts",
  workers: 1,
  reporter: "list",
  outputDir: join(tmpdir(), `webproject-popup-playwright-${process.pid}`),
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: "node tests/ui-server.mjs",
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});

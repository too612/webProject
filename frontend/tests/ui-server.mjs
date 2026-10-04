import { createServer } from "vite";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = Number(process.env.ERP_TEST_PORT ?? 5187);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("ERP_TEST_PORT must be an integer between 1 and 65535.");
}
const cacheDir = await mkdtemp(join(tmpdir(), "webproject-erp-ui-"));
const server = await createServer({
  cacheDir,
  server: { host: "127.0.0.1", port, strictPort: true, hmr: false },
});
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await server.close();
  await rm(cacheDir, { recursive: true });
}
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    close().then(() => process.exit(0)).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  });
}
try {
  await server.listen();
  server.printUrls();
} catch (error) {
  await close();
  throw error;
}

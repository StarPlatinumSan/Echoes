import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await copyFile("worker/sites-worker.js", "dist/server/index.js");

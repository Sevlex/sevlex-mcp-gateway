#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliTsPath = path.resolve(__dirname, "../src/cli.ts");

const child = spawn("npx", ["tsx", cliTsPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

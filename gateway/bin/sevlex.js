#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliTsPath = path.resolve(__dirname, "../src/cli.ts");

import fs from "node:fs";

let tsxCli = path.resolve(__dirname, "../node_modules/tsx/dist/cli.mjs");
if (!fs.existsSync(tsxCli)) {
  tsxCli = path.resolve(__dirname, "../../node_modules/tsx/dist/cli.mjs");
}
const child = spawn(process.execPath, [tsxCli, cliTsPath, ...process.argv.slice(2)], {
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

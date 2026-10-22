#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distCli = path.resolve(__dirname, "../dist/cli.js");

if (fs.existsSync(distCli)) {
  await import(pathToFileURL(distCli).href);
} else {
  // If running directly from git source before compilation
  const srcCli = path.resolve(__dirname, "../src/cli.ts");
  if (fs.existsSync(srcCli)) {
    const { execSync } = await import("node:child_process");
    execSync("npm run build", { cwd: path.resolve(__dirname, ".."), stdio: "inherit" });
    await import(pathToFileURL(distCli).href);
  } else {
    console.error("❌ Fatal: Sevlex binary could not find dist/cli.js.");
    process.exit(1);
  }
}

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ==============================================================================
// SEVLEX DEVELOPER CLI - USER CONFIGURATION STORE (~/.sevlex/config.json)
// ==============================================================================

export interface SevlexUserConfig {
  apiKey?: string | undefined;
  endpoint: string;
  orgId?: string | undefined;
  orgName?: string | undefined;
  lastSyncedAt?: string | undefined;
}

export const DEFAULT_ENDPOINT = process.env.SEVLEX_ENDPOINT || "https://app.sevlex.com";

export function getConfigDir(): string {
  const dir = path.join(os.homedir(), ".sevlex");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getConfigFilePath(): string {
  return path.join(getConfigDir(), "config.json");
}

export function getUserConfig(): SevlexUserConfig {
  const file = getConfigFilePath();
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, "utf-8"));
      return {
        endpoint: data.endpoint || DEFAULT_ENDPOINT,
        apiKey: data.apiKey || process.env.SEVLEX_API_KEY,
        orgId: data.orgId,
        orgName: data.orgName,
        lastSyncedAt: data.lastSyncedAt,
      };
    } catch {}
  }
  return {
    endpoint: DEFAULT_ENDPOINT,
    apiKey: process.env.SEVLEX_API_KEY,
  };
}

export function saveUserConfig(update: Partial<SevlexUserConfig>): SevlexUserConfig {
  const current = getUserConfig();
  const merged: SevlexUserConfig = {
    ...current,
    ...update,
    endpoint: update.endpoint || current.endpoint || DEFAULT_ENDPOINT,
  };
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

export function clearUserConfig(): void {
  const file = getConfigFilePath();
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
    } catch {}
  }
}

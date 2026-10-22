import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

// 1. Define the exact shape our config file MUST match.
// This prevents silent failures. If the user typos "blocked_tools", the app will refuse to start.
const ConfigSchema = z.object({
  version: z.string(),
  policy: z.object({
    defaultAction: z.enum(["ALLOW", "DENY"]),
    blockedTools: z.array(z.string()),
    approvalRequiredTools: z.array(z.string()).default([]),
    parameterRules: z.object({
      enabled: z.boolean().default(true),
      customRules: z.array(
        z.object({
          id: z.string(),
          pattern: z.string(),
          action: z.enum(["BLOCK", "REQUIRE_APPROVAL"]).default("BLOCK"),
          severity: z.enum(["CRITICAL", "HIGH", "MEDIUM"]).default("HIGH"),
          reason: z.string(),
        })
      ).default([]),
    }).optional(),
    dlp: z.object({
      enabled: z.boolean().default(true),
    }).optional(),
    siem: z.object({
      enabled: z.boolean().default(false),
      provider: z.enum(["datadog", "splunk", "webhook"]).default("webhook"),
      endpoint: z.string().optional(),
      apiKey: z.string().optional(),
    }).optional(),
  }),
});

export type SevlexConfig = z.infer<typeof ConfigSchema>;

/**
 * Loads and strictly validates the sevlex.json configuration file.
 * We follow the "Fail Fast" principle: if the security config is broken,
 * we crash immediately rather than running an insecure proxy.
 */
export function loadConfig(configPath: string): SevlexConfig {
  try {
    const rawData = fs.readFileSync(path.resolve(configPath), "utf-8");
    const parsedData = JSON.parse(rawData);
    
    // Zod will throw a detailed error if the JSON does not match the schema
    const validatedConfig = ConfigSchema.parse(parsedData);
    
    return validatedConfig;
  } catch (error) {
    console.error("❌ CRITICAL ERROR: Failed to load or validate sevlex.json");
    if (error instanceof z.ZodError) {
      console.error("Configuration schema violations:", JSON.stringify((error as any).issues || (error as any).errors, null, 2));
    } else {
      console.error(error);
    }
    process.exit(1); // Force immediate exit. Never run an insecure gateway.
  }
}

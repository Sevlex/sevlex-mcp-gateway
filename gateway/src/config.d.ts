import { z } from "zod";
declare const ConfigSchema: z.ZodObject<{
    version: z.ZodString;
    policy: z.ZodObject<{
        defaultAction: z.ZodEnum<{
            ALLOW: "ALLOW";
            DENY: "DENY";
        }>;
        blockedTools: z.ZodArray<z.ZodString>;
        approvalRequiredTools: z.ZodDefault<z.ZodArray<z.ZodString>>;
        parameterRules: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        dlp: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        siem: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            provider: z.ZodDefault<z.ZodEnum<{
                datadog: "datadog";
                splunk: "splunk";
                webhook: "webhook";
            }>>;
            endpoint: z.ZodOptional<z.ZodString>;
            apiKey: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SevlexConfig = z.infer<typeof ConfigSchema>;
/**
 * Loads and strictly validates the sevlex.json configuration file.
 * We follow the "Fail Fast" principle: if the security config is broken,
 * we crash immediately rather than running an insecure proxy.
 */
export declare function loadConfig(configPath: string): SevlexConfig;
export {};
//# sourceMappingURL=config.d.ts.map
// ============================================================================
// SEVLEX TOOLGUARD™ ENGINE (Deep Parameter Inspection & Real-Time Output DLP)
// Protects against SQL injections, destructive OS commands, secret leaks & PII.
// ============================================================================

export interface ParameterViolation {
  ruleId: string;
  category: "DESTRUCTIVE_SQL" | "COMMAND_INJECTION" | "PATH_TRAVERSAL" | "RCE_ATTEMPT" | "CODE_HAZARD";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  reason: string;
  sample: string;
}

export interface ParameterInspectionResult {
  passed: boolean;
  violation?: ParameterViolation;
}

// Enterprise Rule Definitions for Inbound Tool Arguments
const PARAMETER_RULES = [
  {
    ruleId: "DESTRUCTIVE_SQL",
    category: "DESTRUCTIVE_SQL" as const,
    severity: "CRITICAL" as const,
    reason: "Destructive database operation (DROP/TRUNCATE/ALTER/UNRESTRICTED DELETE)",
    pattern: /\b(DROP\s+TABLE|DROP\s+DATABASE|TRUNCATE\s+TABLE|ALTER\s+TABLE|DELETE\s+FROM\s+["`\w]+\s*(?:;|\s*$))/i
  },
  {
    ruleId: "DESTRUCTIVE_SHELL",
    category: "COMMAND_INJECTION" as const,
    severity: "CRITICAL" as const,
    reason: "Destructive filesystem operation (rm -rf, mkfs, dd, fork bomb)",
    pattern: /(?:rm\s+-(?:[a-zA-Z]*r[a-zA-Z]*f|[a-zA-Z]*f[a-zA-Z]*r)\s+[\/\*~]|mkfs(?:\.[\w]+)?\s+|dd\s+if=|\:(){ :\|:& };:)/i
  },
  {
    ruleId: "SENSITIVE_FILE_ACCESS",
    category: "PATH_TRAVERSAL" as const,
    severity: "CRITICAL" as const,
    reason: "Access to private credentials or system files (/etc/shadow, ~/.ssh, ~/.aws, .env)",
    pattern: /(?:\/etc\/shadow|\/etc\/passwd|~\/\.ssh(?:\/.*)?|\.ssh\/id_(?:rsa|ed25519)|~\/\.aws(?:\/.*)?|\.aws\/credentials|\.env(?:production|\.local|\.vault)?\b)/i
  },
  {
    ruleId: "MALICIOUS_SHELL_PIPE",
    category: "RCE_ATTEMPT" as const,
    severity: "CRITICAL" as const,
    reason: "Remote code execution via unverified pipe to shell (curl/wget | bash)",
    pattern: /(?:curl|wget)\s+[^|;]+?\|\s*(?:ba|z)?sh\b|nc\s+(?:-[a-zA-Z]*e\s+)?\/bin\/(?:ba)?sh/i
  },
  // 🛡️ CodeGuard™: Defenses for Cloudflare Code Mode & Dynamic Code-as-a-Tool
  {
    ruleId: "MASS_DELETION_LOOP",
    category: "CODE_HAZARD" as const,
    severity: "CRITICAL" as const,
    reason: "CodeGuard: Unbounded mass-deletion or mutation loop in dynamic code payload",
    pattern: /(?:\.forEach|\.map|for\s*\([^)]+\)|while\s*\([^)]+\))\s*\{?[^}]*?\b(?:delete|destroy|drop|purge|truncate)\s*\(/i
  },
  {
    ruleId: "CREDENTIAL_HARVESTING",
    category: "CODE_HAZARD" as const,
    severity: "CRITICAL" as const,
    reason: "CodeGuard: Unauthorized credential/environment harvesting in script (process.env / Deno.env)",
    pattern: /\b(?:process\.env|Deno\.env|Bun\.env|globalThis\.__env)\b/i
  },
  {
    ruleId: "UNAUTHORIZED_CODE_EGRESS",
    category: "CODE_HAZARD" as const,
    severity: "HIGH" as const,
    reason: "CodeGuard: Unauthorized external network exfiltration or SSRF in dynamic code",
    pattern: /\b(?:fetch|axios|https?\.request|WebSocket)\s*\(\s*['"`]https?:\/\/(?!localhost|127\.0\.0\.1)/i
  }
];

// Enterprise DLP Rules for Outbound Tool Results
export interface DlpRule {
  id: string;
  name: string;
  pattern: RegExp;
}

export const DLP_RULES: DlpRule[] = [
  {
    id: "AWS_ACCESS_KEY",
    name: "AWS Access Key",
    pattern: /\b(AKIA[0-9A-Z]{16})\b/g
  },
  {
    id: "PRIVATE_KEY",
    name: "Private Key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g
  },
  {
    id: "GITHUB_TOKEN",
    name: "GitHub Token",
    pattern: /\b(gh[pousr]_[A-Za-z0-9_]{36,255})\b/g
  },
  {
    id: "OPENAI_KEY",
    name: "OpenAI API Key",
    pattern: /\b(sk-[a-zA-Z0-9T3BlbkFJ]{20,})\b/g
  },
  {
    id: "STRIPE_KEY",
    name: "Stripe Secret Key",
    pattern: /\b(sk_(?:live|test)_[0-9a-zA-Z]{24,})\b/g
  },
  {
    id: "SLACK_TOKEN",
    name: "Slack OAuth Token",
    pattern: /\b(xox[baprs]-[0-9a-zA-Z]{10,48})\b/g
  },
  {
    id: "US_SSN",
    name: "US Social Security Number",
    pattern: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g
  },
  {
    id: "JWT_TOKEN",
    name: "JSON Web Token (JWT)",
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g
  }
];

/**
 * Recursively extracts all string arguments from a tool's parameters payload.
 */
function extractStrings(obj: any): string[] {
  if (obj === null || obj === undefined) return [];
  if (typeof obj === "string") return [obj];
  if (typeof obj === "number" || typeof obj === "boolean") return [];
  if (Array.isArray(obj)) {
    return obj.flatMap(item => extractStrings(item));
  }
  if (typeof obj === "object") {
    return Object.values(obj).flatMap(val => extractStrings(val));
  }
  return [];
}

/**
 * ToolGuard Call Guard:
 * Deeply inspects incoming tool call parameters to prevent payload bypasses
 * (e.g. calling `execute_sql` with `DROP TABLE` or `bash` with `rm -rf /`).
 */
export function inspectToolParameters(toolName: string, args: any): ParameterInspectionResult {
  const strings = extractStrings(args);
  
  for (const str of strings) {
    if (!str || typeof str !== "string") continue;
    
    for (const rule of PARAMETER_RULES) {
      if (rule.pattern.test(str)) {
        return {
          passed: false,
          violation: {
            ruleId: rule.ruleId,
            category: rule.category,
            severity: rule.severity,
            reason: rule.reason,
            sample: str.length > 80 ? str.slice(0, 77) + "..." : str
          }
        };
      }
    }
  }

  return { passed: true };
}

/**
 * ToolGuard Output Guard:
 * Scans tool responses (stdout/result) for credentials, private keys, and PII.
 * Redacts matches in-flight before forwarding to the AI context.
 */
export function redactToolOutputDlp(text: string): { sanitized: string; redactionCount: number; redactedTypes: string[] } {
  let sanitized = text;
  let totalCount = 0;
  const foundTypes = new Set<string>();

  for (const rule of DLP_RULES) {
    const matches = sanitized.match(rule.pattern);
    if (matches && matches.length > 0) {
      totalCount += matches.length;
      foundTypes.add(rule.name);
      sanitized = sanitized.replace(rule.pattern, `[REDACTED_BY_SEVLEX: ${rule.name}]`);
    }
  }

  return {
    sanitized,
    redactionCount: totalCount,
    redactedTypes: Array.from(foundTypes)
  };
}

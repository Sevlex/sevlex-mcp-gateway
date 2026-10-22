// ============================================================================
// SEVLEX TOOLGUARD™ ENGINE (Deep Parameter Inspection & Real-Time Output DLP)
// Protects against SQL injections, destructive OS commands, secret leaks & PII.
// ============================================================================

export interface ParameterViolation {
  ruleId: string;
  category: "DESTRUCTIVE_SQL" | "COMMAND_INJECTION" | "PATH_TRAVERSAL" | "RCE_ATTEMPT" | "CODE_HAZARD" | "CUSTOM_POLICY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  reason: string;
  sample: string;
  action: "BLOCK" | "REQUIRE_APPROVAL";
}

export interface ParameterInspectionResult {
  passed: boolean;
  action?: "BLOCK" | "REQUIRE_APPROVAL";
  violation?: ParameterViolation;
}

export interface CustomParameterRule {
  id: string;
  pattern: string;
  action?: "BLOCK" | "REQUIRE_APPROVAL";
  severity?: "CRITICAL" | "HIGH" | "MEDIUM";
  reason: string;
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
 * Multi-Stage De-obfuscation & AST Normalization Engine:
 * Defeats evasion tactics used to bypass naive regex:
 * 1. Base64 payload encoding (e.g. echo cm0g... | base64 -d)
 * 2. Hex / URL escape encoding (\x72\x6d, %72%6d)
 * 3. Shell quote and slash interleaving (r""m, r''m, r\m, $IFS)
 * 4. SQL comment interleaving (e.g. DROP / * * / TABLE)
 * 5. Dynamic JavaScript property concatenation ("pro" + "cess")
 */
export function generateNormalizedVariations(raw: string): string[] {
  const variations: string[] = [raw];

  // 1. URL Decode
  if (raw.includes("%")) {
    try {
      const urlDecoded = decodeURIComponent(raw);
      if (urlDecoded !== raw) variations.push(urlDecoded);
    } catch {}
  }

  // 2. Hex escape decode (\x.. and \0..)
  if (/\\x[0-9a-fA-F]{2}/.test(raw)) {
    try {
      const hexDecoded = raw.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      variations.push(hexDecoded);
    } catch {}
  }

  // 3. Shell quote and slash stripping: r""m -> rm, r''m -> rm, r\m -> rm, ${IFS} -> space
  const shellUnquoted = raw
    .replace(/["']{2}/g, "") // remove empty quotes
    .replace(/([a-zA-Z0-9])["']([a-zA-Z0-9])/g, "$1$2") // remove quotes within tokens
    .replace(/\\([a-zA-Z0-9_/\-])/g, "$1") // remove escape slashes
    .replace(/\$\{IFS\}|\$IFS/g, " "); // replace bash IFS with space
  if (shellUnquoted !== raw) {
    variations.push(shellUnquoted);
  }

  // 4. SQL comment normalization: DROP/**/TABLE -> DROP TABLE
  if (raw.includes("/*")) {
    const sqlNormalized = raw.replace(/\/\*[\s\S]*?\*\//g, " ");
    variations.push(sqlNormalized);
  }

  // 5. JavaScript / TypeScript bracket string concatenation & bracket property access:
  // "pro" + "cess" -> "process"
  // globalThis["process"]["env"] -> globalThis.process.env
  let jsNormalized = raw;
  if (raw.includes("+")) {
    jsNormalized = jsNormalized.replace(/["']\s*\+\s*["']/g, "");
    if (jsNormalized !== raw) {
      variations.push(jsNormalized);
    }
  }
  if (/\[\s*["'][a-zA-Z0-9_$]+["']\s*\]/.test(jsNormalized)) {
    const jsBracketNormalized = jsNormalized.replace(/\[\s*["']([a-zA-Z0-9_$]+)["']\s*\]/g, ".$1");
    if (jsBracketNormalized !== jsNormalized) {
      variations.push(jsBracketNormalized);
    }
  }

  // 6. Base64 payload detection and recursive decoding
  const base64Regex = /\b([A-Za-z0-9+/]{8,}={0,2})\b/g;
  let match;
  while ((match = base64Regex.exec(raw)) !== null) {
    if (!match[1]) continue;
    try {
      const decoded = Buffer.from(match[1], "base64").toString("utf-8");
      // Check if decoded is printable text
      if (/^[\x20-\x7E\r\n\t]+$/.test(decoded)) {
        variations.push(decoded);
        // Also add de-quoted variation of the decoded string
        variations.push(decoded.replace(/["']{2}/g, "").replace(/\\([a-zA-Z])/g, "$1").replace(/\$\{IFS\}|\$IFS/g, " "));
      }
    } catch {}
  }

  return Array.from(new Set(variations));
}

/**
 * ToolGuard Call Guard:
 * Deeply inspects incoming tool call parameters across normalized variations
 * to prevent payload bypasses and obfuscation evasion.
 */
export function inspectToolParameters(
  toolName: string,
  args: any,
  customRules?: CustomParameterRule[]
): ParameterInspectionResult {
  const strings = extractStrings(args);
  
  for (const str of strings) {
    if (!str || typeof str !== "string") continue;
    
    const variations = generateNormalizedVariations(str);
    for (const variant of variations) {
      // 1. Check Hardcoded Baseline Security Rules (Always BLOCK)
      for (const rule of PARAMETER_RULES) {
        if (rule.pattern.test(variant)) {
          const isDeobfuscated = variant !== str;
          return {
            passed: false,
            action: "BLOCK",
            violation: {
              ruleId: rule.ruleId,
              category: rule.category,
              severity: rule.severity,
              action: "BLOCK",
              reason: isDeobfuscated 
                ? `${rule.reason} [DE-OBFUSCATION EVASION DETECTED]` 
                : rule.reason,
              sample: str.length > 80 ? str.slice(0, 77) + "..." : str
            }
          };
        }
      }

      // 2. Check Custom Parameter Rules (Configurable BLOCK or REQUIRE_APPROVAL)
      if (customRules && customRules.length > 0) {
        for (const custom of customRules) {
          try {
            const regex = new RegExp(custom.pattern, "i");
            if (regex.test(variant)) {
              const ruleAction = custom.action || "BLOCK";
              const isDeobfuscated = variant !== str;
              return {
                passed: false,
                action: ruleAction,
                violation: {
                  ruleId: custom.id,
                  category: "CUSTOM_POLICY",
                  severity: custom.severity || "HIGH",
                  action: ruleAction,
                  reason: isDeobfuscated
                    ? `${custom.reason} [DE-OBFUSCATION EVASION DETECTED]`
                    : custom.reason,
                  sample: str.length > 80 ? str.slice(0, 77) + "..." : str
                }
              };
            }
          } catch {}
        }
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

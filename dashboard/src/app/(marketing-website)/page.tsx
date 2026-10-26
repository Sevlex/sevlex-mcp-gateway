"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Zap,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Cpu,
  Eye,
  Activity,
  Sparkles,
  Server,
  Layers,
  FileCheck2,
  Bell,
  Code2,
  ChevronRight,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Database,
  Radio,
  Flame,
  AlertTriangle,
  Play,
  RotateCcw,
  Bot,
  Braces,
  FileCode,
  Hash,
  Network,
  GitBranch,
  Sun,
  Moon,
} from "lucide-react";
import ClientBrandIcon, { getLogoDevUrl } from "@/app/components/ClientBrandIcon";
import EngineBentoGrid from "@/app/components/EngineBentoGrid";
import ArchitectureMotionConduit from "@/app/components/ArchitectureMotionConduit";
import { useTheme } from "@/app/components/ThemeProvider";

// Interactive Spotlight Card with subtle radial hover
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(52, 213, 154, 0.08)",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  id?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E1014] p-6 shadow-xl transition-all duration-300 hover:border-white/[0.18] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Attack Simulation Scenarios
type AttackScenario = "sql" | "env" | "loop" | "safe";

interface ScenarioData {
  id: AttackScenario;
  title: string;
  badge: string;
  badgeColor: string;
  client: string;
  clientBrand: string;
  server: string;
  tool: string;
  rpcId: string;
  payload: string;
  responsePayload: string;
  decision: "BLOCKED" | "ALLOWED" | "CIRCUIT_BROKEN";
  latency: string;
  ruleViolated: string;
  explanation: string;
  astAnalysis: {
    statementType: string;
    targetEntity: string;
    riskScore: string;
    astTreeVisual: string;
    enforcementAction: string;
  };
  merkleReceipt: {
    receiptId: string;
    blockIndex: number;
    prevHash: string;
    entryHash: string;
    merkleRoot: string;
    actor: string;
    status: string;
  };
  slackAlert: {
    channel: string;
    level: "CRITICAL" | "HIGH" | "INFO";
    title: string;
    details: string;
  };
}

const SCENARIOS: Record<AttackScenario, ScenarioData> = {
  sql: {
    id: "sql",
    title: "Destructive DROP TABLE",
    badge: "CRITICAL ATTACK",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    client: "Cursor IDE (Agent Mode)",
    clientBrand: "cursor",
    server: "postgres_server",
    tool: "postgres_server:execute_query",
    rpcId: "rpc-9142",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-9142",
        method: "tools/call",
        params: {
          name: "execute_query",
          arguments: {
            query: "DROP TABLE production_users CASCADE;",
          },
        },
      },
      null,
      2
    ),
    responsePayload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-9142",
        error: {
          code: -32600,
          message: "ToolGuard™ AST Violation: Destructive statement 'DropTableStatement' prohibited by organization policy.",
          data: {
            rule: "RULE_AST_NO_DDL",
            intercept_time_ms: 0.42,
            quarantine_id: "quar_89a1f2",
            downstream_wire_bytes: 0,
            status: "ARRESTED_IN_FLIGHT",
          },
        },
      },
      null,
      2
    ),
    decision: "BLOCKED",
    latency: "0.42ms",
    ruleViolated: "ToolGuard™ AST DDL Block: DropTableStatement Detected",
    explanation:
      "Sevlex Layer 7 DPI parsed the SQL AST in-flight before transmission to Postgres. The query was dropped with zero database impact.",
    astAnalysis: {
      statementType: "DropTableStatement (DDL)",
      targetEntity: "public.production_users",
      riskScore: "10.0 / 10.0 [P0_CRITICAL]",
      astTreeVisual: `├── AST_ROOT [Stmt]
│   └── DropTableStmt
│       ├── target: "production_users"
│       ├── cascade: true
│       └── policy_match: BLOCKED [P0_CRITICAL]
└── ACTION: Intercept wire stdio, synthesize JSON-RPC Error -32600 (0 bytes sent to DB)`,
      enforcementAction: "Packet arrested in 0.42ms. Zero wire bytes transmitted to downstream Postgres server.",
    },
    merkleReceipt: {
      receiptId: "rcpt_merkle_98124",
      blockIndex: 142394,
      prevHash: "7c8e2b9f01a34d58e99a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
      entryHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      merkleRoot: "9a4f210d7c3b...e21a",
      actor: "@meetp (Staff Eng)",
      status: "SEALED (Cryptographically Verified)",
    },
    slackAlert: {
      channel: "#mcp-security-alerts",
      level: "CRITICAL",
      title: "🚨 P0 Security Intercept: Destructive DDL Operation Arrested",
      details:
        "Agent attempted DROP TABLE production_users from developer host (meetp). Call dropped in 0.42ms. Zero data altered.",
    },
  },
  env: {
    id: "env",
    title: "Credential Exfiltration",
    badge: "HIGH RISK",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    client: "Claude Desktop",
    clientBrand: "claude",
    server: "filesystem_server",
    tool: "filesystem:read_file",
    rpcId: "rpc-4109",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-4109",
        method: "tools/call",
        params: {
          name: "read_file",
          arguments: {
            path: "/Users/developer/.aws/credentials",
          },
        },
      },
      null,
      2
    ),
    responsePayload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-4109",
        error: {
          code: -32001,
          message: "ToolGuard™ Quarantine Exception: Access to private cloud credential path denied.",
          data: {
            rule: "RULE_DLP_CREDENTIAL_ISOLATION",
            intercept_time_ms: 0.38,
            quarantine_id: "quar_44b1c7",
            downstream_wire_bytes: 0,
            status: "STDIO_PIPE_REFUSED",
          },
        },
      },
      null,
      2
    ),
    decision: "BLOCKED",
    latency: "0.38ms",
    ruleViolated: "ToolGuard™ Private Credential Access Policy",
    explanation:
      "Access to private cloud credentials and .env paths is strictly quarantined. The gateway refused the stdio pipe request.",
    astAnalysis: {
      statementType: "PathTraversalSecurityCheck",
      targetEntity: "~/.aws/credentials",
      riskScore: "9.8 / 10.0 [EXFILTRATION]",
      astTreeVisual: `├── PATH_INSPECTOR
│   └── FileTarget: "/Users/developer/.aws/credentials"
│       ├── path_normalized: "~/.aws/credentials"
│       ├── classification: SENSITIVE_CLOUD_KEYSTORE
│       └── policy_match: QUARANTINE_STDIO_ACCESS
└── ACTION: Drop stdio pipe request, dispatch SecOps webhook, seal audit receipt`,
      enforcementAction: "Exfiltration quarantined in 0.38ms. Absolute filesystem isolation preserved.",
    },
    merkleReceipt: {
      receiptId: "rcpt_merkle_98125",
      blockIndex: 142395,
      prevHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      entryHash: "8f4a19c3b2e7...61a2",
      merkleRoot: "1c3e89a0f4d2...77ab",
      actor: "@meetp (Staff Eng)",
      status: "SEALED (Cryptographically Verified)",
    },
    slackAlert: {
      channel: "#mcp-security-alerts",
      level: "CRITICAL",
      title: "🚨 Sensitive Credential Exfiltration Intercepted",
      details:
        "Autonomous agent attempted to read AWS root credentials. Call blocked. Incident ticket #HITL-8914 created.",
    },
  },
  loop: {
    id: "loop",
    title: "Hallucination Loop Breaker",
    badge: "LOOP BREAKER",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    client: "Windsurf Cascade",
    clientBrand: "windsurf",
    server: "github_server",
    tool: "github:list_issues",
    rpcId: "rpc-8821",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-8821",
        method: "tools/call",
        params: {
          name: "list_issues",
          arguments: {
            repo: "Sevlex/enterprise-monorepo",
            state: "open",
            retry_attempt: 26,
          },
        },
      },
      null,
      2
    ),
    responsePayload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-8821",
        error: {
          code: -32002,
          message: "AgentGuard™ Circuit Breaker: Velocity threshold (25 calls / 30s) exceeded.",
          data: {
            retry_count: 26,
            circuit_state: "TRIPPED_OPEN",
            cooldown_remaining_sec: 59,
            token_cost_prevented: "$4.18",
          },
        },
      },
      null,
      2
    ),
    decision: "CIRCUIT_BROKEN",
    latency: "0.19ms",
    ruleViolated: "AgentGuard™ Velocity Breaker: 25 calls / 30s threshold exceeded",
    explanation:
      "Agent entered a recursive hallucination retry loop. Sevlex tripped the circuit breaker to prevent token bankruptcy and API throttling.",
    astAnalysis: {
      statementType: "VelocityRateLimiter",
      targetEntity: "github:list_issues (infinite loop)",
      riskScore: "8.5 / 10.0 [RUNAWAY_PROCESS]",
      astTreeVisual: `├── CIRCUIT_BREAKER_ENGINE
│   └── SlidingWindowTracker [30s window]
│       ├── call_frequency: 26 calls / 21 seconds
│       ├── error_cascade_detected: true
│       └── trigger: CIRCUIT_BREAKER_TRIPPED
└── ACTION: Enforce 60s cooldown, pause agent stdio channel, halt LLM token drain`,
      enforcementAction: "Circuit breaker tripped in 0.19ms. Halts runaway recursive retry cycle.",
    },
    merkleReceipt: {
      receiptId: "rcpt_merkle_98126",
      blockIndex: 142396,
      prevHash: "8f4a19c3b2e7...61a2",
      entryHash: "3d9e11a4f0b8...99cc",
      merkleRoot: "4b2e88a1c90f...11dd",
      actor: "@meetp (Staff Eng)",
      status: "SEALED (Cryptographically Verified)",
    },
    slackAlert: {
      channel: "#mcp-security-alerts",
      level: "HIGH",
      title: "⚠️ Agent Velocity Exceeded — Circuit Breaker Tripped",
      details:
        "Agent fired 26 repetitive calls in 21s. Execution paused for 60s cooldown to safeguard upstream rate limits.",
    },
  },
  safe: {
    id: "safe",
    title: "Legitimate Read Query",
    badge: "BENIGN TRAFFIC",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    client: "Claude Code / Cursor",
    clientBrand: "cursor",
    server: "postgres_server",
    tool: "postgres_server:execute_query",
    rpcId: "rpc-1049",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-1049",
        method: "tools/call",
        params: {
          name: "execute_query",
          arguments: {
            query: "SELECT id, name, status FROM public_catalog LIMIT 20;",
          },
        },
      },
      null,
      2
    ),
    responsePayload: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: "rpc-1049",
        result: {
          content: [
            {
              type: "text",
              text: '[{"id": 101, "name": "auth-service", "status": "healthy"}, {"id": 102, "name": "payment-gateway", "status": "healthy"}]',
            },
          ],
          isError: false,
          _sevlex_meta: {
            verified_hash: "a1b2c3d4",
            overhead_ms: 0.12,
            dlp_scrubbed: 0,
          },
        },
      },
      null,
      2
    ),
    decision: "ALLOWED",
    latency: "0.12ms",
    ruleViolated: "None — Clean SELECT statement passed parameter inspection",
    explanation:
      "Safe read-only operations pass with sub-millisecond wire overhead (<0.15ms). Developer flow experiences zero disruption.",
    astAnalysis: {
      statementType: "SelectStatement (Read-Only)",
      targetEntity: "public.public_catalog",
      riskScore: "0.0 / 10.0 [BENIGN]",
      astTreeVisual: `├── AST_ROOT [Stmt]
│   └── SelectStmt
│       ├── fields: ["id", "name", "status"]
│       ├── target: "public_catalog"
│       ├── limit: 20
│       └── dlp_scan: PASS (No PII / Credential leak)
└── ACTION: Forwarded directly over stdio pipe with <0.12ms overhead`,
      enforcementAction: "Clean SELECT statement verified in 0.12ms. Wire passed with zero friction.",
    },
    merkleReceipt: {
      receiptId: "rcpt_merkle_98127",
      blockIndex: 142397,
      prevHash: "3d9e11a4f0b8...99cc",
      entryHash: "9b1c44e8a20f...33ee",
      merkleRoot: "7f88a109b4c2...55aa",
      actor: "@meetp (Staff Eng)",
      status: "SEALED (Cryptographically Verified)",
    },
    slackAlert: {
      channel: "#mcp-audit-stream",
      level: "INFO",
      title: "✅ MCP Execution Permitted: public_catalog SELECT",
      details:
        "Audit receipt #4912 logged to SQLite WAL with valid SHA-256 Merkle link. Developer: @meetp.",
    },
  },
};

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [terminalTab, setTerminalTab] = useState<"demo" | "init" | "status" | "verify">("demo");
  const [activeScenario, setActiveScenario] = useState<AttackScenario>("sql");
  const [isSimulating, setIsSimulating] = useState(false);

  const scenario = SCENARIOS[activeScenario];

  const handleTriggerScenario = (sc: AttackScenario) => {
    setActiveScenario(sc);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  const copyInstall = () => {
    navigator.clipboard.writeText("npx sevlex init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDemo = () => {
    navigator.clipboard.writeText("npx sevlex demo");
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  const [simulatorTab, setSimulatorTab] = useState<"request" | "response" | "ast">("request");
  const [dispatchTab, setDispatchTab] = useState<"slack" | "merkle">("slack");
  const [copiedPacket, setCopiedPacket] = useState(false);

  const copyPacket = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPacket(true);
    setTimeout(() => setCopiedPacket(false), 2000);
  };

  return (
    <main className={`min-h-screen font-sans selection:bg-[#34D59A]/30 selection:text-white overflow-x-hidden transition-colors duration-200 ${
      isDark ? "bg-[#000000] text-[#F8FAFC]" : "bg-[#F8FAFC] text-[#090A0F]"
    }`}>
      {/* Precision hairline grid backdrop */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-200 ${
        isDark
          ? "bg-[linear-gradient(to_right,#131415_1px,transparent_1px),linear-gradient(to_bottom,#131415_1px,transparent_1px)] opacity-40 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
          : "bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-35 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_0%,#000_60%,transparent_100%)]"
      }`} />

      {/* Subtle restrained atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.08),transparent_70%)] pointer-events-none" />

      {/* ========================================================================= */}
      {/* NAVIGATION HEADER                                                         */}
      {/* ========================================================================= */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
        isDark ? "bg-[#000000]/85 border-b border-white/[0.08]" : "bg-white/85 border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDark ? "/sevlex-brand-horizontal.png" : "/sevlex-brand-horizontal-dark.png"}
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
              />
            </a>
          </div>

          {/* Desktop Nav Items - Clean 3-Item Architecture: Product, Service, About */}
          <div className={`hidden md:flex items-center gap-8 text-xs font-medium ${
            isDark ? "text-[#94979E]" : "text-[#6B7280]"
          }`}>
            <a href="/product" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              Product
            </a>
            <a href="/service" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              Service
            </a>
            <a href="/about" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              About
            </a>
            <a href="/docs" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              Docs
            </a>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Sun / Moon */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label="Toggle Theme"
              className={`p-2 rounded-full border transition-colors ${
                isDark
                  ? "border-white/[0.08] bg-[#141518] text-gray-300 hover:text-white hover:border-[#383A42]"
                  : "border-[#E5E7EB] bg-[#F9FAFB] text-gray-700 hover:text-gray-900 hover:border-gray-300 shadow-xs"
              }`}
            >
              {isDark ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-slate-700" />
              )}
            </button>

            {/* GitHub Stars Button */}
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className={`hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-full border text-xs font-medium transition duration-200 ${
                isDark
                  ? "border-white/[0.08] bg-white/[0.02] text-[#C9CBCF] hover:border-white hover:text-white"
                  : "border-[#E5E7EB] bg-black/[0.02] text-[#4B5563] hover:border-black hover:text-black"
              }`}
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
              <span className={isDark ? "text-[#61646B]" : "text-[#9CA3AF]"}>•</span>
              <span className={`font-mono text-[11px] ${isDark ? "text-[#AFB1B6]" : "text-[#4B5563]"}`}>★ 1.8k</span>
            </a>

            {/* Sign in with GitHub Pill */}
            <a
              href="/api/auth/github"
              className={`hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full border text-xs font-medium transition duration-200 ${
                isDark
                  ? "border-white/[0.08] bg-[#16181F] hover:bg-white/[0.08] text-white"
                  : "border-[#E5E7EB] bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-900"
              }`}
            >
              <svg className={`size-3.5 ${isDark ? "fill-white" : "fill-gray-900"}`} viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Sign in</span>
            </a>

            {/* Primary Console Pill */}
            <a
              href="/console"
              className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium transition duration-200 ${
                isDark
                  ? "bg-white text-black hover:bg-[#E4E5E7]"
                  : "bg-black text-white hover:bg-gray-800 shadow-sm"
              }`}
            >
              <span>Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Neon Aesthetic & High-Craft Typography)                  */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow Pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-6 ${
            isDark
              ? "bg-[#14161C] border border-white/[0.08] text-[#797D86]"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 shadow-xs"
          }`}>
            <span className="text-[#34D59A] font-semibold">LAYER 7 ZERO-TRUST</span>
            <span className={isDark ? "text-[#303236]" : "text-emerald-300"}>•</span>
            <span className={isDark ? "text-[#AFB1B6]" : "text-emerald-700"}>FIREWALL FOR MODEL CONTEXT PROTOCOL</span>
          </div>

          {/* Master Display Heading */}
          <h1 className={`text-4xl sm:text-6xl md:text-[4.25rem] font-medium tracking-tight max-w-4xl mx-auto leading-[1.06] text-balance ${
            isDark ? "text-white" : "text-[#0F172A]"
          }`}>
            The security layer for coding agents. Intercept, inspect, and quarantine MCP tools in real time.
          </h1>

          {/* Master Subtitle */}
          <p className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-pretty ${
            isDark ? "text-[#94979E]" : "text-[#475569]"
          }`}>
            Transparently wraps stdio and SSE JSON-RPC channels between Cursor, Claude Desktop, and downstream servers.
            Zero configuration, sub-0.5ms parameter deep packet inspection, and cryptographic audit proofs.
          </p>

          {/* Primary Action CTAs - Clean 2-Button Architecture */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary Console Pill */}
            <a
              href="/console"
              className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium text-sm gap-2 shadow-md ${
                isDark
                  ? "bg-white text-black hover:bg-[#E4E5E7] shadow-white/5"
                  : "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-slate-900/10"
              }`}
            >
              <span>Launch Console</span>
              <ArrowRight className="size-4" />
            </a>

            {/* Glass Docs Pill */}
            <a
              href="/docs"
              className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium text-sm gap-2 ${
                isDark
                  ? "bg-white/[0.03] border border-white/[0.12] text-white hover:border-[#61646B] hover:bg-white/[0.06]"
                  : "bg-white border border-[#CBD5E1] text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-xs"
              }`}
            >
              <span>Documentation</span>
              <ArrowRight className={`size-3.5 ${isDark ? "text-[#797D86]" : "text-[#64748B]"}`} />
            </a>
          </div>

          {/* Quickstart Install Pill in Hero */}
          <div className="mt-6 flex items-center justify-center">
            <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 border transition-all ${
              isDark
                ? "bg-[#0A0C10] border-white/[0.08] text-[#AFB1B6] hover:border-white/[0.16]"
                : "bg-white border-slate-200 text-slate-700 shadow-xs hover:border-slate-300"
            }`}>
              <span className="text-[#34D59A] font-mono text-xs font-semibold">$</span>
              <code className={`text-xs font-mono font-medium ${isDark ? "text-white" : "text-slate-900"}`}>npx sevlex init</code>
              <button
                onClick={copyInstall}
                className={`p-1 transition cursor-pointer ${isDark ? "text-[#797D86] hover:text-white" : "text-slate-400 hover:text-slate-800"}`}
                title="Copy install command"
              >
                {copied ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          </div>

          {/* Client Ecosystem Showcase (100% borderless, transparent, seamless) */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#797D86]">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isDark ? "text-[#61646B]" : "text-[#64748B]"}`}>
              Zero-Config Shields:
            </span>
            {[
              { name: "Cursor IDE", brand: "cursor" },
              { name: "Claude Desktop", brand: "claude" },
              { name: "Windsurf", brand: "windsurf" },
              { name: "Antigravity", brand: "antigravity" },
              { name: "Node / TS SDK", brand: "node" },
            ].map((client) => (
              <div
                key={client.name}
                className={`flex items-center gap-2 transition-colors duration-200 cursor-default group ${
                  isDark ? "text-[#94979E] hover:text-white" : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                <ClientBrandIcon name={client.brand} size="xs" className="size-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium tracking-tight text-xs sm:text-sm">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ARCHITECTURAL CAPABILITIES (High-Performance Layer 7 Defense)           */}
      {/* ========================================================================= */}
      <section id="capabilities" className={`pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? "border-white/[0.08]" : "border-slate-200"
      }`}>
        {/* Editorial Section Header & Watermark */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-[#34D59A] mb-4">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0 text-[#34D59A]">
                <path d="M10 6L1 11.1962V0.803848L10 6Z" fill="currentColor" />
              </svg>
              <span>ZERO-TRUST MCP ARCHITECTURE</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-normal tracking-tight leading-[1.12] ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              Built for autonomous coding agents.{" "}
              <span className={isDark ? "text-[#797D86]" : "text-[#64748B]"}>
                Intercept and quarantine MCP tools the way you inspect network packets, with zero configuration.
              </span>
            </h2>
          </div>
          <div className={`hidden lg:block font-mono text-7xl font-light select-none tracking-tighter ${
            isDark ? "text-[#18191B]" : "text-slate-200"
          }`}>
            01
          </div>
        </div>

        {/* 3 Editorial Value Propositions (Structured Card Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-6">
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs hover:shadow-md"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-[#34D59A] font-semibold uppercase tracking-wider">
                01 / In-Flight Intercept
              </span>
              <div className={`size-8 rounded-lg border flex items-center justify-center ${
                isDark ? "bg-[#34D59A]/10 border-[#34D59A]/20 text-[#34D59A]" : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}>
                <Terminal className="size-4" />
              </div>
            </div>
            <h3 className={`text-base font-semibold tracking-tight mb-2 ${isDark ? "text-white" : "text-[#0F172A]"}`}>
              Instant Operations
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
              Transparent stdio &amp; SSE transport wrapping with &lt;0.42ms overhead. Agents don&apos;t wait for proxy daemons or container spinups.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs hover:shadow-md"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
                02 / Deep Packet Inspection
              </span>
              <div className={`size-8 rounded-lg border flex items-center justify-center ${
                isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"
              }`}>
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <h3 className={`text-base font-semibold tracking-tight mb-2 ${isDark ? "text-white" : "text-[#0F172A]"}`}>
              AST Parameter Guard
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
              In-flight parsing blocks destructive SQL (<code className="text-red-400 font-mono text-xs">DROP TABLE</code>), shell injections, and credential paths before transmission.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs hover:shadow-md"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] text-purple-400 font-semibold uppercase tracking-wider">
                03 / Autonomous Safety
              </span>
              <div className={`size-8 rounded-lg border flex items-center justify-center ${
                isDark ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-700"
              }`}>
                <RotateCcw className="size-4" />
              </div>
            </div>
            <h3 className={`text-base font-semibold tracking-tight mb-2 ${isDark ? "text-white" : "text-[#0F172A]"}`}>
              Safe Rollback &amp; Circuit Breakers
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
              Every agent modification automatically preserves a 100% reversible <code className={`${isDark ? "text-[#34D59A]" : "text-emerald-700 font-semibold"} font-mono text-xs`}>*.sevlex.bak</code> backup snapshot with velocity breakers.
            </p>
          </div>
        </div>

        {/* Layer 7 Zero-Trust Architecture Conduit (Kinetic Motion Graphics Flow) */}
        <div className="mt-8">
          <ArchitectureMotionConduit />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. IN-FLIGHT THREAT INTERCEPTION & POLICY GUARD (2-PANE ARCHITECTURE)      */}
      {/* ========================================================================= */}
      <section id="simulator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-3 ${
            isDark
              ? "bg-[#14161C] text-[#34D59A] border border-white/[0.08]"
              : "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
          }`}>
            <ShieldCheck className="size-3.5 text-[#34D59A]" />
            Live Demo
          </div>
          <h2 className={`text-3xl sm:text-4xl font-semibold tracking-tight ${
            isDark ? "text-white" : "text-[#0F172A]"
          }`}>
            See How Sevlex Blocks Dangerous Agent Actions
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isDark ? "text-[#797D86]" : "text-[#475569]"
          }`}>
            When an AI coding agent tries to delete a database or leak credentials, Sevlex stops it in under a millisecond.
          </p>
        </div>

        {/* 2-Pane Policy Guard Container */}
        <div className={`rounded-2xl border overflow-hidden transition-all ${
          isDark
            ? "border-white/[0.08] bg-[#0E1014] shadow-2xl"
            : "border-slate-200/90 bg-white ring-1 ring-slate-900/[0.04] shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(15,23,42,0.08)]"
        }`}>
          {/* Scenario Selector Strip */}
          <div className={`p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
            isDark ? "bg-[#0A0C10] border-white/[0.08]" : "bg-slate-100/75 border-slate-200/90"
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono font-medium px-2 ${
                isDark ? "text-[#61646B]" : "text-slate-500"
              }`}>
                Select Scenario:
              </span>
              {(Object.keys(SCENARIOS) as AttackScenario[]).map((key) => {
                const s = SCENARIOS[key];
                const isActive = activeScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleTriggerScenario(key)}
                    className={`h-8 px-3.5 rounded-full text-xs font-medium font-mono transition flex items-center gap-2 cursor-pointer border ${
                      isActive
                        ? isDark
                          ? "border-white bg-white text-black font-semibold shadow-xs"
                          : "border-slate-900 bg-slate-900 text-white font-semibold shadow-xs ring-1 ring-slate-900/10"
                        : isDark
                        ? "border-white/[0.08] bg-[#14161C] text-[#C9CBCF] hover:border-white/[0.18] hover:text-white"
                        : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 shadow-xs ring-1 ring-slate-900/[0.02]"
                    }`}
                  >
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>Latency:</span>
              <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? "bg-[#34D59A]/10 text-[#34D59A] border-[#34D59A]/30"
                  : "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
              }`}>
                {scenario.latency}
              </span>
            </div>
          </div>

          {/* Two-Pane Body */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x ${
            isDark ? "divide-[#242628]" : "divide-slate-200/90"
          }`}>
            {/* Left Pane: Ingress Attempt */}
            <div className="p-6 space-y-4 font-mono">
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDark ? "border-white/[0.08]" : "border-slate-200"
              }`}>
                <div className="flex items-center gap-2.5">
                  <ClientBrandIcon name={scenario.clientBrand} size="xs" className="size-4" />
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-white" : "text-[#0F172A]"
                  }`}>
                    {scenario.client}
                  </span>
                </div>
                <span className={`text-[11px] ${isDark ? "text-[#61646B]" : "text-slate-500"}`}>
                  Target: {scenario.server}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className={`flex items-center justify-between text-[11px] ${
                  isDark ? "text-[#797D86]" : "text-slate-600"
                }`}>
                  <span>Attempted Tool Call:</span>
                  <span className={isDark ? "text-[#34D59A]" : "text-emerald-700 font-semibold"}>{scenario.tool}</span>
                </div>
                <pre className={`p-4 rounded-xl border text-xs overflow-x-auto leading-relaxed shadow-inner max-h-[260px] ${
                  isDark
                    ? "bg-[#000000] border-white/[0.08] text-[#C9CBCF]"
                    : "bg-[#0B0F19] border-slate-800 text-slate-100"
                }`}>
                  <code>{scenario.payload}</code>
                </pre>
              </div>

              <p className={`text-xs leading-relaxed font-sans pt-1 ${
                isDark ? "text-[#797D86]" : "text-[#475569]"
              }`}>
                {scenario.explanation}
              </p>
            </div>

            {/* Right Pane: Sevlex Zero-Trust Enforcement */}
            <div className={`p-6 space-y-4 font-mono flex flex-col justify-between transition-colors ${
              isDark ? "bg-[#0A0B0E]" : "bg-slate-50/60"
            }`}>
              <div className="space-y-4">
                <div className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? "border-white/[0.08]" : "border-slate-200"
                }`}>
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-[#34D59A]" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? "text-white" : "text-[#0F172A]"
                    }`}>
                      Sevlex Policy Enforcement
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      scenario.decision === "BLOCKED"
                        ? isDark
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : "bg-rose-50 border-rose-200 text-rose-800"
                        : scenario.decision === "CIRCUIT_BROKEN"
                        ? isDark
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                        : isDark
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                    }`}
                  >
                    {scenario.decision === "BLOCKED"
                      ? "🛑 INTERCEPTED & QUARANTINED"
                      : scenario.decision === "CIRCUIT_BROKEN"
                      ? "⚡ CIRCUIT BREAKER ENGAGED"
                      : "✔ VERIFIED BENIGN"}
                  </span>
                </div>

                {/* 4-Item Policy Breakdown Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#14161C] border-white/[0.08]" : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs"
                  }`}>
                    <span className={`block text-[10px] uppercase font-semibold ${
                      isDark ? "text-[#61646B]" : "text-slate-500"
                    }`}>
                      Policy Rule
                    </span>
                    <span className={`font-medium text-[11px] truncate block mt-0.5 ${
                      isDark ? "text-white" : "text-[#0F172A]"
                    }`}>
                      {scenario.ruleViolated}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#14161C] border-white/[0.08]" : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs"
                  }`}>
                    <span className={`block text-[10px] uppercase font-semibold ${
                      isDark ? "text-[#61646B]" : "text-slate-500"
                    }`}>
                      Downstream Impact
                    </span>
                    <span className={`font-semibold text-[11px] block mt-0.5 ${
                      isDark ? "text-[#34D59A]" : "text-emerald-700"
                    }`}>
                      {scenario.decision === "BLOCKED"
                        ? "0 Bytes Forwarded (Drop)"
                        : scenario.decision === "CIRCUIT_BROKEN"
                        ? "Throttled / 429 Cooldown"
                        : "Permitted (<0.15ms)"}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#14161C] border-white/[0.08]" : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs"
                  }`}>
                    <span className={`block text-[10px] uppercase font-semibold ${
                      isDark ? "text-[#61646B]" : "text-slate-500"
                    }`}>
                      Detection Engine
                    </span>
                    <span className={`font-medium text-[11px] block mt-0.5 ${
                      isDark ? "text-[#C9CBCF]" : "text-slate-800"
                    }`}>
                      {scenario.astAnalysis.statementType}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#14161C] border-white/[0.08]" : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] shadow-xs"
                  }`}>
                    <span className={`block text-[10px] uppercase font-semibold ${
                      isDark ? "text-[#61646B]" : "text-slate-500"
                    }`}>
                      Audit Ledger
                    </span>
                    <span className={`font-medium text-[11px] block mt-0.5 truncate ${
                      isDark ? "text-blue-400" : "text-blue-700"
                    }`}>
                      Merkle #{scenario.merkleReceipt.blockIndex} (Neon DB)
                    </span>
                  </div>
                </div>

                {/* Synthesized Response returned to Agent */}
                <div className="space-y-1.5 pt-1">
                  <div className={`flex items-center justify-between text-[11px] ${
                    isDark ? "text-[#797D86]" : "text-slate-600"
                  }`}>
                    <span>Synthesized Response (Returned to Agent):</span>
                    <span className={isDark ? "text-[#AFB1B6]" : "text-slate-600"}>{scenario.latency}</span>
                  </div>
                  <pre className={`p-3.5 rounded-xl border text-[11px] overflow-x-auto leading-relaxed shadow-inner max-h-[140px] ${
                    isDark
                      ? "bg-[#000000] border-white/[0.08] text-[#94979E]"
                      : "bg-[#0B0F19] border-slate-800 text-slate-300"
                  }`}>
                    <code>{scenario.responsePayload}</code>
                  </pre>
                </div>
              </div>

              {/* Bottom Console Link */}
              <div className={`pt-2 flex items-center justify-between text-xs border-t ${
                isDark ? "border-white/[0.08] text-[#797D86]" : "border-slate-200 text-slate-600"
              }`}>
                <span className={`flex items-center gap-1.5 ${isDark ? "text-[#34D59A]" : "text-emerald-700 font-medium"}`}>
                  <CheckCircle2 className="size-3.5" />
                  <span>Cryptographic Merkle Non-Repudiation</span>
                </span>
                <a
                  href="/console"
                  className={`font-medium flex items-center gap-1 transition ${
                    isDark ? "text-white hover:text-[#34D59A]" : "text-slate-900 hover:text-emerald-700"
                  }`}
                >
                  <span>Console</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DEVELOPER DOCUMENTATION & INTERACTIVE CLI WORKBENCH                    */}
      {/* ========================================================================= */}
      <section id="docs" className={`py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-white/[0.08]" : "border-slate-200"
      }`}>
        <div id="terminal" className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-[#34D59A] mb-3">
            <Terminal className="size-3.5 text-[#34D59A]" />
            <span>DEVELOPER DOCUMENTATION &amp; QUICKSTART</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-normal tracking-tight ${
            isDark ? "text-white" : "text-[#0F172A]"
          }`}>
            Zero-Config L7 Gateway CLI
          </h2>
          <p className={`mt-2 text-xs sm:text-sm ${
            isDark ? "text-[#797D86]" : "text-[#475569]"
          }`}>
            One command scans your host, transparently wraps downstream stdio MCP tools in Layer 7 zero-trust filters, and creates safe backups.
          </p>
        </div>
        <div className={`rounded-2xl border overflow-hidden transition-all ${
          isDark
            ? "border-white/[0.08] bg-[#0E1014] shadow-2xl"
            : "border-slate-800/90 bg-[#0B0F19] ring-1 ring-slate-900/40 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_16px_36px_-6px_rgba(15,23,42,0.18)]"
        }`}>
          {/* Terminal Window Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isDark ? "bg-[#0A0C10] border-white/[0.08]" : "bg-[#070A12] border-slate-800"
          }`}>
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-red-500/80" />
              <div className="size-2.5 rounded-full bg-amber-500/80" />
              <div className="size-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-[#797D86] flex items-center gap-1.5">
                <Terminal className="size-3.5 text-[#34D59A]" /> sevlex-developer-gateway
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#000000] p-1 rounded-full border border-white/[0.08]">
              <button
                onClick={() => setTerminalTab("demo")}
                className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                  terminalTab === "demo"
                    ? "bg-[#34D59A] text-black font-semibold"
                    : "text-[#797D86] hover:text-white"
                }`}
              >
                npx sevlex demo
              </button>
              <button
                onClick={() => setTerminalTab("init")}
                className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                  terminalTab === "init"
                    ? "bg-white text-black font-semibold"
                    : "text-[#797D86] hover:text-white"
                }`}
              >
                npx sevlex init
              </button>
              <button
                onClick={() => setTerminalTab("status")}
                className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                  terminalTab === "status"
                    ? "bg-white text-black font-semibold"
                    : "text-[#797D86] hover:text-white"
                }`}
              >
                npx sevlex status
              </button>
              <button
                onClick={() => setTerminalTab("verify")}
                className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                  terminalTab === "verify"
                    ? "bg-white text-black font-semibold"
                    : "text-[#797D86] hover:text-white"
                }`}
              >
                npx sevlex verify
              </button>
            </div>
          </div>

          {/* Terminal Output Body */}
          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[250px] text-[#C9CBCF] bg-[#000000]">
            {terminalTab === "demo" && (
              <div className="space-y-1.5">
                <p className="text-[#61646B]">$ npx sevlex demo</p>
                <p className="text-white font-medium">[Sevlex Demo] Testing Layer 7 Zero-Trust Interception &amp; AST Parameter Rules...</p>
                <p className="text-[#797D86]">TEST 1: Autonomous Agent runs legitimate Read Query (SELECT id FROM users)</p>
                <p className="text-[#34D59A] font-medium">✔ RESULT: ALLOWED (0.18ms) - Query executed with zero delay.</p>
                <p className="text-[#797D86] mt-2">TEST 2: Autonomous Agent attempts destructive schema deletion (DROP TABLE production_users)</p>
                <p className="text-[#34D59A] font-medium">
                  ✔ RESULT: ARRESTED IN 2.94ms! <span className="text-red-400 font-mono">[LAYER 7 AST BLOCK] Destructive database operation</span>
                </p>
                <p className="text-[#797D86] mt-2">TEST 3: Autonomous Agent attempts credential exfiltration (cat .env)</p>
                <p className="text-[#34D59A] font-medium">
                  ✔ RESULT: ARRESTED IN 2.71ms! <span className="text-red-400 font-mono">[SECURITY POLICY BLOCK] Access to private credentials</span>
                </p>
                <p className="text-[#34D59A] font-bold mt-2">
                  ✔ ALL ZERO-TRUST SHIELD TESTS VERIFIED SUCCESSFULLY
                </p>
              </div>
            )}

            {terminalTab === "init" && (
              <div className="space-y-1.5">
                <p className="text-[#61646B]">$ npx sevlex init</p>
                <p className="text-white font-medium">[Sevlex Init] Scanning host for MCP-enabled AI runtimes...</p>
                <p className="text-[#C9CBCF]">✔ Found Claude Desktop (1 server(s) wrapped in Layer 7 firewall)</p>
                <p className="text-[#C9CBCF]">✔ Found Cursor IDE (0 servers unmanaged, policy injected)</p>
                <p className="text-[#C9CBCF]">✔ Found Google Antigravity (1 server(s) shielded)</p>
                <p className="text-[#34D59A] font-medium mt-2">
                  ✔ SUCCESS: 6 AI runtimes shielded. Backups preserved at *.sevlex.bak
                </p>
                <p className="text-[#61646B] mt-2">
                  Stdio intercept activated with &lt;0.1ms overhead. Run &apos;npx sevlex status&apos; to inspect.
                </p>
              </div>
            )}

            {terminalTab === "status" && (
              <div className="space-y-1.5">
                <p className="text-[#61646B]">$ npx sevlex status</p>
                <p className="text-[#797D86]">● Cloud Workspace:  <span className="text-[#34D59A] font-medium">✔ CONNECTED</span> -&gt; &quot;Sevlex Core Workspace&quot;</p>
                <p className="text-[#797D86]">● Cloud Endpoint:   <span className="text-white">https://app.sevlex.com</span></p>
                <p className="text-[#797D86]">● Active Rules:     <span className="text-white">2 blocked tools, 1 HITL clearance approvals</span></p>
                <p className="text-[#797D86]">● DLP Engine:       <span className="text-[#34D59A] font-medium">Active (AWS, Stripe, GitHub PAT, SSN)</span></p>
                <p className="text-[#797D86]">● Circuit Breaker:  <span className="text-[#34D59A] font-medium">Armed (Threshold: 25 calls / 30s)</span></p>
                <p className="text-[#797D86]">● Cryptographic Log: <span className="text-[#34D59A] font-medium">392 SHA-256 receipts [100% VALID]</span></p>
              </div>
            )}

            {terminalTab === "verify" && (
              <div className="space-y-1.5">
                <p className="text-[#61646B]">$ npx sevlex verify</p>
                <p className="text-white font-medium">[Merkle Audit Engine] Performing mathematical non-repudiation audit...</p>
                <p className="text-[#C9CBCF]">Traversing SQLite WAL Merkle Hash Chain backwards from root...</p>
                <p className="text-[#797D86]">Receipt #392: SHA256(prev || receipt) == 8e1a3b... [VALID]</p>
                <p className="text-[#797D86]">Receipt #391: SHA256(prev || receipt) == d4c92f... [VALID]</p>
                <p className="text-[#34D59A] font-medium mt-2">
                  ✔ AUDIT SUCCESS: 392 cryptographic receipts verified. Zero tamper events detected.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Machine-Readable Documentation Card (llms.txt Standard) */}
        <div className={`mt-6 p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
          isDark ? "border-white/[0.08] bg-[#0E1014]" : "border-slate-200/90 bg-white ring-1 ring-slate-900/[0.04] shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_6px_16px_-4px_rgba(15,23,42,0.05)]"
        }`}>
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
              isDark
                ? "bg-white/[0.04] border-white/[0.08] text-[#34D59A]"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
            }`}>
              <FileCode className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                  Agent Manifest: llms.txt
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D59A]/10 text-[#34D59A] border border-[#34D59A]/20 font-bold uppercase">
                  Machine Standard
                </span>
              </div>
              <p className={`text-xs mt-1 max-w-xl ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
                Structured plain-text specification optimized for Claude Code, Cursor, Windsurf, and autonomous AI agents to ingest CLI commands without web scraping.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className={`hidden md:flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-mono ${
              isDark ? "bg-[#000000] border-white/[0.08] text-[#AFB1B6]" : "bg-slate-100 border-slate-200 text-slate-800"
            }`}>
              <span className={isDark ? "text-[#61646B]" : "text-slate-400"}>$</span>
              <code>curl -s sevlex.com/llms.txt</code>
            </div>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition shrink-0 cursor-pointer ${
                isDark
                  ? "bg-white/[0.06] hover:bg-white/[0.1] text-white border-white/[0.08]"
                  : "bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-xs"
              }`}
            >
              <span>View llms.txt</span>
              <ExternalLink size={12} className={isDark ? "text-[#797D86]" : "text-slate-400"} />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ARCHITECTURAL BENCHMARKS & CRYPTOGRAPHIC GUARANTEES                   */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                LATENCY OVERHEAD
              </span>
              <span className="size-2 rounded-full bg-[#34D59A] animate-pulse" />
            </div>
            <div className="text-3xl sm:text-4xl font-normal text-[#34D59A] tracking-tight font-mono">
              0.42ms
            </div>
            <div className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              Wire Latency Budget
            </div>
            <div className={`mt-1 text-[11px] leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
              Measured stdio JSON-RPC packet processing time in-flight.
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                AUDIT COMPLIANCE
              </span>
              <span className="size-2 rounded-full bg-purple-400" />
            </div>
            <div className={`text-3xl sm:text-4xl font-normal tracking-tight font-mono ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              SHA-256
            </div>
            <div className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              Merkle Tree Receipts
            </div>
            <div className={`mt-1 text-[11px] leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
              Immutable cryptographic hash chain per tool execution.
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                COMPATIBILITY
              </span>
              <span className="size-2 rounded-full bg-blue-400" />
            </div>
            <div className={`text-3xl sm:text-4xl font-normal tracking-tight font-mono ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              100% Native
            </div>
            <div className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              Stdio &amp; SSE Transport
            </div>
            <div className={`mt-1 text-[11px] leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
              Zero config wrapper for Cursor, Claude Desktop &amp; Windsurf.
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                SAFETY STRICT MODE
              </span>
              <span className="size-2 rounded-full bg-red-400" />
            </div>
            <div className={`text-3xl sm:text-4xl font-normal tracking-tight font-mono ${
              isDark ? "text-[#AFB1B6]" : "text-slate-700"
            }`}>
              0.00%
            </div>
            <div className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}>
              Destructive Mutations
            </div>
            <div className={`mt-1 text-[11px] leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
              Deterministic AST policy blocks DROP TABLE &amp; shell escapes.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRODUCT: CORE SECURITY ENGINES BENTO GRID (WITH 3D MOTION GRAPHICS)    */}
      {/* ========================================================================= */}
      <EngineBentoGrid />

      {/* ========================================================================= */}
      {/* 9.6 ABOUT SEVLEX                                                          */}
      {/* ========================================================================= */}
      <section id="about" className={`py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-white/[0.08]" : "border-slate-200"
      }`}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4 ${
            isDark
              ? "bg-[#14161C] border border-white/[0.08] text-[#797D86]"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800"
          }`}>
            <span className="text-[#34D59A] font-semibold">ABOUT SEVLEX</span>
            <span className={isDark ? "text-[#303236]" : "text-emerald-300"}>•</span>
            <span className={isDark ? "text-[#AFB1B6]" : "text-emerald-700"}>OUR MISSION</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-normal tracking-tight ${
            isDark ? "text-white" : "text-[#0F172A]"
          }`}>
            Securing the Autonomous Agent Frontier
          </h2>
          <p className={`mt-4 text-sm sm:text-base leading-relaxed ${
            isDark ? "text-[#797D86]" : "text-[#475569]"
          }`}>
            Autonomous coding agents and the Model Context Protocol are revolutionizing software engineering.
            Sevlex exists to give engineering leaders complete confidence to adopt agents at scale—preventing
            catastrophic database mutations, source code theft, and credential leaks without slowing developers down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-xs hover:shadow-md"
          }`}>
            <div className={`size-9 rounded-xl border flex items-center justify-center text-[#34D59A] mb-4 ${
              isDark ? "bg-[#34D59A]/10 border-[#34D59A]/20" : "bg-emerald-50 border-emerald-200"
            }`}>
              <Shield className="size-4" />
            </div>
            <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-[#0F172A]"}`}>Zero-Trust by Default</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
              Every JSON-RPC packet passing between Claude, Cursor, and downstream systems is inspected in-flight. Destructive operations are arrested in microseconds.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-xs hover:shadow-md"
          }`}>
            <div className={`size-9 rounded-xl border flex items-center justify-center text-blue-400 mb-4 ${
              isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"
            }`}>
              <Terminal className="size-4" />
            </div>
            <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-[#0F172A]"}`}>Developer Velocity First</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
              Security that gets in the way gets bypassed. Sevlex operates transparently over stdio pipes with &lt;0.42ms wire overhead and zero workflow disruption.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#12141A]"
              : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-xs hover:shadow-md"
          }`}>
            <div className={`size-9 rounded-xl border flex items-center justify-center text-purple-400 mb-4 ${
              isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200"
            }`}>
              <FileCheck2 className="size-4" />
            </div>
            <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-[#0F172A]"}`}>Mathematical Proof</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
              Every tool execution receipt is mathematically linked in an immutable SQLite WAL Merkle chain. Complete cryptographic audit readiness built into every packet.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CTA BOTTOM BANNER (Neon Pill Standards)                               */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`rounded-3xl border p-10 sm:p-14 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? "border-white/[0.08] bg-[#0A0C10]"
            : "border-slate-800 bg-slate-950 text-white shadow-slate-900/20"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#34D59A]/10 blur-[90px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight relative z-10">
            Shield Your AI Agents in 10 Seconds
          </h2>
          <p className="mt-4 text-[#94979E] max-w-xl mx-auto text-sm sm:text-base relative z-10">
            No Docker, no kernel drivers, no root permissions. Run one command to wrap MCP servers across Cursor, Claude Desktop, and Antigravity.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            {/* Install pill */}
            <div className="inline-flex items-center gap-3 bg-[#14161C] border border-white/[0.08] rounded-full px-5 py-2.5">
              <span className="text-[#61646B] font-mono text-xs">$</span>
              <code className="text-xs font-mono text-[#34D59A] font-medium">npx sevlex init</code>
              <button
                onClick={copyInstall}
                className="p-1 text-[#797D86] hover:text-white transition cursor-pointer"
                title="Copy install command"
              >
                {copied ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            {/* GitHub Sign Up Pill */}
            <a
              href="/api/auth/github"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-6 tracking-tight font-medium bg-[#16181F] border border-white/[0.08] text-white hover:bg-white/[0.08] text-xs gap-2"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Sign Up with GitHub</span>
            </a>

            {/* Console Primary Pill */}
            <a
              href="/console"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium bg-white text-black hover:bg-[#E4E5E7] text-xs gap-2"
            >
              <span>Sign In to Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER                                                               */}
      {/* ========================================================================= */}
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark ? "border-white/[0.08] text-[#797D86]" : "border-slate-200 text-slate-500"
      }`}>
        <div className={`flex items-center gap-3 ${isDark ? "text-[#94979E]" : "text-slate-600"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isDark ? "/sevlex-brand-horizontal.png" : "/sevlex-brand-horizontal-dark.png"}
            alt="Sevlex"
            className="h-6 w-auto object-contain opacity-85 hover:opacity-100 transition"
          />
          <span>&copy; 2026 Sevlex. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href="/product" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Product</a>
          <a href="/service" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Service</a>
          <a href="/about" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>About</a>
          <a href="/docs" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Docs</a>
          <a href="/privacy" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Privacy</a>
          <a href="/terms" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Terms</a>
          <a href="/console" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Console</a>
          <a href="/llms.txt" target="_blank" className={`font-mono text-[11px] ${isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}`}>llms.txt</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

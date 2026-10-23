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
} from "lucide-react";
import ClientBrandIcon, { getLogoDevUrl } from "./components/ClientBrandIcon";

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
      className={`relative overflow-hidden rounded-2xl border border-[#242628] bg-[#0E0E12] p-6 shadow-xl transition-all duration-300 hover:border-[#303236] ${className}`}
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

type AgentStationId = "cursor" | "claude" | "windsurf" | "chatgpt";

interface AgentStationItem {
  id: AgentStationId;
  name: string;
  badge: string;
  iconSrc?: string;
  isBot?: boolean;
  shortcut: string;
  configFile: string;
  prompt: string;
  cliCommand: string;
  logs: {
    tag: string;
    text: string;
    highlight?: string;
    color: string;
  }[];
}

const AGENT_STATION_DATA: Record<AgentStationId, AgentStationItem> = {
  cursor: {
    id: "cursor",
    name: "Cursor Composer",
    badge: "Cmd + I / Agent Mode",
    iconSrc: "/cursor-icon.svg",
    shortcut: "Cmd + I / Ctrl + I",
    configFile: "~/.cursor/mcp.json",
    prompt:
      "Install and verify Sevlex Layer 7 Zero-Trust MCP Firewall. Run 'npx sevlex init' to automatically discover and wrap my MCP servers in ~/.cursor/mcp.json, then run 'npx sevlex demo' to test AST parameter interception.",
    cliCommand: "npx sevlex init && npx sevlex demo",
    logs: [
      { tag: "●", text: "Cursor Composer: Scanning local workspace config...", color: "text-blue-400" },
      { tag: "[Sevlex]", text: "Found Cursor MCP configuration at", highlight: "~/.cursor/mcp.json", color: "text-[#C9CBCF]" },
      { tag: "[Sevlex]", text: "Created safety snapshot:", highlight: "mcp.json.sevlex.bak (100% reversible)", color: "text-[#34D59A]" },
      { tag: "[Sevlex]", text: "Injected Layer 7 proxy into 4 downstream servers:", highlight: "github, postgres, slack, filesystem", color: "text-blue-300" },
      { tag: "●", text: "Cursor Composer: Executing 'npx sevlex demo' security verification...", color: "text-amber-400" },
      { tag: "[ToolGuard™]", text: "DROP TABLE AST query ->", highlight: "ARRESTED & BLOCKED (0.42ms)", color: "text-red-400" },
      { tag: "[ToolGuard™]", text: "AWS credential exfiltration ->", highlight: "ARRESTED & BLOCKED (0.38ms)", color: "text-red-400" },
      { tag: "✓", text: "Cursor IDE is fully shielded. Zero-Trust Layer 7 firewall active.", color: "text-[#34D59A]" },
    ],
  },
  claude: {
    id: "claude",
    name: "Claude Code CLI",
    badge: "CLI & Desktop",
    iconSrc: "/claude-icon.svg",
    shortcut: "claude \"...\" or Claude Desktop",
    configFile: "~/.claude.json",
    prompt:
      "Run 'npx sevlex init' to wrap all MCP servers in ~/.claude.json, then run 'npx sevlex demo' to verify sub-3ms AST security rules.",
    cliCommand: "claude \"npx sevlex init && npx sevlex demo\"",
    logs: [
      { tag: "$", text: "claude \"npx sevlex init && npx sevlex demo\"", color: "text-blue-400" },
      { tag: "[Sevlex]", text: "Auto-detected Claude Desktop & CLI config:", highlight: "~/.claude.json", color: "text-[#C9CBCF]" },
      { tag: "[Sevlex]", text: "Safety snapshot saved:", highlight: "~/.claude.json.sevlex.bak", color: "text-[#34D59A]" },
      { tag: "[Sevlex]", text: "Wrapped stdio transport with Sevlex Zero-Trust L7 proxy", color: "text-blue-300" },
      { tag: "[Sevlex]", text: "Running parameter-level AST test suite (npx sevlex demo)...", color: "text-amber-400" },
      { tag: "[AuditChain]", text: "4/4 exploit vectors arrested. Cryptographic Merkle receipt generated.", color: "text-[#34D59A]" },
      { tag: "✓", text: "Claude MCP servers fully secured with zero human configuration required.", color: "text-[#34D59A]" },
    ],
  },
  windsurf: {
    id: "windsurf",
    name: "Windsurf Cascade",
    badge: "Cascade Chat",
    iconSrc: "/windsurf-icon.svg",
    shortcut: "Cmd + L (Cascade)",
    configFile: "~/.codeium/windsurf/mcp_config.json",
    prompt:
      "Configure Sevlex L7 proxy for all MCP tools in ~/.codeium/windsurf/mcp_config.json using 'npx sevlex init', then verify with 'npx sevlex demo'.",
    cliCommand: "npx sevlex init && npx sevlex demo",
    logs: [
      { tag: "●", text: "Cascade Agent: Executing automated setup flow...", color: "text-blue-400" },
      { tag: "[Sevlex]", text: "Detected Windsurf environment:", highlight: "~/.codeium/windsurf/mcp_config.json", color: "text-[#C9CBCF]" },
      { tag: "[Sevlex]", text: "Created safety snapshot:", highlight: "mcp_config.json.sevlex.bak", color: "text-[#34D59A]" },
      { tag: "[Sevlex]", text: "Injected Layer 7 Deep Packet Inspection proxy into active tools", color: "text-blue-300" },
      { tag: "●", text: "Cascade Agent: Running AST verification check...", color: "text-amber-400" },
      { tag: "[ToolGuard™]", text: "AST query validator passed with", highlight: "<0.5ms overhead", color: "text-[#34D59A]" },
      { tag: "✓", text: "Windsurf Cascade tools hardened. Ready for autonomous coding.", color: "text-[#34D59A]" },
    ],
  },
  chatgpt: {
    id: "chatgpt",
    name: "Devin / ChatGPT",
    badge: "llms.txt Standard",
    isBot: true,
    shortcut: "Prompt / Web Agent",
    configFile: "https://sevlex.com/llms.txt",
    prompt:
      "Fetch and follow https://sevlex.com/llms.txt to configure Sevlex Layer 7 Zero-Trust MCP Gateway on this system, then run 'npx sevlex status --json' to verify.",
    cliCommand: "curl -s https://sevlex.com/llms.txt | npx sevlex init --json",
    logs: [
      { tag: "●", text: "Agent: Fetching machine specification from", highlight: "https://sevlex.com/llms.txt", color: "text-blue-400" },
      { tag: "●", text: "Agent: Parsing llms.txt endpoints & non-interactive execution flags...", color: "text-[#C9CBCF]" },
      { tag: "[Sevlex]", text: "Executing: npx sevlex init --json", color: "text-[#34D59A]" },
      { tag: "→", text: "JSON stdout: {\"status\": \"success\", \"shielded\": 4, \"backup\": true}", color: "text-blue-300 font-bold" },
      { tag: "●", text: "Agent: Executing verification: npx sevlex status --json", color: "text-amber-400" },
      { tag: "[Sevlex]", text: "All proxies operating in Zero-Trust Layer 7 enforcement mode", color: "text-[#34D59A]" },
      { tag: "✓", text: "Autonomous setup completed with zero human intervention.", color: "text-[#34D59A]" },
    ],
  },
};

export default function LandingPage() {
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

  const [selectedAgent, setSelectedAgent] = useState<AgentStationId>("cursor");
  const [copiedAgentPrompt, setCopiedAgentPrompt] = useState(false);
  const [simulatorTab, setSimulatorTab] = useState<"request" | "response" | "ast">("request");
  const [dispatchTab, setDispatchTab] = useState<"slack" | "merkle">("slack");
  const [copiedPacket, setCopiedPacket] = useState(false);
  const [isPingingWire, setIsPingingWire] = useState(false);
  const [wirePingSuccess, setWirePingSuccess] = useState(false);

  const activeAgent = AGENT_STATION_DATA[selectedAgent];

  const copyAgentPrompt = () => {
    navigator.clipboard.writeText(activeAgent.prompt);
    setCopiedAgentPrompt(true);
    setTimeout(() => setCopiedAgentPrompt(false), 2000);
  };

  const copyPacket = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPacket(true);
    setTimeout(() => setCopiedPacket(false), 2000);
  };

  const triggerWirePing = () => {
    setIsPingingWire(true);
    setWirePingSuccess(false);
    setTimeout(() => {
      setIsPingingWire(false);
      setWirePingSuccess(true);
      setTimeout(() => setWirePingSuccess(false), 2500);
    }, 380);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#F8FAFC] font-sans selection:bg-[#34D59A]/30 selection:text-white overflow-x-hidden">
      {/* Precision hairline grid backdrop */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#131415_1px,transparent_1px),linear-gradient(to_bottom,#131415_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Subtle restrained atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.08),transparent_70%)] pointer-events-none" />

      {/* ========================================================================= */}
      {/* NAVIGATION HEADER                                                         */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-40 bg-[#000000]/85 backdrop-blur-md border-b border-[#242628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sevlex-brand-horizontal.png"
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
              />
            </a>
          </div>

          {/* Desktop Nav Items - Clean & Single-Product Focused */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#94979E]">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#simulator" className="hover:text-white transition-colors">
              Live Demo
            </a>
            <a href="#docs" className="hover:text-white transition-colors">
              Documentation
            </a>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2.5">
            {/* GitHub Stars Button */}
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-[#242628] bg-white/[0.02] text-xs font-medium text-[#C9CBCF] hover:border-white hover:text-white transition duration-200"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
              <span className="text-[#61646B]">•</span>
              <span className="font-mono text-[11px] text-[#AFB1B6]">★ 1.8k</span>
            </a>

            {/* Sign in with GitHub Pill */}
            <a
              href="/console?auth=github"
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full border border-[#242628] bg-[#18191B] hover:bg-[#242628] text-xs font-medium text-white transition duration-200"
            >
              <svg className="size-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Sign in</span>
            </a>

            {/* Primary Console Pill */}
            <a
              href="/console"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200"
            >
              <span>SecOps Console</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] border border-[#242628] text-[#797D86] mb-6">
            <span className="text-[#34D59A] font-semibold">LAYER 7 ZERO-TRUST</span>
            <span className="text-[#303236]">•</span>
            <span className="text-[#AFB1B6]">FIREWALL FOR MODEL CONTEXT PROTOCOL</span>
          </div>

          {/* Master Display Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-[4.25rem] font-medium tracking-tight text-white max-w-4xl mx-auto leading-[1.06] text-balance">
            The security layer for coding agents. Intercept, inspect, and quarantine MCP tools in real time.
          </h1>

          {/* Master Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#94979E] max-w-2xl mx-auto leading-relaxed text-pretty">
            Transparently wraps stdio and SSE JSON-RPC channels between Cursor, Claude Desktop, and downstream servers.
            Zero configuration, sub-0.5ms parameter deep packet inspection, and cryptographic audit proofs.
          </p>

          {/* Primary Action CTAs - Clean 2-Button Architecture */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary Console Pill */}
            <a
              href="/console"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium bg-white text-black hover:bg-[#E4E5E7] text-sm gap-2 shadow-lg shadow-white/5"
            >
              <span>Launch SecOps Console</span>
              <ArrowRight className="size-4" />
            </a>

            {/* Glass Docs Pill */}
            <a
              href="#docs"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium bg-white/[0.03] border border-[#303236] text-white hover:border-[#61646B] hover:bg-white/[0.06] text-sm gap-2"
            >
              <span>Documentation</span>
              <ArrowRight className="size-3.5 text-[#797D86]" />
            </a>
          </div>

          {/* Client Ecosystem Showcase (100% borderless, transparent, seamless) */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#797D86]">
            <span className="font-mono text-[11px] text-[#61646B] uppercase tracking-wider">
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
                className="flex items-center gap-2 text-[#94979E] hover:text-white transition-colors duration-200 cursor-default group"
              >
                <ClientBrandIcon name={client.brand} size="xs" className="size-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium tracking-tight text-xs sm:text-sm">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. READY FOR CODING AGENTS (Neon High-Craft Architecture)                 */}
      {/* ========================================================================= */}
      <section id="agents" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        {/* Editorial Section Header & Watermark */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-[#34D59A] mb-4">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0 text-[#34D59A]">
                <path d="M10 6L1 11.1962V0.803848L10 6Z" fill="currentColor" />
              </svg>
              <span>OPERATE IT WITH AGENTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white leading-[1.12]">
              Ready for coding agents.{" "}
              <span className="text-[#797D86]">
                Intercept and quarantine MCP tools the way you inspect network packets, with zero configuration.
              </span>
            </h2>
          </div>
          <div className="hidden lg:block font-mono text-7xl font-light text-[#18191B] select-none tracking-tighter">
            01
          </div>
        </div>

        {/* 3 Editorial Value Propositions (Unboxed, typographic, zero slop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14 border-b border-[#242628]">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#34D59A] font-semibold uppercase tracking-wider">
              01 / In-Flight Intercept
            </div>
            <h3 className="text-base font-medium text-white tracking-tight">Instant Operations</h3>
            <p className="text-sm text-[#797D86] leading-relaxed">
              Transparent stdio &amp; SSE transport wrapping with &lt;0.1ms overhead. Agents don&apos;t wait for proxy daemons or container spinups.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-xs text-blue-400 font-semibold uppercase tracking-wider">
              02 / Deep Packet Inspection
            </div>
            <h3 className="text-base font-medium text-white tracking-tight">AST Parameter Guard</h3>
            <p className="text-sm text-[#797D86] leading-relaxed">
              In-flight parsing blocks destructive SQL (<code className="text-red-400 font-mono text-xs">DROP TABLE</code>), shell injections, and credential paths before transmission.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-xs text-purple-400 font-semibold uppercase tracking-wider">
              03 / Autonomous Safety
            </div>
            <h3 className="text-base font-medium text-white tracking-tight">Safe Rollback &amp; Circuit Breakers</h3>
            <p className="text-sm text-[#797D86] leading-relaxed">
              Every agent modification automatically preserves a 100% reversible <code className="text-[#34D59A] font-mono text-xs">*.sevlex.bak</code> backup snapshot with velocity breakers.
            </p>
          </div>
        </div>

        {/* The Unified Agent Command Center (A single, sleek developer workbench) */}
        <div className="mt-12 rounded-2xl border border-[#242628] bg-[#0A0A0C] overflow-hidden shadow-2xl">
          {/* Top Bar: Minimal Client Switcher + llms.txt */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#242628] bg-[#0E0E12]">
            <div className="flex items-center gap-1.5">
              {(Object.keys(AGENT_STATION_DATA) as AgentStationId[]).map((key) => {
                const item = AGENT_STATION_DATA[key];
                const isSelected = selectedAgent === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAgent(key)}
                    className={`h-8 px-3.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-white text-black font-semibold shadow-xs"
                        : "text-[#797D86] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <ClientBrandIcon name={item.id} size="xs" className="size-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <a
              href="/llms.txt"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#797D86] hover:text-white transition px-3 py-1"
            >
              <span>llms.txt Machine Spec</span>
              <ExternalLink size={12} className="text-[#61646B]" />
            </a>
          </div>

          {/* Workbench Grid: Left Setup Directive + Right Live Wire Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#242628]">
            {/* Left: Agent Setup Directive */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#797D86]">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <Sparkles className="size-3.5 text-[#34D59A]" />
                    Paste into {activeAgent.name}:
                  </span>
                  <span className="text-[#AFB1B6] bg-[#141416] px-2.5 py-0.5 rounded-full border border-[#242628]">
                    {activeAgent.configFile}
                  </span>
                </div>

                {/* Prompt Code Block */}
                <div className="relative rounded-xl border border-[#242628] bg-[#000000] p-4 text-xs font-mono text-[#C9CBCF] leading-relaxed">
                  <pre className="whitespace-pre-wrap font-mono">{activeAgent.prompt}</pre>
                </div>

                {/* Quick Execution Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={copyAgentPrompt}
                    className="inline-flex items-center gap-2 h-9 px-5 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition cursor-pointer"
                  >
                    {copiedAgentPrompt ? <Check size={13} className="text-[#34D59A]" /> : <Copy size={13} />}
                    <span>{copiedAgentPrompt ? `Copied for ${activeAgent.name}!` : `Copy Agent Prompt`}</span>
                  </button>

                  <div className="flex items-center gap-2 bg-[#141416] border border-[#242628] rounded-full px-4 py-1.5 text-xs font-mono text-[#797D86]">
                    <span className="text-[#61646B]">$</span>
                    <code className="text-[#C9CBCF] font-medium">{activeAgent.cliCommand}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeAgent.cliCommand);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="ml-1 p-1 hover:text-white text-[#797D86] transition cursor-pointer"
                      title="Copy CLI command"
                    >
                      {copied ? <Check className="size-3 text-[#34D59A]" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Minimal Meta Tags */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#61646B] pt-4 border-t border-[#242628]/60">
                <span className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-[#34D59A]" /> Non-interactive (-y)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-[#34D59A]" /> Reversible snapshot (*.bak)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-[#34D59A]" /> Machine mode (--json)
                </span>
              </div>
            </div>

            {/* Right: Live Wire Stream & In-Flight Intercept */}
            <div className="lg:col-span-5 p-6 bg-[#000000] flex flex-col justify-between font-mono text-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[#797D86] pb-3 border-b border-[#242628]">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <Terminal className="size-3.5 text-[#34D59A]" />
                    wire-inspector ({activeAgent.id})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={triggerWirePing}
                      disabled={isPingingWire}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-[#242628] hover:border-[#34D59A] hover:text-[#34D59A] text-[#C9CBCF] transition cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className={`size-2.5 ${isPingingWire ? "animate-spin text-[#34D59A]" : ""}`} />
                      <span>{isPingingWire ? "Pinging..." : "Test Wire"}</span>
                    </button>
                    <span className="text-[#34D59A] text-[10px] font-bold bg-[#34D59A]/10 border border-[#34D59A]/20 px-2 py-0.5 rounded-full">
                      {wirePingSuccess ? "0.08ms ACK" : "<0.1ms wire"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 py-2">
                  {wirePingSuccess && (
                    <div className="p-2 rounded-lg bg-[#34D59A]/10 border border-[#34D59A]/30 flex items-center justify-between text-[10px] text-[#34D59A] animate-pulse">
                      <span>✔ Live JSON-RPC Round-Trip Intercept</span>
                      <span className="font-bold">RTT 0.08ms</span>
                    </div>
                  )}
                  {activeAgent.logs.slice(0, 5).map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                      <span className={`${log.color} font-bold shrink-0 select-none`}>{log.tag}</span>
                      <span className="text-[#C9CBCF]">
                        {log.text}{" "}
                        {log.highlight && <span className={`${log.color} font-bold`}>{log.highlight}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0E0E12] border border-[#242628] flex items-center justify-between text-[11px] text-[#797D86] mt-4">
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 size={13} className="text-[#34D59A]" />
                  <span>AST Zero-Trust Filter: ACTIVE</span>
                </span>
                <span className="text-[#34D59A] font-bold">&lt;0.5ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE IN-BROWSER EXPLOIT SIMULATOR                               */}
      {/* ========================================================================= */}
      <section id="simulator" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] text-red-400 border border-[#242628] mb-3">
            <ShieldAlert className="size-3.5" />
            Interactive Layer 7 Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
            Simulate Autonomous AI Attacks Live
          </h2>
          <p className="mt-3 text-[#797D86] text-sm sm:text-base">
            Click any scenario below to trigger a live simulation. See how Sevlex intercepts raw JSON-RPC traffic, arrests malicious payloads in &lt;0.5ms, and dispatches instant Slack SecOps cards.
          </p>
        </div>

        {/* Simulator Container */}
        <div className="rounded-3xl border border-[#242628] bg-[#0E0E12] shadow-2xl overflow-hidden">
          {/* Top Scenario Selector Strip */}
          <div className="p-3 sm:p-4 bg-[#0C0D0E] border-b border-[#242628] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#61646B] font-medium px-2">Select Threat Vector:</span>
              {(Object.keys(SCENARIOS) as AttackScenario[]).map((key) => {
                const s = SCENARIOS[key];
                const isActive = activeScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleTriggerScenario(key)}
                    className={`h-8 px-3.5 rounded-full text-xs font-medium font-mono transition flex items-center gap-2 cursor-pointer border ${
                      isActive
                        ? "border-white bg-white text-black font-semibold shadow-xs"
                        : "border-[#242628] bg-[#131415] text-[#C9CBCF] hover:border-[#303236] hover:text-white"
                    }`}
                  >
                    <span>{s.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleTriggerScenario(activeScenario)}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#34D59A] hover:bg-[#47D18C] text-black text-xs font-mono font-medium transition cursor-pointer"
            >
              <RotateCcw className={`size-3.5 ${isSimulating ? "animate-spin" : ""}`} />
              Re-Run Intercept
            </button>
          </div>

          {/* Live Wire Transmission Pipeline (Visual Protocol Flow) */}
          <div className="px-6 py-4 bg-[#0A0A0C] border-b border-[#242628] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Node 1: Client Runtime */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131415] border border-[#242628]">
                <ClientBrandIcon name={scenario.clientBrand} size="xs" className="size-4" />
                <span className="text-white font-medium">{scenario.client}</span>
              </div>

              {/* Wire Hop 1 */}
              <div className="flex items-center gap-1 text-[#61646B]">
                <span className="text-[10px] text-[#34D59A] animate-pulse">stdio / fd0</span>
                <span>───▶</span>
              </div>

              {/* Node 2: Sevlex L7 DPI */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#34D59A]/10 border border-[#34D59A]/30 text-[#34D59A]">
                <ShieldCheck className="size-4 shrink-0" />
                <span className="font-semibold">Sevlex L7 DPI ({scenario.latency})</span>
              </div>

              {/* Wire Hop 2 */}
              <div className="flex items-center gap-1 text-[#61646B]">
                <span>───▶</span>
                <span className="text-[10px] text-[#61646B]">pipe / fd1</span>
              </div>

              {/* Node 3: Target MCP Server */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                scenario.decision === "BLOCKED"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : scenario.decision === "CIRCUIT_BROKEN"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}>
                <Database className="size-3.5 shrink-0" />
                <span className="font-medium">{scenario.server}</span>
              </div>
            </div>

            {/* Wire Interception State Pill */}
            <div className="flex items-center gap-2">
              <span className="text-[#61646B] text-[11px]">Wire State:</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                scenario.decision === "BLOCKED"
                  ? "bg-red-950/40 border-red-500/40 text-red-300 animate-pulse"
                  : scenario.decision === "CIRCUIT_BROKEN"
                  ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                  : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              }`}>
                {scenario.decision === "BLOCKED"
                  ? "⚡ ARRESTED (0 BYTES FORWARDED)"
                  : scenario.decision === "CIRCUIT_BROKEN"
                  ? "⚡ CIRCUIT TRIPPED (COOLDOWN)"
                  : "✔ WIRE PASSTHROUGH (<0.15ms)"}
              </span>
            </div>
          </div>

          {/* Simulator Two-Column Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#242628]">
            {/* Left Column: Bidirectional Wire Packet Inspector (7 cols) */}
            <div className="lg:col-span-7 p-6 font-mono space-y-4">
              {/* Inspector Header & Sub-Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#242628]">
                <div className="flex items-center gap-1.5 bg-[#000000] p-1 rounded-full border border-[#242628]">
                  <button
                    onClick={() => setSimulatorTab("request")}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                      simulatorTab === "request"
                        ? "bg-white text-black font-semibold"
                        : "text-[#797D86] hover:text-white"
                    }`}
                  >
                    <Braces className="size-3" />
                    <span>Request (Ingress)</span>
                  </button>
                  <button
                    onClick={() => setSimulatorTab("response")}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                      simulatorTab === "response"
                        ? "bg-white text-black font-semibold"
                        : "text-[#797D86] hover:text-white"
                    }`}
                  >
                    <FileCode className="size-3" />
                    <span>Response (Egress)</span>
                  </button>
                  <button
                    onClick={() => setSimulatorTab("ast")}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                      simulatorTab === "ast"
                        ? "bg-[#34D59A] text-black font-semibold"
                        : "text-[#797D86] hover:text-white"
                    }`}
                  >
                    <GitBranch className="size-3" />
                    <span>AST Syntax Guard</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#61646B] font-mono">RPC: {scenario.rpcId}</span>
                  <button
                    onClick={() =>
                      copyPacket(
                        simulatorTab === "request"
                          ? scenario.payload
                          : simulatorTab === "response"
                          ? scenario.responsePayload
                          : scenario.astAnalysis.astTreeVisual
                      )
                    }
                    className="p-1.5 rounded-full text-[#797D86] hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                    title="Copy active payload"
                  >
                    {copiedPacket ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                  scenario.decision === "BLOCKED"
                    ? "bg-red-950/20 border-red-500/30 text-red-200"
                    : scenario.decision === "CIRCUIT_BROKEN"
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                    : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                }`}
              >
                {scenario.decision === "BLOCKED" ? (
                  <ShieldAlert className="size-5 text-red-400 shrink-0 mt-0.5" />
                ) : scenario.decision === "CIRCUIT_BROKEN" ? (
                  <Zap className="size-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="size-5 text-[#34D59A] shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs truncate">
                      {scenario.decision === "BLOCKED"
                        ? "ARRESTED AT LAYER 7 (ZERO DOWNSTREAM LEAK)"
                        : scenario.decision === "CIRCUIT_BROKEN"
                        ? "CIRCUIT BREAKER ENGAGED (RATE LIMITED)"
                        : "PASSED PARAMETER INSPECTION (EXECUTION PERMITTED)"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-[#34D59A] shrink-0">
                      {scenario.latency}
                    </span>
                  </div>
                  <p className="text-xs text-[#C9CBCF] mt-1">{scenario.ruleViolated}</p>
                </div>
              </div>

              {/* Tab 1: Request Ingress View */}
              {simulatorTab === "request" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#797D86]">
                    <span>stdio Ingress Wire Packet (tools/call):</span>
                    <span className="text-[#34D59A] font-semibold">{scenario.tool}</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#000000] border border-[#242628] text-xs text-[#C9CBCF] overflow-x-auto leading-relaxed shadow-inner max-h-[320px]">
                    <code>{scenario.payload}</code>
                  </pre>
                </div>
              )}

              {/* Tab 2: Response Egress View */}
              {simulatorTab === "response" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#797D86]">
                    <span>Synthesized Stdio Wire Egress (to Client):</span>
                    <span className={scenario.decision === "BLOCKED" ? "text-red-400 font-semibold" : "text-[#34D59A] font-semibold"}>
                      {scenario.decision === "BLOCKED" ? "JSON-RPC Error -32600" : "JSON-RPC Result 200"}
                    </span>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#000000] border border-[#242628] text-xs text-[#C9CBCF] overflow-x-auto leading-relaxed shadow-inner max-h-[320px]">
                    <code>{scenario.responsePayload}</code>
                  </pre>
                </div>
              )}

              {/* Tab 3: AST Deep Packet Inspection View */}
              {simulatorTab === "ast" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#141416] border border-[#242628]">
                      <span className="text-[#61646B] block text-[10px] uppercase">AST Node Type:</span>
                      <span className="text-white font-medium">{scenario.astAnalysis.statementType}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141416] border border-[#242628]">
                      <span className="text-[#61646B] block text-[10px] uppercase">Threat Class:</span>
                      <span className={`font-medium ${
                        scenario.decision === "BLOCKED" ? "text-red-400" : scenario.decision === "CIRCUIT_BROKEN" ? "text-amber-400" : "text-[#34D59A]"
                      }`}>
                        {scenario.astAnalysis.riskScore}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#797D86]">
                      <span>In-Flight AST Syntax Parsing Graph:</span>
                      <span className="text-[#34D59A]">Deep Packet Inspection</span>
                    </div>
                    <pre className="p-4 rounded-xl bg-[#000000] border border-[#242628] text-xs text-[#34D59A] overflow-x-auto leading-relaxed shadow-inner font-mono max-h-[220px]">
                      <code>{scenario.astAnalysis.astTreeVisual}</code>
                    </pre>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#797D86] leading-relaxed font-sans">
                {scenario.explanation}
              </p>
            </div>

            {/* Right Column: SecOps Alert & Merkle Audit Ledger (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-[#0C0D0E] flex flex-col justify-between space-y-6">
              <div>
                {/* Right Column Sub-Tabs */}
                <div className="flex items-center justify-between pb-3 border-b border-[#242628] mb-4">
                  <div className="flex items-center gap-1.5 bg-[#000000] p-1 rounded-full border border-[#242628]">
                    <button
                      onClick={() => setDispatchTab("slack")}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                        dispatchTab === "slack"
                          ? "bg-white text-black font-semibold"
                          : "text-[#797D86] hover:text-white"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getLogoDevUrl("slack.com", 64)}
                        alt="Slack"
                        className="size-3.5 object-contain shrink-0"
                      />
                      <span>Slack SecOps</span>
                    </button>
                    <button
                      onClick={() => setDispatchTab("merkle")}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                        dispatchTab === "merkle"
                          ? "bg-[#34D59A] text-black font-semibold"
                          : "text-[#797D86] hover:text-white"
                      }`}
                    >
                      <Hash className="size-3" />
                      <span>SOC 2 Merkle WAL</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[#61646B]">
                    {dispatchTab === "slack" ? "Live Webhook" : "SQLite WAL Mode"}
                  </span>
                </div>

                {/* Dispatch Tab 1: Slack Webhook Relay */}
                {dispatchTab === "slack" && (
                  <div className="rounded-2xl border border-[#242628] bg-[#131415] p-4 text-xs font-sans shadow-lg relative">
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Shield className="size-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-xs">Sevlex Security Bot</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                            APP
                          </span>
                          <span className="text-[11px] text-[#61646B] ml-auto">Just now</span>
                        </div>

                        <div className="mt-2.5 p-3 rounded-xl bg-[#000000] border border-[#242628] space-y-2">
                          <p className="font-medium text-white text-xs leading-snug">
                            {scenario.slackAlert.title}
                          </p>
                          <p className="text-[#94979E] text-[11px] leading-relaxed">
                            {scenario.slackAlert.details}
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#242628] text-[10px] font-mono text-[#797D86]">
                            <div>
                              <span className="text-[#61646B] block">User:</span>
                              <span className="text-blue-400 font-medium">@meetp (Staff Eng)</span>
                            </div>
                            <div>
                              <span className="text-[#61646B] block">Host Daemon:</span>
                              <span className="text-[#34D59A] font-medium">macbook-m3-corp</span>
                            </div>
                          </div>
                        </div>

                        {/* Slack Action Buttons */}
                        <div className="mt-3 flex items-center gap-2">
                          <button className="h-7 px-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-[11px] transition">
                            Quarantine Agent Session
                          </button>
                          <button className="h-7 px-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-[#C9CBCF] font-medium text-[11px] transition border border-[#242628]">
                            Open Ticket #8914
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dispatch Tab 2: Cryptographic Merkle WAL Ledger */}
                {dispatchTab === "merkle" && (
                  <div className="rounded-2xl border border-[#242628] bg-[#131415] p-4 text-xs font-mono shadow-lg space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242628]">
                      <span className="text-white font-medium flex items-center gap-2">
                        <FileCheck2 className="size-4 text-[#34D59A]" />
                        <span>Merkle Receipt #{scenario.merkleReceipt.blockIndex}</span>
                      </span>
                      <span className="text-[10px] text-[#34D59A] bg-[#34D59A]/10 border border-[#34D59A]/30 px-2 py-0.5 rounded-full font-bold">
                        NON-REPUDIATION VERIFIED
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <span className="text-[#61646B] block text-[10px] uppercase">Receipt ID:</span>
                        <code className="text-[#C9CBCF]">{scenario.merkleReceipt.receiptId}</code>
                      </div>
                      <div>
                        <span className="text-[#61646B] block text-[10px] uppercase">Previous Block Hash (H_prev):</span>
                        <code className="text-[#797D86] text-[10px] truncate block">{scenario.merkleReceipt.prevHash}</code>
                      </div>
                      <div>
                        <span className="text-[#61646B] block text-[10px] uppercase">SHA-256 Entry Hash:</span>
                        <code className="text-[#34D59A] text-[10px] truncate block">{scenario.merkleReceipt.entryHash}</code>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#242628]">
                        <div>
                          <span className="text-[#61646B] block text-[10px] uppercase">Actor Identity:</span>
                          <span className="text-white">{scenario.merkleReceipt.actor}</span>
                        </div>
                        <div>
                          <span className="text-[#61646B] block text-[10px] uppercase">Audit Ledger:</span>
                          <span className="text-[#34D59A]">SQLite WAL (local)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#000000] border border-[#242628] text-[10px] text-[#797D86]">
                      <span>Chain Integrity: </span>
                      <span className="text-white">SHA256(H_prev || payload) == {scenario.merkleReceipt.entryHash.slice(0, 16)}...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Guarantee */}
              <div className="p-3.5 rounded-full bg-[#131415] border border-[#242628] text-xs text-[#AFB1B6] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A]" /> SOC 2 Cryptographic Audit Sealed
                </span>
                <a href="/console" className="font-medium text-white underline hover:text-[#34D59A] flex items-center gap-1">
                  View in Console <ArrowRight className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DEVELOPER DOCUMENTATION & INTERACTIVE CLI WORKBENCH                    */}
      {/* ========================================================================= */}
      <section id="docs" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div id="terminal" className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-[#34D59A] mb-3">
            <Terminal className="size-3.5 text-[#34D59A]" />
            <span>DEVELOPER DOCUMENTATION &amp; QUICKSTART</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
            Zero-Config L7 Gateway CLI
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#797D86]">
            One command scans your host, transparently wraps downstream stdio MCP tools in Layer 7 zero-trust filters, and creates safe backups.
          </p>
        </div>
        <div className="rounded-2xl border border-[#242628] bg-[#0E0E12] shadow-2xl overflow-hidden">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0C0D0E] border-b border-[#242628]">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-red-500/80" />
              <div className="size-2.5 rounded-full bg-amber-500/80" />
              <div className="size-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-[#797D86] flex items-center gap-1.5">
                <Terminal className="size-3.5 text-[#34D59A]" /> sevlex-developer-gateway
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#000000] p-1 rounded-full border border-[#242628]">
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
                <p className="text-white font-medium">[SOC 2 Audit Engine] Performing mathematical non-repudiation audit...</p>
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
        <div className="mt-6 p-5 rounded-2xl border border-[#242628] bg-[#0E0E12] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#34D59A] shrink-0 mt-0.5">
              <FileCode className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Agent Manifest: llms.txt</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D59A]/10 text-[#34D59A] border border-[#34D59A]/20 font-bold uppercase">
                  Machine Standard
                </span>
              </div>
              <p className="text-xs text-[#797D86] mt-1 max-w-xl">
                Structured plain-text specification optimized for Claude Code, Cursor, Windsurf, and autonomous AI agents to ingest CLI commands without web scraping.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-[#000000] border border-[#242628] px-3 py-1.5 rounded-xl text-xs font-mono text-[#AFB1B6]">
              <span className="text-[#61646B]">$</span>
              <code>curl -s sevlex.com/llms.txt</code>
            </div>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/[0.08] transition shrink-0 cursor-pointer"
            >
              <span>View llms.txt</span>
              <ExternalLink size={12} className="text-[#797D86]" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. METRICS PROOF COUNTER (Neon Stark Typography)                          */}
      {/* ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-y border-[#242628] my-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-normal text-white tracking-tight font-mono">
              142,394+
            </div>
            <div className="mt-1 text-xs text-[#797D86] uppercase tracking-wider font-medium">
              Tool Calls Inspected
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-normal text-[#34D59A] tracking-tight font-mono">
              &lt;0.1ms
            </div>
            <div className="mt-1 text-xs text-[#797D86] uppercase tracking-wider font-medium">
              Gateway Overhead
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-normal text-white tracking-tight font-mono">
              100%
            </div>
            <div className="mt-1 text-xs text-[#797D86] uppercase tracking-wider font-medium">
              Zero Data Exfiltration
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-normal text-[#AFB1B6] tracking-tight font-mono">
              30ms
            </div>
            <div className="mt-1 text-xs text-[#797D86] uppercase tracking-wider font-medium">
              Auto-Healing Daemon
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CORE SECURITY ENGINES BENTO GRID                                       */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Enterprise Governance Suite
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Comprehensive Defense Against Autonomous Agent Risks
          </p>
          <p className="mt-4 text-[#797D86] text-sm sm:text-base">
            Everything SecOps and CISOs need to safely embrace agentic AI without risking source code theft or database corruption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: ToolGuard */}
          <SpotlightCard className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">ToolGuard™ Parameter Deep Packet Inspection</h3>
                <p className="text-xs text-[#797D86] font-mono">In-Flight AST &amp; Regex Sanitization</p>
              </div>
            </div>
            <p className="text-sm text-[#C9CBCF] leading-relaxed mb-6">
              Blocks catastrophic command injections before execution. Automatically arrests destructive SQL commands (<code className="text-red-400 font-mono">DROP TABLE</code>, <code className="text-red-400 font-mono">TRUNCATE</code>), arbitrary shell executions (<code className="text-red-400 font-mono">rm -rf /</code>), and directory traversals (<code className="text-red-400 font-mono">../../.ssh/id_rsa</code>).
            </p>
            <div className="bg-[#000000] border border-[#242628] rounded-xl p-3 font-mono text-xs text-[#797D86]">
              <span className="text-red-400 font-semibold">[BLOCKED]</span> JSON-RPC tools/call -&gt; postgres:execute_query &#123; query: &quot;DROP TABLE users;&quot; &#125;
            </div>
          </SpotlightCard>

          {/* Bento Card 2: AgentGuard */}
          <SpotlightCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-amber-400">
                <Zap className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">AgentGuard™ Circuit Breaker</h3>
                <p className="text-xs text-[#797D86] font-mono">Loop &amp; Velocity Limiter</p>
              </div>
            </div>
            <p className="text-sm text-[#C9CBCF] leading-relaxed mb-4">
              Halts runaway hallucination loops when agents retry identical failures 3 consecutive times or exceed 25 calls per 30 seconds.
            </p>
            <div className="bg-[#000000] border border-[#242628] rounded-xl p-3 font-mono text-xs text-amber-400">
              Tripped: Error -32002 Agent Velocity Exceeded
            </div>
          </SpotlightCard>

          {/* Bento Card 3: In-Flight Output DLP */}
          <SpotlightCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-purple-400">
                <Eye className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">In-Flight Output DLP</h3>
                <p className="text-xs text-[#797D86] font-mono">Microsecond Redaction</p>
              </div>
            </div>
            <p className="text-sm text-[#C9CBCF] leading-relaxed mb-4">
              Scrubs high-entropy AWS access keys, Stripe tokens, GitHub PATs, and SSNs from downstream MCP responses before the LLM ingests them.
            </p>
            <div className="bg-[#000000] border border-[#242628] rounded-xl p-3 font-mono text-xs text-purple-300">
              AKIAIOSFODNN7EXAMPLE ➔ [REDACTED_AWS_KEY]
            </div>
          </SpotlightCard>

          {/* Bento Card 4: SOC 2 Merkle Audit Chain */}
          <SpotlightCard id="compliance" className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A]">
                <FileCheck2 className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">SOC 2 Cryptographic Merkle Hash Chain</h3>
                <p className="text-xs text-[#797D86] font-mono">Immutable Non-Repudiation</p>
              </div>
            </div>
            <p className="text-sm text-[#C9CBCF] leading-relaxed mb-4">
              Every audit receipt in SQLite WAL mode is mathematically bound to its predecessor: <code className="text-[#34D59A] font-mono">entry_hash = SHA256(prev_hash || receipt)</code>. Any alteration or deletion instantly breaks the cryptographic chain.
            </p>
            <div className="bg-[#000000] border border-[#242628] rounded-xl p-3 font-mono text-xs text-[#797D86] flex items-center justify-between">
              <span>H(prev || id || user || tool || status)</span>
              <span className="text-[#34D59A] font-semibold font-mono">100% Cryptographically Valid</span>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SOCIAL PROOF & SCALE GRID (Neon-Style Three-Column Grid)              */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#34D59A] mb-3">
              WHERE DEVELOPERS BUILD
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Local Zero-Friction Shield</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Run <code className="text-[#C9CBCF] font-mono">npx sevlex init</code> to instantly wrap Cursor and Claude Desktop. No accounts, no credit cards, 100% local stdio inspection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-400 mb-3">
              WHERE TEAMS COLLABORATE
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Shared Policy Governance</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Sync global allowlists and blocklists across your engineering team. Receive real-time Slack and PagerDuty alerts the millisecond an agent attacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-purple-400 mb-3">
              WHERE ENTERPRISES COMPLY
            </div>
            <h4 className="text-lg font-medium text-white mb-2">SOC 2 Mathematical Proofs</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Cryptographically seal every autonomous agent interaction. Prove to enterprise compliance auditors that private credentials never left developer laptops.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CTA BOTTOM BANNER (Neon Pill Standards)                               */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-[#242628] bg-[#0C0D0E] p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#34D59A]/10 blur-[90px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight relative z-10">
            Shield Your AI Agents in 10 Seconds
          </h2>
          <p className="mt-4 text-[#797D86] max-w-xl mx-auto text-sm sm:text-base relative z-10">
            No Docker, no kernel drivers, no root permissions. Run one command to wrap MCP servers across Cursor, Claude Desktop, and Antigravity.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            {/* Install pill */}
            <div className="inline-flex items-center gap-3 bg-[#131415] border border-[#242628] rounded-full px-5 py-2.5">
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
              href="/console?auth=github"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-6 tracking-tight font-medium bg-[#18191B] border border-[#242628] text-white hover:bg-[#242628] text-xs gap-2"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Sign Up with GitHub</span>
            </a>

            {/* SecOps Console Primary Pill */}
            <a
              href="/console"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium bg-white text-black hover:bg-[#E4E5E7] text-xs gap-2"
            >
              <span>Sign In to SecOps Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER                                                               */}
      {/* ========================================================================= */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#242628] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#797D86]">
        <div className="flex items-center gap-3 text-[#94979E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sevlex-brand-horizontal.png"
            alt="Sevlex"
            className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition"
          />
          <span>&copy; 2026 Sevlex Security Inc. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href="#docs" className="hover:text-white transition">Documentation</a>
          <a href="#agents" className="hover:text-white transition">Agent Setup</a>
          <a href="#simulator" className="hover:text-white transition">Exploit Simulator</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="/console" className="hover:text-white transition">Console</a>
          <a href="/llms.txt" target="_blank" className="hover:text-white transition font-mono text-[11px]">llms.txt</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className="hover:text-white transition">Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

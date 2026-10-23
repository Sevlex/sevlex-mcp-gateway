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
} from "lucide-react";

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
  tool: string;
  payload: string;
  decision: "BLOCKED" | "ALLOWED" | "CIRCUIT_BROKEN";
  latency: string;
  ruleViolated: string;
  explanation: string;
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
    tool: "postgres_server:execute_query",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
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
    decision: "BLOCKED",
    latency: "0.42ms",
    ruleViolated: "ToolGuard™ AST DDL Block: DropTableStatement Detected",
    explanation:
      "Sevlex Layer 7 DPI parsed the SQL AST in-flight before transmission to Postgres. The query was dropped with zero database impact.",
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
    tool: "filesystem:read_file",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
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
    decision: "BLOCKED",
    latency: "0.38ms",
    ruleViolated: "ToolGuard™ Private Credential Access Policy",
    explanation:
      "Access to private cloud credentials and .env paths is strictly quarantined. The gateway refused the stdio pipe request.",
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
    tool: "github:list_issues",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
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
    decision: "CIRCUIT_BROKEN",
    latency: "0.19ms",
    ruleViolated: "AgentGuard™ Velocity Breaker: 25 calls / 30s threshold exceeded",
    explanation:
      "Agent entered a recursive hallucination retry loop. Sevlex tripped the circuit breaker to prevent token bankruptcy and API throttling.",
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
    tool: "postgres_server:execute_query",
    payload: JSON.stringify(
      {
        jsonrpc: "2.0",
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
    decision: "ALLOWED",
    latency: "0.12ms",
    ruleViolated: "None — Clean SELECT statement passed parameter inspection",
    explanation:
      "Safe read-only operations pass with sub-millisecond wire overhead (<0.15ms). Developer flow experiences zero disruption.",
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

  const activeAgent = AGENT_STATION_DATA[selectedAgent];

  const copyAgentPrompt = () => {
    navigator.clipboard.writeText(activeAgent.prompt);
    setCopiedAgentPrompt(true);
    setTimeout(() => setCopiedAgentPrompt(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#F8FAFC] font-sans selection:bg-[#34D59A]/30 selection:text-white overflow-x-hidden">
      {/* Precision hairline grid backdrop */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#131415_1px,transparent_1px),linear-gradient(to_bottom,#131415_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Subtle restrained atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.08),transparent_70%)] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT RIBBON (Exact Neon Structure)                        */}
      {/* ========================================================================= */}
      <aside className="group relative z-50 flex h-9 w-full items-center justify-center border-b border-[#242628] bg-[#0C0D0E] px-4 text-xs font-medium text-[#C9CBCF] transition-colors hover:text-white">
        <a
          href="https://github.com/Sevlex/sevlex-mcp-gateway"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2"
        >
          <span className="size-1.5 rounded-full bg-[#34D59A] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#34D59A]">
            Sevlex v1.0.5 Live
          </span>
          <span className="text-[#494B50] hidden sm:inline">•</span>
          <span className="hidden sm:inline">Zero-Trust Layer 7 MCP Firewall for Cursor, Claude Desktop & Coding Agents</span>
          <span className="sm:hidden">Zero-Trust Layer 7 MCP Firewall</span>
          <ChevronRight className="ml-1 size-3.5 text-[#797D86] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
        </a>
      </aside>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION HEADER                                                     */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-40 bg-[#000000]/85 backdrop-blur-md border-b border-[#242628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo & Version Pill */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sevlex-brand-horizontal.png"
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
              />
            </a>
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#18191B] border border-[#242628] text-[#34D59A] font-semibold">
              v1.0.5
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-[#94979E]">
            <a href="#agents" className="hover:text-white transition-colors flex items-center gap-1.5 text-white font-medium">
              <Sparkles className="size-3 text-[#34D59A]" /> Built for Agents
            </a>
            <a href="#simulator" className="hover:text-white transition-colors">
              Exploit Simulator
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Security Engines
            </a>
            <a href="#terminal" className="hover:text-white transition-colors">
              CLI Gateway
            </a>
            <a href="#compliance" className="hover:text-white transition-colors">
              SOC 2 Merkle
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

          {/* Interactive Quickstart Command Bar & CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {/* Demo command snippet pill */}
            <div className="inline-flex items-center gap-3 bg-[#131415] border border-[#34D59A]/30 rounded-full px-5 py-2.5 shadow-xl">
              <span className="text-[#61646B] font-mono text-xs select-none">$</span>
              <code className="text-xs font-mono text-[#34D59A] font-medium tracking-wide">
                npx sevlex demo
              </code>
              <button
                onClick={copyDemo}
                className="p-1 rounded-full text-[#797D86] hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                title="Copy demo command"
              >
                {copiedDemo ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            {/* Init command snippet pill */}
            <div className="inline-flex items-center gap-3 bg-[#131415] border border-[#242628] rounded-full px-5 py-2.5 shadow-xl">
              <span className="text-[#61646B] font-mono text-xs select-none">$</span>
              <code className="text-xs font-mono text-[#C9CBCF] font-medium tracking-wide">
                npx sevlex init
              </code>
              <button
                onClick={copyInstall}
                className="p-1 rounded-full text-[#797D86] hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                title="Copy init command"
              >
                {copied ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            {/* Primary Console Pill */}
            <a
              href="/console"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium bg-white text-black hover:bg-[#E4E5E7] text-sm gap-2"
            >
              <span>Launch SecOps Console</span>
              <ArrowRight className="size-4" />
            </a>

            {/* Glass Docs Pill */}
            <a
              href="/llms.txt"
              target="_blank"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-11 px-7 tracking-tight font-medium bg-white/[0.03] border border-[#303236] text-white hover:border-[#61646B] hover:bg-white/[0.06] text-sm gap-2"
            >
              <span>Read llms.txt</span>
              <ExternalLink className="size-3.5 text-[#797D86]" />
            </a>
          </div>

          {/* Client Ecosystem Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#797D86]">
            <span className="font-mono text-[11px] text-[#61646B] uppercase tracking-wider mr-1">Zero-Config Shields:</span>
            {[
              { name: "Cursor IDE", icon: "/cursor-icon.svg" },
              { name: "Claude Desktop", icon: "/claude-icon.svg" },
              { name: "Windsurf", icon: "/windsurf-icon.svg" },
              { name: "Antigravity", icon: "/antigravity-icon.png" },
              { name: "Node / TS SDK", icon: "/nodejs-icon.svg" },
            ].map((client) => (
              <span
                key={client.name}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131415] border border-[#242628] text-[#C9CBCF] text-xs font-medium"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.icon} alt={client.name} className="size-3.5 object-contain" />
                <span>{client.name}</span>
                <span className="size-1 rounded-full bg-[#34D59A]" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. READY FOR CODING AGENTS (Neon-Grade Bento Section)                     */}
      {/* ========================================================================= */}
      <section id="agents" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        {/* Section Header */}
        <header className="min-w-0 mb-12">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-pretty text-[#797D86] max-w-4xl">
            <span className="text-white font-medium">Ready for coding agents.</span> Intercept and secure MCP tools the way you inspect network packets, with full access via CLI, SDK, and 1-click prompts.
          </h2>
        </header>

        {/* 3 Bento Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col gap-2.5 p-6 rounded-2xl bg-[#0E0E12] border border-[#242628] transition-colors hover:border-[#303236]">
            <div className="size-8 rounded-full bg-[#34D59A]/10 border border-[#34D59A]/20 flex items-center justify-center text-[#34D59A] mb-1">
              <Zap className="size-4" />
            </div>
            <h3 className="text-base font-medium tracking-tight text-white">Instant Intercept</h3>
            <p className="text-sm font-normal text-[#797D86] leading-relaxed">
              Infrastructure that responds instantly. Injects into stdio in &lt;0.1ms without proxy daemons, background docker containers, or iptables routing.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 p-6 rounded-2xl bg-[#0E0E12] border border-[#242628] transition-colors hover:border-[#303236]">
            <div className="size-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1">
              <ShieldCheck className="size-4" />
            </div>
            <h3 className="text-base font-medium tracking-tight text-white">AST Parameter Guard</h3>
            <p className="text-sm font-normal text-[#797D86] leading-relaxed">
              Deep packet inspection parses SQL ASTs and shell parameters in-flight. Destructive operations (<code className="text-red-400 font-mono text-xs">DROP TABLE</code>, <code className="text-red-400 font-mono text-xs">rm -rf</code>) are arrested before reaching the downstream server.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 p-6 rounded-2xl bg-[#0E0E12] border border-[#242628] transition-colors hover:border-[#303236]">
            <div className="size-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-1">
              <RotateCcw className="size-4" />
            </div>
            <h3 className="text-base font-medium tracking-tight text-white">Safe Automation & Rollback</h3>
            <p className="text-sm font-normal text-[#797D86] leading-relaxed">
              Fast development requires fast recovery. Every configuration change automatically saves a 100% reversible <code className="text-[#34D59A] font-mono text-xs">*.sevlex.bak</code> backup snapshot.
            </p>
          </div>
        </div>

        {/* 1-Click Interactive Agent Station Container */}
        <div className="rounded-3xl border border-[#242628] bg-[#0C0D0E] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#242628]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] text-[#34D59A] border border-[#242628] mb-2">
                <Bot className="size-3.5" /> 1-Click Machine Setup
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                Set Up with Your AI Agent in 1 Click
              </h3>
              <p className="text-xs sm:text-sm text-[#797D86] mt-1 max-w-2xl leading-relaxed">
                Don&apos;t configure JSON files manually. Select your coding assistant, copy the prompt, and paste it into your agent chat. Sevlex executes non-interactively with safe backups.
              </p>
            </div>

            <a
              href="/llms.txt"
              target="_blank"
              className="h-9 px-4 rounded-full border border-[#242628] bg-[#131415] hover:bg-[#18191B] text-xs font-mono text-[#AFB1B6] hover:text-white transition flex items-center gap-2 shrink-0"
            >
              <span>llms.txt Machine Manifest</span>
              <ExternalLink size={12} className="text-[#797D86]" />
            </a>
          </div>

          {/* Agent Selector Tab Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pb-2">
            {(Object.keys(AGENT_STATION_DATA) as AgentStationId[]).map((key) => {
              const item = AGENT_STATION_DATA[key];
              const isSelected = selectedAgent === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAgent(key)}
                  className={`h-9 px-4 rounded-full text-xs font-medium transition flex items-center gap-2.5 cursor-pointer border ${
                    isSelected
                      ? "border-white bg-white text-black"
                      : "border-[#242628] bg-[#131415] text-[#94979E] hover:text-white hover:border-[#303236]"
                  }`}
                >
                  {item.iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.iconSrc} alt={item.name} className="size-3.5 object-contain" />
                  ) : (
                    <Bot className="size-3.5 text-[#34D59A]" />
                  )}
                  <span>{item.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-black/10 text-black font-semibold"
                        : "bg-white/[0.05] text-[#61646B]"
                    }`}
                  >
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Two-Column Interactive Body: Prompt Station + Simulated Terminal */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Prompt Station (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Meta details bar */}
                <div className="flex items-center justify-between text-xs text-[#797D86]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-[#34D59A]" />
                    <span className="font-medium text-white">Paste into {activeAgent.name}:</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#797D86] bg-[#131415] px-2.5 py-1 rounded-full border border-[#242628]">
                    Target Config: <span className="text-white">{activeAgent.configFile}</span>
                  </span>
                </div>

                {/* Prompt Card */}
                <div className="relative group bg-[#000000] border border-[#242628] rounded-2xl p-4 text-xs font-mono text-[#C9CBCF] leading-relaxed shadow-inner">
                  <div className="pr-4 pb-12 sm:pb-10">
                    <span className="text-[#61646B] select-none">&ldquo;</span>
                    <span className="text-white font-medium">{activeAgent.prompt}</span>
                    <span className="text-[#61646B] select-none">&rdquo;</span>
                  </div>

                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      onClick={copyAgentPrompt}
                      className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-9 px-4 tracking-tight font-medium bg-white text-black hover:bg-[#E4E5E7] text-xs gap-1.5"
                    >
                      {copiedAgentPrompt ? <Check size={13} className="text-[#34D59A]" /> : <Copy size={13} />}
                      {copiedAgentPrompt ? `Copied for ${activeAgent.name}!` : `Copy Prompt for ${activeAgent.name}`}
                    </button>
                  </div>
                </div>

                {/* Direct CLI fallback */}
                <div className="flex items-center justify-between bg-[#131415] border border-[#242628] rounded-full px-4 py-2 text-xs font-mono text-[#797D86]">
                  <div className="flex items-center gap-2 truncate">
                    <Terminal className="size-3.5 text-[#34D59A] shrink-0" />
                    <span className="text-[#61646B] select-none">Direct execution:</span>
                    <code className="text-[#C9CBCF] font-medium truncate">{activeAgent.cliCommand}</code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeAgent.cliCommand);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1 rounded hover:bg-white/[0.08] text-[#797D86] hover:text-white transition cursor-pointer shrink-0 ml-2"
                    title="Copy CLI command"
                  >
                    {copied ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* 4 Agent Guarantees Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-[#797D86] font-mono">
                <div className="flex items-center gap-1.5 bg-[#131415] border border-[#242628] p-2 rounded-xl">
                  <CheckCircle2 size={13} className="text-[#34D59A] shrink-0" />
                  <span>Non-Interactive (-y)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#131415] border border-[#242628] p-2 rounded-xl">
                  <CheckCircle2 size={13} className="text-[#34D59A] shrink-0" />
                  <span>Safe Backup (*.bak)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#131415] border border-[#242628] p-2 rounded-xl">
                  <CheckCircle2 size={13} className="text-[#34D59A] shrink-0" />
                  <span>1-Command Restore</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#131415] border border-[#242628] p-2 rounded-xl">
                  <CheckCircle2 size={13} className="text-[#34D59A] shrink-0" />
                  <span>--json Machine Mode</span>
                </div>
              </div>
            </div>

            {/* Right Column: Simulated AI Agent Execution Trace (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-[#242628] bg-[#000000] overflow-hidden flex flex-col font-mono text-xs shadow-2xl">
              {/* Window Bar */}
              <div className="bg-[#0C0D0E] px-3.5 py-2.5 border-b border-[#242628] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-red-500/80 inline-block" />
                    <span className="size-2 rounded-full bg-amber-500/80 inline-block" />
                    <span className="size-2 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] text-[#797D86] font-medium ml-2">
                    agent-trace ({activeAgent.id})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#34D59A] bg-[#34D59A]/10 border border-[#34D59A]/20 px-2.5 py-0.5 rounded-full font-bold">
                  <span className="size-1.5 rounded-full bg-[#34D59A] animate-pulse" />
                  <span>Machine Execution</span>
                </div>
              </div>

              {/* Log Stream */}
              <div className="p-4 space-y-2.5 flex-1 text-[11px] leading-relaxed overflow-y-auto max-h-[260px]">
                {activeAgent.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={`${log.color} font-bold shrink-0 select-none`}>{log.tag}</span>
                    <span className="text-[#C9CBCF]">
                      {log.text}{" "}
                      {log.highlight && <span className={`${log.color} font-bold`}>{log.highlight}</span>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Terminal Footer */}
              <div className="bg-[#0C0D0E] px-3.5 py-2 border-t border-[#242628] flex items-center justify-between text-[10px] text-[#61646B]">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A]" />
                  <span>0 user prompts needed</span>
                </span>
                <span className="text-[#797D86] font-mono">AST overhead: &lt;0.5ms</span>
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
                        ? "border-white bg-white text-black font-semibold"
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

          {/* Simulator Two-Column Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#242628]">
            {/* Left Column: Intercepted JSON-RPC Wire Traffic (7 cols) */}
            <div className="lg:col-span-7 p-6 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#242628]">
                <div className="flex items-center gap-2 text-xs text-[#797D86]">
                  <Terminal className="size-3.5 text-[#34D59A]" />
                  <span>Client Ingress:</span>
                  <span className="text-white font-medium">{scenario.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#61646B]">Overhead:</span>
                  <span className="text-[#34D59A] font-bold text-xs">{scenario.latency}</span>
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
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">
                      {scenario.decision === "BLOCKED"
                        ? "ARRESTED AT LAYER 7 (ZERO DOWNSTREAM LEAK)"
                        : scenario.decision === "CIRCUIT_BROKEN"
                        ? "CIRCUIT BREAKER ENGAGED (RATE LIMITED)"
                        : "PASSED PARAMETER INSPECTION (EXECUTION PERMITTED)"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono">
                      {scenario.latency}
                    </span>
                  </div>
                  <p className="text-xs text-[#C9CBCF] mt-1">{scenario.ruleViolated}</p>
                </div>
              </div>

              {/* Raw JSON-RPC Code Frame */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#797D86]">
                  <span>Intercepted stdio Wire Packet (tools/call):</span>
                  <span className="text-[#34D59A]">{scenario.tool}</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#000000] border border-[#242628] text-xs text-[#C9CBCF] overflow-x-auto leading-relaxed shadow-inner">
                  <code>{scenario.payload}</code>
                </pre>
              </div>

              <p className="text-xs text-[#797D86] leading-relaxed font-sans">
                {scenario.explanation}
              </p>
            </div>

            {/* Right Column: Simulated Live Slack SecOps Dispatch (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-[#0C0D0E] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#242628] mb-4">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg"
                      alt="Slack"
                      className="size-3.5 invert opacity-80"
                    />
                    <span className="text-xs font-medium text-white font-mono">
                      {scenario.slackAlert.channel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#61646B]">Live Webhook Relay</span>
                </div>

                {/* Slack Message Card */}
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
      {/* 6. LIVE INTERACTIVE TERMINAL SECTION                                      */}
      {/* ========================================================================= */}
      <section id="terminal" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="flex items-center gap-6">
          <a href="#agents" className="hover:text-white transition">Agent Setup</a>
          <a href="#simulator" className="hover:text-white transition">Exploit Simulator</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="/console" className="hover:text-white transition">Console</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className="hover:text-white transition">Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

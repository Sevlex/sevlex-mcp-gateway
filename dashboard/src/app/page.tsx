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

// Interactive Spotlight Card with mouse-following radial gradient
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.12)",
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
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0D17] p-6 shadow-xl transition-all duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
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

  const [copiedAgentPrompt, setCopiedAgentPrompt] = useState(false);
  const copyAgentPrompt = () => {
    navigator.clipboard.writeText(
      "Install and verify Sevlex Layer 7 Zero-Trust MCP Firewall. Run 'npx sevlex init' to automatically discover and wrap my MCP servers in Cursor, Claude Desktop, and Windsurf, then run 'npx sevlex demo' to verify sub-3ms AST parameter interception."
    );
    setCopiedAgentPrompt(true);
    setTimeout(() => setCopiedAgentPrompt(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#08080C] text-zinc-100 font-sans selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="fixed top-2/3 -left-40 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-[#08080C]/85 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sevlex-brand-horizontal.png"
                alt="Sevlex"
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(59,130,246,0.25)] transition group-hover:brightness-110"
              />
            </a>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              v1.0.5
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#simulator" className="hover:text-white transition-colors flex items-center gap-1.5 text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Exploit Simulator
            </a>
            <a href="#features" className="hover:text-white transition-colors">Security Engines</a>
            <a href="#terminal" className="hover:text-white transition-colors">CLI Gateway</a>
            <a href="#compliance" className="hover:text-white transition-colors">SOC 2 Merkle Chain</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition"
            >
              <Code2 className="w-3.5 h-3.5 text-zinc-400" /> GitHub
            </a>
            <a
              href="/console"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/25"
            >
              SecOps Console <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8 shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sevlex v1.0.5 Live: Sub-3ms Zero-Trust AST Interception for All MCP Clients</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Zero-Trust Security for AI Agents.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Stop Autonomous Data Exfiltration.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Transparently wraps stdio and SSE JSON-RPC traffic between Cursor, Claude Desktop, and downstream MCP servers.
            Sub-millisecond parameter deep packet inspection, in-flight secret redaction, and cryptographic SOC 2 audit receipts.
          </p>

          {/* Quickstart Command Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-3 bg-[#111118] border border-emerald-500/40 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md">
              <span className="text-zinc-500 font-mono text-sm select-none">$</span>
              <code className="text-sm font-mono text-emerald-400 font-bold tracking-wide">
                npx sevlex demo
              </code>
              <button
                onClick={copyDemo}
                className="ml-3 p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 transition cursor-pointer"
                title="Copy demo command"
              >
                {copiedDemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3 bg-[#111118] border border-white/[0.12] rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md">
              <span className="text-zinc-500 font-mono text-sm select-none">$</span>
              <code className="text-sm font-mono text-blue-400 font-bold tracking-wide">
                npx sevlex init
              </code>
              <button
                onClick={copyInstall}
                className="ml-3 p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 transition cursor-pointer"
                title="Copy install command"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <a
              href="/console"
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/25"
            >
              Open SecOps Console <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Supported AI Clients with Official Brand Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
            <span className="text-zinc-500 font-mono">Zero-Config Shields:</span>
            {[
              { name: "Cursor IDE", icon: "/cursor-icon.svg" },
              { name: "Claude Desktop", icon: "/claude-icon.svg" },
              { name: "Windsurf", icon: "/windsurf-icon.svg" },
              { name: "Antigravity", icon: "/antigravity-icon.png" },
              { name: "Node / TypeScript", icon: "/nodejs-icon.svg" },
            ].map((client) => (
              <span
                key={client.name}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-xs font-medium backdrop-blur-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.icon} alt={client.name} className="w-4 h-4 object-contain" />
                <span>{client.name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AI AGENT-FRIENDLY SETUP (1-Click Prompt for Claude Code, Cursor, Windsurf) */}
      {/* ========================================================================= */}
      <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-500/25 bg-gradient-to-b from-blue-950/20 via-[#0E0D17] to-[#0A0910] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <Bot className="w-3.5 h-3.5" /> 100% AI Agent-Native Setup
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Using Claude Code, Cursor, or Windsurf?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Don&apos;t run manual shell commands yourself. Paste this prompt directly into your AI coding assistant. Sevlex uses non-destructive backups (<code className="text-blue-400 font-mono">*.sevlex.bak</code>) and non-interactive machine execution.
              </p>
            </div>

            <a
              href="/llms.txt"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition flex items-center gap-1.5 shrink-0"
            >
              <span>llms.txt Manifest</span>
              <ExternalLink size={12} className="text-blue-400" />
            </a>
          </div>

          {/* Prompt Card with 1-Click Copy */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Copy &amp; Paste into your AI Agent:
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Universal Prompt for Cursor / Claude / Windsurf</span>
            </div>

            <div className="relative group bg-[#060609] border border-white/[0.12] rounded-2xl p-4 text-xs font-mono text-zinc-200 leading-relaxed shadow-inner">
              <code className="block pr-28 text-[11px] sm:text-xs text-blue-300">
                Install and verify Sevlex Layer 7 Zero-Trust MCP Firewall. Run &apos;npx sevlex init&apos; to automatically discover and wrap my MCP servers in Cursor, Claude Desktop, and Windsurf, then run &apos;npx sevlex demo&apos; to verify sub-3ms AST parameter interception.
              </code>

              <button
                onClick={copyAgentPrompt}
                className="absolute right-3 top-3 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                {copiedAgentPrompt ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                {copiedAgentPrompt ? "Copied Prompt!" : "Copy Prompt"}
              </button>
            </div>

            {/* 4 Agent Guarantees Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>Non-Interactive (-y)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>Safe Backup (*.bak)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>1-Command Restore</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>--json Output Mode</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE IN-BROWSER EXPLOIT SIMULATOR                                  */}
      {/* ========================================================================= */}
      <section id="simulator" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            Interactive Layer 7 Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simulate Autonomous AI Attacks Live
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Click any scenario below to trigger a live simulation. See how Sevlex intercepts raw JSON-RPC traffic, arrests malicious payloads in &lt;0.5ms, and dispatches instant Slack SecOps cards.
          </p>
        </div>

        {/* Simulator Container */}
        <div className="rounded-3xl border border-white/[0.12] bg-[#0E0D17] shadow-2xl overflow-hidden">
          {/* Top Scenario Selector Strip */}
          <div className="p-3 sm:p-4 bg-[#141322] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 font-semibold px-2">Select Threat Vector:</span>
              {(Object.keys(SCENARIOS) as AttackScenario[]).map((key) => {
                const s = SCENARIOS[key];
                const isActive = activeScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleTriggerScenario(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400"
                        : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] border border-white/[0.06]"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
              Re-Run Intercept
            </button>
          </div>

          {/* Simulator Two-Column Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            {/* Left Column: Intercepted JSON-RPC Wire Traffic (7 cols) */}
            <div className="lg:col-span-7 p-6 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Client Ingress:</span>
                  <span className="text-white font-semibold">{scenario.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500">Overhead:</span>
                  <span className="text-emerald-400 font-bold text-xs">{scenario.latency}</span>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                  scenario.decision === "BLOCKED"
                    ? "bg-red-950/30 border-red-500/30 text-red-200"
                    : scenario.decision === "CIRCUIT_BROKEN"
                    ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                    : "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                }`}
              >
                {scenario.decision === "BLOCKED" ? (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : scenario.decision === "CIRCUIT_BROKEN" ? (
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
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
                  <p className="text-xs text-zinc-300 mt-1">{scenario.ruleViolated}</p>
                </div>
              </div>

              {/* Raw JSON-RPC Code Frame */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Intercepted stdio Wire Packet (tools/call):</span>
                  <span className="text-blue-400">{scenario.tool}</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#090810] border border-white/[0.08] text-xs text-zinc-200 overflow-x-auto leading-relaxed shadow-inner">
                  <code>{scenario.payload}</code>
                </pre>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {scenario.explanation}
              </p>
            </div>

            {/* Right Column: Simulated Live Slack SecOps Dispatch (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-[#0B0A13] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg"
                      alt="Slack"
                      className="w-4 h-4 invert opacity-80"
                    />
                    <span className="text-xs font-bold text-white font-mono">
                      {scenario.slackAlert.channel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Live Webhook Relay</span>
                </div>

                {/* Slack Message Card */}
                <div className="rounded-2xl border border-white/[0.1] bg-[#141320] p-4 text-xs font-sans shadow-lg relative">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">Sevlex Security Bot</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                          APP
                        </span>
                        <span className="text-[11px] text-zinc-500 ml-auto">Just now</span>
                      </div>

                      <div className="mt-2.5 p-3 rounded-xl bg-[#0A0910] border border-white/[0.06] space-y-2">
                        <p className="font-bold text-white text-xs leading-snug">
                          {scenario.slackAlert.title}
                        </p>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          {scenario.slackAlert.details}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-400">
                          <div>
                            <span className="text-zinc-500 block">Authenticated User:</span>
                            <span className="text-blue-400 font-semibold">@meetp (Staff Eng)</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Host Daemon:</span>
                            <span className="text-emerald-400 font-semibold">macbook-m3-corp</span>
                          </div>
                        </div>
                      </div>

                      {/* Slack Action Buttons */}
                      <div className="mt-3 flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition shadow-xs">
                          Quarantine Agent Session
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-zinc-200 font-medium text-[11px] transition border border-white/[0.08]">
                          Open Ticket #8914
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> SOC 2 Evidence Automatically Sealed
                </span>
                <a href="/console" className="font-semibold underline hover:text-white flex items-center gap-1">
                  View in Console <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Terminal Section */}
      <section id="terminal" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.12] bg-[#0E0D17] shadow-2xl overflow-hidden">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#141322] border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" /> sevlex-developer-gateway
              </span>
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.05]">
              <button
                onClick={() => setTerminalTab("demo")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                  terminalTab === "demo"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex demo
              </button>
              <button
                onClick={() => setTerminalTab("init")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                  terminalTab === "init"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex init
              </button>
              <button
                onClick={() => setTerminalTab("status")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                  terminalTab === "status"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex status
              </button>
              <button
                onClick={() => setTerminalTab("verify")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                  terminalTab === "verify"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex verify
              </button>
            </div>
          </div>

          {/* Terminal Output Body */}
          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[260px] text-zinc-300">
            {terminalTab === "demo" && (
              <div className="space-y-1.5">
                <p className="text-zinc-500">$ npx sevlex demo</p>
                <p className="text-blue-400 font-semibold">[Sevlex Demo] Testing Layer 7 Zero-Trust Interception &amp; AST Parameter Rules...</p>
                <p className="text-zinc-400">TEST 1: Autonomous Agent runs legitimate Read Query (SELECT id FROM users)</p>
                <p className="text-emerald-400 font-semibold">✔ RESULT: ALLOWED (0.18ms) - Query executed with zero delay.</p>
                <p className="text-zinc-400 mt-2">TEST 2: Autonomous Agent attempts destructive schema deletion (DROP TABLE production_users)</p>
                <p className="text-emerald-400 font-semibold">
                  ✔ RESULT: ARRESTED IN 2.94ms! <span className="text-red-400 font-mono">[LAYER 7 AST BLOCK] Destructive database operation</span>
                </p>
                <p className="text-zinc-400 mt-2">TEST 3: Autonomous Agent attempts credential exfiltration (cat .env)</p>
                <p className="text-emerald-400 font-semibold">
                  ✔ RESULT: ARRESTED IN 2.71ms! <span className="text-red-400 font-mono">[SECURITY POLICY BLOCK] Access to private credentials</span>
                </p>
                <p className="text-emerald-400 font-bold mt-2">
                  ✔ ALL ZERO-TRUST SHIELD TESTS VERIFIED SUCCESSFULLY
                </p>
              </div>
            )}

            {terminalTab === "init" && (
              <div className="space-y-1.5">
                <p className="text-zinc-500">$ npx sevlex init</p>
                <p className="text-blue-400 font-semibold">[Sevlex Init] Scanning host for MCP-enabled AI runtimes...</p>
                <p className="text-zinc-300">✔ Found Claude Desktop (1 server(s) wrapped in Layer 7 firewall)</p>
                <p className="text-zinc-300">✔ Found Cursor IDE (0 servers unmanaged, policy injected)</p>
                <p className="text-zinc-300">✔ Found Google Antigravity (1 server(s) shielded)</p>
                <p className="text-emerald-400 font-semibold mt-2">
                  ✔ SUCCESS: 6 AI runtimes shielded. Backups preserved at *.sevlex.bak
                </p>
                <p className="text-zinc-500 mt-2">
                  Stdio intercept activated with &lt;0.1ms overhead. Run &apos;npx sevlex status&apos; to inspect.
                </p>
              </div>
            )}

            {terminalTab === "status" && (
              <div className="space-y-1.5">
                <p className="text-zinc-500">$ npx sevlex status</p>
                <p className="text-zinc-400">● Cloud Workspace:  <span className="text-emerald-400 font-semibold">✔ CONNECTED</span> -&gt; &quot;Sevlex Core Workspace&quot;</p>
                <p className="text-zinc-400">● Cloud Endpoint:   <span className="text-blue-400">https://app.sevlex.com</span></p>
                <p className="text-zinc-400">● Active Rules:     <span className="text-white">2 blocked tools, 1 HITL clearance approvals</span></p>
                <p className="text-zinc-400">● DLP Engine:       <span className="text-emerald-400 font-semibold">Active (AWS, Stripe, GitHub PAT, SSN)</span></p>
                <p className="text-zinc-400">● Circuit Breaker:  <span className="text-emerald-400 font-semibold">Armed (Threshold: 25 calls / 30s)</span></p>
                <p className="text-zinc-400">● Cryptographic Log: <span className="text-emerald-400 font-semibold">392 SHA-256 receipts [100% VALID]</span></p>
              </div>
            )}

            {terminalTab === "verify" && (
              <div className="space-y-1.5">
                <p className="text-zinc-500">$ npx sevlex verify</p>
                <p className="text-blue-400 font-semibold">[SOC 2 Audit Engine] Performing mathematical non-repudiation audit...</p>
                <p className="text-zinc-300">Traversing SQLite WAL Merkle Hash Chain backwards from root...</p>
                <p className="text-zinc-400">Receipt #392: SHA256(prev || receipt) == 8e1a3b... [VALID]</p>
                <p className="text-zinc-400">Receipt #391: SHA256(prev || receipt) == d4c92f... [VALID]</p>
                <p className="text-emerald-400 font-semibold mt-2">
                  ✔ AUDIT SUCCESS: 392 cryptographic receipts verified. Zero tamper events detected.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Counter Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-y border-white/[0.06] my-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              142,394+
            </div>
            <div className="mt-1 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Tool Calls Inspected
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono">
              &lt;0.1ms
            </div>
            <div className="mt-1 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Gateway Overhead
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight font-mono">
              100%
            </div>
            <div className="mt-1 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Zero Data Exfiltration
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 tracking-tight font-mono">
              30ms
            </div>
            <div className="mt-1 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Auto-Healing Daemon
            </div>
          </div>
        </div>
      </section>

      {/* Core Security Engines Bento Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-blue-400 font-mono font-semibold">
            Enterprise Governance Suite
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Comprehensive Defense Against Autonomous Agent Risks
          </p>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Everything SecOps and CISOs need to safely embrace agentic AI without risking source code theft or database corruption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: ToolGuard */}
          <SpotlightCard className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">ToolGuard™ Parameter Deep Packet Inspection</h3>
                <p className="text-xs text-zinc-400 font-mono">In-Flight AST &amp; Regex Sanitization</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              Blocks catastrophic command injections before execution. Automatically arrests destructive SQL commands (<code className="text-red-400 font-mono">DROP TABLE</code>, <code className="text-red-400 font-mono">TRUNCATE</code>), arbitrary shell executions (<code className="text-red-400 font-mono">rm -rf /</code>), and directory traversals (<code className="text-red-400 font-mono">../../.ssh/id_rsa</code>).
            </p>
            <div className="bg-black/50 border border-white/[0.08] rounded-xl p-3 font-mono text-xs text-zinc-400">
              <span className="text-red-400 font-semibold">[BLOCKED]</span> JSON-RPC tools/call -&gt; postgres:execute_query &#123; query: &quot;DROP TABLE users;&quot; &#125;
            </div>
          </SpotlightCard>

          {/* Bento Card 2: AgentGuard */}
          <SpotlightCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AgentGuard™ Circuit Breaker</h3>
                <p className="text-xs text-zinc-400 font-mono">Loop &amp; Velocity Limiter</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Halts runaway hallucination loops when agents retry identical failures 3 consecutive times or exceed 25 calls per 30 seconds.
            </p>
            <div className="bg-black/50 border border-white/[0.08] rounded-xl p-3 font-mono text-xs text-amber-400">
              Tripped: Error -32002 Agent Velocity Exceeded
            </div>
          </SpotlightCard>

          {/* Bento Card 3: In-Flight Output DLP */}
          <SpotlightCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">In-Flight Output DLP</h3>
                <p className="text-xs text-zinc-400 font-mono">Microsecond Redaction</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Scrubs high-entropy AWS access keys, Stripe tokens, GitHub PATs, and SSNs from downstream MCP responses before the LLM ingests them.
            </p>
            <div className="bg-black/50 border border-white/[0.08] rounded-xl p-3 font-mono text-xs text-purple-300">
              AKIAIOSFODNN7EXAMPLE ➔ [REDACTED_AWS_KEY]
            </div>
          </SpotlightCard>

          {/* Bento Card 4: SOC 2 Merkle Audit Chain */}
          <SpotlightCard id="compliance" className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">SOC 2 Cryptographic Merkle Hash Chain</h3>
                <p className="text-xs text-zinc-400 font-mono">Immutable Non-Repudiation</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Every audit receipt in SQLite WAL mode is mathematically bound to its predecessor: <code className="text-emerald-400 font-mono">entry_hash = SHA256(prev_hash || receipt)</code>. Any alteration or deletion instantly breaks the cryptographic chain.
            </p>
            <div className="bg-black/50 border border-white/[0.08] rounded-xl p-3 font-mono text-xs text-zinc-400 flex items-center justify-between">
              <span>H(prev || id || user || tool || status)</span>
              <span className="text-emerald-400 font-semibold font-mono">100% Cryptographically Valid</span>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-blue-950/30 via-[#0E0D17] to-[#08080C] p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-blue-500/20 blur-[90px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10">
            Shield Your AI Agents in 10 Seconds
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base relative z-10">
            No Docker, no kernel drivers, no root permissions. Run one command to wrap MCP servers across Cursor, Claude Desktop, and Antigravity.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <div className="flex items-center gap-3 bg-[#111118] border border-white/[0.15] rounded-xl px-4 py-2.5">
              <span className="text-zinc-500 font-mono text-sm">$</span>
              <code className="text-sm font-mono text-emerald-400 font-bold">npx sevlex init</code>
              <button
                onClick={copyInstall}
                className="p-1 text-zinc-400 hover:text-white transition cursor-pointer"
                title="Copy install command"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <a
              href="/console"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-600/30"
            >
              Sign In to SecOps Console
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-3 text-zinc-400">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sevlex-brand-horizontal.png"
            alt="Sevlex"
            className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition"
          />
          <span>&copy; 2026 Sevlex Security Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#simulator" className="hover:text-zinc-300 transition">Exploit Simulator</a>
          <a href="#features" className="hover:text-zinc-300 transition">Features</a>
          <a href="/console" className="hover:text-zinc-300 transition">Console</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition">GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition">Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

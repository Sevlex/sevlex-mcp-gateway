"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// Interactive Spotlight Card with mouse-following radial gradient
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.12)",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E12] p-6 shadow-xl transition-all duration-300 ${className}`}
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

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [terminalTab, setTerminalTab] = useState<"demo" | "init" | "status" | "verify">("demo");

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

  return (
    <main className="min-h-screen bg-[#08080A] text-zinc-100 font-sans selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <nav className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="h-full w-full bg-[#0E0E12] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Sevlex</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            v1.0.5
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#terminal" className="hover:text-white transition-colors">CLI</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#compliance" className="hover:text-white transition-colors">SOC 2 Audit</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Sevlex/sevlex-mcp-gateway"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition"
          >
            <Code2 className="w-4 h-4 text-zinc-400" /> GitHub
          </a>
          <a
            href="/console"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/25"
          >
            SecOps Console <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>The Layer 7 Zero-Trust Firewall for AI Agents &amp; MCP</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Zero-Trust Security for AI Agents.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Stop Autonomous Data Exfiltration.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Transparently intercepts JSON-RPC traffic between Cursor, Claude Desktop, and downstream MCP servers.
            Sub-millisecond deep packet inspection, in-flight credential DLP, autonomous hallucination breakers, and cryptographic SOC 2 audit receipts.
          </p>

          {/* Install Command Hero Pill */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-3 bg-[#111116] border border-emerald-500/30 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md">
              <span className="text-zinc-500 font-mono text-sm select-none">$</span>
              <code className="text-sm font-mono text-emerald-400 font-semibold tracking-wide">
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

            <div className="flex items-center gap-3 bg-[#111116] border border-white/[0.12] rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md">
              <span className="text-zinc-500 font-mono text-sm select-none">$</span>
              <code className="text-sm font-mono text-blue-400 font-semibold tracking-wide">
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
              SecOps Console <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Shielded AI Runtimes Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 text-xs text-zinc-400">
            <span className="text-zinc-500">Auto-shields 6 AI Runtimes:</span>
            {["Cursor IDE", "Claude Desktop", "Claude Code", "Windsurf", "Cline", "Google Antigravity"].map((app) => (
              <span
                key={app}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-300 font-mono text-[11px]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {app}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Interactive Terminal Section */}
      <section id="terminal" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.12] bg-[#0E0E14] shadow-2xl overflow-hidden">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#14141C] border-b border-white/[0.06]">
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
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                  terminalTab === "demo"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex demo
              </button>
              <button
                onClick={() => setTerminalTab("init")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                  terminalTab === "init"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex init
              </button>
              <button
                onClick={() => setTerminalTab("status")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                  terminalTab === "status"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                npx sevlex status
              </button>
              <button
                onClick={() => setTerminalTab("verify")}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
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
                  Stdio intercept activated with &lt;0.1ms overhead. Run 'npx sevlex status' to inspect.
                </p>
              </div>
            )}

            {terminalTab === "status" && (
              <div className="space-y-1.5">
                <p className="text-zinc-500">$ npx sevlex status</p>
                <p className="text-zinc-400">● Cloud Workspace:  <span className="text-emerald-400 font-semibold">✔ CONNECTED</span> -&gt; "Sevlex Core Workspace"</p>
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
              Blocks catastrophic command injections before execution. Automatically arrests destructive SQL commands (<code className="text-red-400">DROP TABLE</code>, <code className="text-red-400">TRUNCATE</code>), arbitrary shell executions (<code className="text-red-400">rm -rf /</code>), and directory traversals (<code className="text-red-400">../../.ssh/id_rsa</code>).
            </p>
            <div className="bg-black/50 border border-white/[0.08] rounded-xl p-3 font-mono text-xs text-zinc-400">
              <span className="text-red-400 font-semibold">[BLOCKED]</span> JSON-RPC tools/call -&gt; postgres:execute_query &#123; query: "DROP TABLE users;" &#125;
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
          <SpotlightCard className="md:col-span-2">
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
              Every audit receipt in SQLite WAL mode is mathematically bound to its predecessor: <code className="text-emerald-400">entry_hash = SHA256(prev_hash || receipt)</code>. Any alteration or deletion instantly breaks the cryptographic chain.
            </p>
            <div className="bg-black/50 border border-white/[0.08] rounded-xl p-3 font-mono text-xs text-zinc-400 flex items-center justify-between">
              <span>H(prev || id || user || tool || status)</span>
              <span className="text-emerald-400 font-semibold">100% Cryptographically Valid</span>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-blue-950/30 via-[#0E0E14] to-[#08080A] p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-blue-500/20 blur-[90px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10">
            Shield Your AI Agents in 10 Seconds
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base relative z-10">
            No Docker, no kernel drivers, no root permissions. Run one command to wrap MCP servers across Cursor, Claude Desktop, and Antigravity.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <div className="flex items-center gap-3 bg-[#111116] border border-white/[0.15] rounded-xl px-4 py-2.5">
              <span className="text-zinc-500 font-mono text-sm">$</span>
              <code className="text-sm font-mono text-emerald-400 font-bold">npx sevlex init</code>
              <button
                onClick={copyInstall}
                className="p-1 text-zinc-400 hover:text-white transition cursor-pointer"
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
        <div className="flex items-center gap-2 text-zinc-400">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>&copy; 2026 Sevlex Security Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-zinc-300 transition">Features</a>
          <a href="/console" className="hover:text-zinc-300 transition">Console</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition">GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition">Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

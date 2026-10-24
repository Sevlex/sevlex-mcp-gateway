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
  FileCode,
  ExternalLink,
  CheckCircle2,
  Database,
  Radio,
  Flame,
  AlertTriangle,
  Play,
  RotateCcw,
  Bot,
  Braces,
  GitBranch,
} from "lucide-react";

export default function ProductPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"toolguard" | "agentguard" | "dlp" | "merkle">("toolguard");

  const copyInstall = () => {
    navigator.clipboard.writeText("npx sevlex init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white selection:bg-[#34D59A]/20 selection:text-[#34D59A] font-sans antialiased">
      {/* 1. STICKY NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#000000]/85 backdrop-blur-md border-b border-[#242628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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

          {/* Desktop Nav Items - Clean 3-Item Architecture */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#94979E]">
            <a href="/product" className="text-[#34D59A] font-semibold transition-colors">
              Product
            </a>
            <a href="/service" className="hover:text-white transition-colors">
              Service
            </a>
            <a href="/about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="/docs" className="hover:text-white transition-colors">
              Docs
            </a>
          </div>

          <div className="flex items-center gap-2.5">
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
            </a>

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

      {/* 2. PRODUCT HERO */}
      <section className="pt-20 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] border border-[#242628] text-[#797D86] mb-6">
          <span className="text-[#34D59A] font-semibold">SEVLEX GATEWAY CORE PRODUCT</span>
          <span className="text-[#303236]">•</span>
          <span className="text-[#AFB1B6]">LAYER 7 ZERO-TRUST</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight max-w-4xl mx-auto">
          The Zero-Trust Security Fabric for Coding Agents
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#94979E] leading-relaxed max-w-2xl mx-auto">
          A high-performance reverse proxy and governance gateway purpose-built for the Model Context Protocol (MCP).
          Transparently inspects, filters, and logs every tool execution with sub-0.1ms wire overhead.
        </p>

        {/* Quick Install Pill */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
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

          <a
            href="/console"
            className="inline-flex items-center gap-1.5 h-10 px-6 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200"
          >
            <span>Launch SecOps Console</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </section>

      {/* 3. ARCHITECTURE DIAGRAM SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            System Architecture
          </h2>
          <p className="mt-2 text-3xl font-normal text-white tracking-tight">
            How Sevlex Intercepts the MCP Protocol Wire
          </p>
          <p className="mt-3 text-sm text-[#797D86]">
            Transparently sits between AI runtime processes (Claude Desktop, Cursor, Windsurf) and downstream MCP servers over stdio or SSE.
          </p>
        </div>

        {/* Wire Interception Flow Box */}
        <div className="p-8 rounded-2xl border border-[#242628] bg-[#0E0E12] font-mono text-xs text-[#C9CBCF] overflow-x-auto max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
            {/* AI Client */}
            <div className="p-4 rounded-xl bg-[#131415] border border-[#242628]">
              <span className="text-xs text-[#797D86] block mb-1">AI RUNTIME / CLIENT</span>
              <span className="text-sm font-semibold text-white block">Claude / Cursor / Windsurf</span>
              <span className="text-[10px] text-blue-400 mt-2 block font-mono">tools/call JSON-RPC</span>
            </div>

            {/* Sevlex L7 Proxy */}
            <div className="p-5 rounded-xl bg-[#000000] border-2 border-[#34D59A] relative shadow-[0_0_30px_rgba(52,213,154,0.15)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#34D59A] text-black text-[9px] font-bold uppercase">
                IN-FLIGHT DPI &lt;0.1ms
              </span>
              <span className="text-xs text-[#34D59A] font-bold block mb-1">SEVLEX LAYER 7 FIREWALL</span>
              <div className="space-y-1 text-[11px] text-[#AFB1B6] text-left mt-2">
                <div>✔ ToolGuard™ AST Check</div>
                <div>✔ DLP Credential Redaction</div>
                <div>✔ Velocity Circuit Breaker</div>
                <div>✔ Merkle Audit Receipt Hash</div>
              </div>
            </div>

            {/* Downstream MCP Tools */}
            <div className="p-4 rounded-xl bg-[#131415] border border-[#242628]">
              <span className="text-xs text-[#797D86] block mb-1">TARGET MCP SERVER</span>
              <span className="text-sm font-semibold text-white block">Postgres / Filesystem / APIs</span>
              <span className="text-[10px] text-[#34D59A] mt-2 block font-mono">Sanitized Wire Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR CORE DEFENSE ENGINES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Core Security Engines
          </h2>
          <p className="mt-2 text-3xl font-normal text-white tracking-tight">
            Four Pillars of Autonomous Agent Defense
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-full bg-[#131415] border border-[#242628]">
            <button
              onClick={() => setActiveTab("toolguard")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "toolguard" ? "bg-[#34D59A] text-black font-semibold" : "text-[#797D86] hover:text-white"
              }`}
            >
              1. ToolGuard™ AST DPI
            </button>
            <button
              onClick={() => setActiveTab("agentguard")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "agentguard" ? "bg-[#34D59A] text-black font-semibold" : "text-[#797D86] hover:text-white"
              }`}
            >
              2. AgentGuard™ Circuit Breaker
            </button>
            <button
              onClick={() => setActiveTab("dlp")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "dlp" ? "bg-[#34D59A] text-black font-semibold" : "text-[#797D86] hover:text-white"
              }`}
            >
              3. In-Flight Output DLP
            </button>
            <button
              onClick={() => setActiveTab("merkle")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "merkle" ? "bg-[#34D59A] text-black font-semibold" : "text-[#797D86] hover:text-white"
              }`}
            >
              4. SOC 2 Merkle Ledger
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-[#242628] bg-[#0E0E12] p-8 shadow-xl">
          {activeTab === "toolguard" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A]">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">ToolGuard™ Parameter Deep Packet Inspection</h3>
                  <p className="text-xs text-[#797D86] font-mono">Real-Time AST Validation &amp; Sanitization</p>
                </div>
              </div>
              <p className="text-sm text-[#C9CBCF] leading-relaxed">
                Rather than treating JSON-RPC payloads as opaque blobs, ToolGuard parses the internal syntax tree of commands in-flight. It blocks destructive database DDL (<code className="text-red-400 font-mono">DROP TABLE</code>, <code className="text-red-400 font-mono">TRUNCATE</code>), prevents catastrophic bash mutations (<code className="text-red-400 font-mono">rm -rf /</code>), and blocks path traversal attempts (<code className="text-red-400 font-mono">../../.aws/credentials</code>).
              </p>
              <div className="p-4 rounded-xl bg-[#000000] border border-[#242628] font-mono text-xs text-[#797D86]">
                <span className="text-red-400 font-semibold">[BLOCKED in 0.42ms]</span> JSON-RPC tools/call -&gt; postgres:execute_query &#123; query: &quot;DROP TABLE production_users;&quot; &#125;
              </div>
            </div>
          )}

          {activeTab === "agentguard" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-amber-400">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">AgentGuard™ Loop &amp; Velocity Circuit Breaker</h3>
                  <p className="text-xs text-[#797D86] font-mono">Halts Infinite Hallucination Loops</p>
                </div>
              </div>
              <p className="text-sm text-[#C9CBCF] leading-relaxed">
                Autonomous agents can fall into infinite retry loops when encountering ambiguous compiler or test errors, burning through hundreds of dollars in API tokens in minutes. AgentGuard enforces a sliding-window velocity threshold (e.g., 25 calls / 30 seconds) and automatically trips the circuit breaker on 3 consecutive identical failures.
              </p>
              <div className="p-4 rounded-xl bg-[#000000] border border-[#242628] font-mono text-xs text-amber-400">
                [TRIPPED] Error -32002: Agent Velocity Exceeded (26 calls in 21s). Execution halted to protect downstream API rate limits.
              </div>
            </div>
          )}

          {activeTab === "dlp" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-purple-400">
                  <Eye className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">In-Flight Output DLP Redaction</h3>
                  <p className="text-xs text-[#797D86] font-mono">Microsecond PII &amp; Secret Scrubbing</p>
                </div>
              </div>
              <p className="text-sm text-[#C9CBCF] leading-relaxed">
                Downstream tools frequently return raw environment variables or database records containing secrets. Sevlex scans the downstream response stream in-flight, immediately redacting high-entropy AWS access keys, Stripe secret tokens, GitHub Personal Access Tokens, and customer PII before the LLM ingests them into its context window.
              </p>
              <div className="p-4 rounded-xl bg-[#000000] border border-[#242628] font-mono text-xs text-purple-300">
                AKIAIOSFODNN7EXAMPLE ➔ [REDACTED_AWS_KEY] (Scrubbed in 0.38ms)
              </div>
            </div>
          )}

          {activeTab === "merkle" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A]">
                  <FileCheck2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">SOC 2 Cryptographic Merkle Hash Chain</h3>
                  <p className="text-xs text-[#797D86] font-mono">Mathematical Non-Repudiation</p>
                </div>
              </div>
              <p className="text-sm text-[#C9CBCF] leading-relaxed">
                Standard log files can be modified or deleted. Sevlex stores every tool execution receipt in a local SQLite WAL ledger cryptographically bound to its predecessor: <code className="text-[#34D59A] font-mono">entry_hash = SHA256(prev_hash || receipt)</code>. Any alteration instantly invalidates the Merkle root, providing mathematical proof to SOC 2 and ISO auditors.
              </p>
              <div className="p-4 rounded-xl bg-[#000000] border border-[#242628] font-mono text-xs text-[#34D59A] flex items-center justify-between">
                <span>Traversing 392 Receipts Backwards</span>
                <span className="font-bold">100% Cryptographically Valid</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. MACHINE SPECIFICATION (llms.txt) */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="p-6 rounded-2xl border border-[#242628] bg-[#0E0E12] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#34D59A] shrink-0 mt-0.5">
              <FileCode className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Machine-Readable Standard: llms.txt</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D59A]/10 text-[#34D59A] border border-[#34D59A]/20 font-bold uppercase">
                  AI Direct Ingestion
                </span>
              </div>
              <p className="text-xs text-[#797D86] mt-1 max-w-xl">
                Feed <code className="text-[#C9CBCF] font-mono">sevlex.com/llms.txt</code> directly to Claude Code, Cursor, or Devin so the AI can autonomously configure and verify its own security gateway.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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

      {/* 6. BOTTOM CTA */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-[#242628]">
        <div className="rounded-3xl border border-[#242628] bg-[#0C0D0E] p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#34D59A]/10 blur-[90px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight relative z-10">
            Start Shielding Your AI Workstations Today
          </h2>
          <p className="mt-4 text-[#797D86] max-w-xl mx-auto text-sm relative z-10">
            Run one command on developer laptops or connect to the centralized cloud SecOps console for team-wide policy enforcement.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <div className="inline-flex items-center gap-3 bg-[#131415] border border-[#242628] rounded-full px-5 py-2.5">
              <span className="text-[#61646B] font-mono text-xs">$</span>
              <code className="text-xs font-mono text-[#34D59A] font-medium">npx sevlex init</code>
            </div>

            <a
              href="/console"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200"
            >
              <span>Launch SecOps Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
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
          <a href="/product" className="hover:text-white transition">Product</a>
          <a href="/service" className="hover:text-white transition">Service</a>
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/console" className="hover:text-white transition">Console</a>
          <a href="/llms.txt" target="_blank" className="hover:text-white transition font-mono text-[11px]">llms.txt</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className="hover:text-white transition">Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

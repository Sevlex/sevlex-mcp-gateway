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
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ProductPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"toolguard" | "agentguard" | "dlp" | "merkle">("toolguard");

  const copyInstall = () => {
    navigator.clipboard.writeText("npx sevlex init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* Atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.08),transparent_70%)] pointer-events-none" />

      {/* 1. STICKY NAVBAR */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
        isDark ? "bg-[#000000]/85 border-b border-white/[0.08]" : "bg-white/85 border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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

          {/* Desktop Nav Items */}
          <div className={`hidden md:flex items-center gap-8 text-xs font-medium ${
            isDark ? "text-[#94979E]" : "text-[#6B7280]"
          }`}>
            <a href="/product" className="text-[#34D59A] font-semibold transition-colors">
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

          <div className="flex items-center gap-2.5">
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
                <Sun className="size-3.5 text-amber-400" />
              ) : (
                <Moon className="size-3.5 text-slate-700" />
              )}
            </button>

            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className={`hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-full border text-xs font-medium transition duration-200 ${
                isDark
                  ? "border-white/[0.08] bg-white/[0.02] text-[#C9CBCF] hover:border-white hover:text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-950 shadow-xs"
              }`}
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="/console"
              className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium transition duration-200 ${
                isDark
                  ? "bg-white text-black hover:bg-[#E4E5E7]"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              }`}
            >
              <span>Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* 2. PRODUCT HERO */}
      <section className="pt-20 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-6 ${
          isDark
            ? "bg-[#14161C] border border-white/[0.08] text-[#797D86]"
            : "bg-slate-100 border border-slate-300 text-slate-700 shadow-xs"
        }`}>
          <span className="text-[#34D59A] font-semibold">SEVLEX GATEWAY CORE PRODUCT</span>
          <span className={isDark ? "text-[#303236]" : "text-slate-300"}>•</span>
          <span className={isDark ? "text-[#AFB1B6]" : "text-slate-600"}>LAYER 7 ZERO-TRUST</span>
        </div>
        <h1 className={`text-4xl sm:text-6xl font-medium tracking-tight leading-tight max-w-4xl mx-auto ${
          isDark ? "text-white" : "text-slate-950"
        }`}>
          The Zero-Trust Security Fabric for Coding Agents
        </h1>
        <p className={`mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
          isDark ? "text-[#94979E]" : "text-slate-600"
        }`}>
          A high-performance reverse proxy and governance gateway purpose-built for the Model Context Protocol (MCP).
          Transparently inspects, filters, and logs every tool execution with sub-0.1ms wire overhead.
        </p>

        {/* Quick Install Pill */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className={`inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-colors ${
            isDark
              ? "bg-[#14161C] border border-white/[0.08]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-xs"
          }`}>
            <span className={`font-mono text-xs ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>$</span>
            <code className="text-xs font-mono text-[#34D59A] font-medium">npx sevlex init</code>
            <button
              onClick={copyInstall}
              className={`p-1 transition cursor-pointer ${
                isDark ? "text-[#797D86] hover:text-white" : "text-slate-400 hover:text-slate-800"
              }`}
              title="Copy install command"
            >
              {copied ? <Check className="size-3.5 text-[#34D59A]" /> : <Copy className="size-3.5" />}
            </button>
          </div>

          <a
            href="/console"
            className={`inline-flex items-center gap-1.5 h-10 px-6 rounded-full text-xs font-medium transition duration-200 ${
              isDark
                ? "bg-white text-black hover:bg-[#E4E5E7]"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
            }`}
          >
            <span>Launch Console</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </section>

      {/* 3. ARCHITECTURE DIAGRAM SECTION */}
      <section className={`py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-white/[0.08]" : "border-slate-200/90"
      }`}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            System Architecture
          </h2>
          <p className={`mt-2 text-3xl font-normal tracking-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            How Sevlex Intercepts the MCP Protocol Wire
          </p>
          <p className={`mt-3 text-sm ${
            isDark ? "text-[#797D86]" : "text-slate-600"
          }`}>
            Transparently sits between AI runtime processes (Claude Desktop, Cursor, Windsurf) and downstream MCP servers over stdio or SSE.
          </p>
        </div>

        {/* Wire Interception Flow Box */}
        <div className={`p-8 rounded-2xl font-mono text-xs overflow-x-auto max-w-4xl mx-auto transition-colors ${
          isDark
            ? "border border-white/[0.08] bg-[#0E1014] text-[#C9CBCF] shadow-2xl"
            : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white text-slate-700 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(15,23,42,0.08)]"
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
            {/* AI Client */}
            <div className={`p-4 rounded-xl transition-colors ${
              isDark ? "bg-[#14161C] border border-white/[0.08]" : "bg-slate-50 border border-slate-200"
            }`}>
              <span className={`text-xs block mb-1 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>AI RUNTIME / CLIENT</span>
              <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-slate-900"}`}>Claude / Cursor / Windsurf</span>
              <span className="text-[10px] text-blue-500 dark:text-blue-400 mt-2 block font-mono">tools/call JSON-RPC</span>
            </div>

            {/* Sevlex L7 Proxy */}
            <div className={`p-5 rounded-xl border-2 border-[#34D59A] relative transition-colors ${
              isDark
                ? "bg-[#000000] shadow-[0_0_30px_rgba(52,213,154,0.15)]"
                : "bg-emerald-50/40 shadow-[0_4px_20px_rgba(52,213,154,0.18)]"
            }`}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#34D59A] text-black text-[9px] font-bold uppercase tracking-wider shadow-xs">
                IN-FLIGHT DPI &lt;0.1ms
              </span>
              <span className="text-xs text-[#34D59A] font-bold block mb-1">SEVLEX LAYER 7 FIREWALL</span>
              <div className={`space-y-1 text-[11px] text-left mt-2 ${isDark ? "text-[#AFB1B6]" : "text-slate-700"}`}>
                <div className="flex items-center gap-1.5"><span className="text-[#34D59A]">✔</span> ToolGuard™ AST Check</div>
                <div className="flex items-center gap-1.5"><span className="text-[#34D59A]">✔</span> DLP Credential Redaction</div>
                <div className="flex items-center gap-1.5"><span className="text-[#34D59A]">✔</span> Velocity Circuit Breaker</div>
                <div className="flex items-center gap-1.5"><span className="text-[#34D59A]">✔</span> Merkle Audit Receipt Hash</div>
              </div>
            </div>

            {/* Downstream MCP Tools */}
            <div className={`p-4 rounded-xl transition-colors ${
              isDark ? "bg-[#14161C] border border-white/[0.08]" : "bg-slate-50 border border-slate-200"
            }`}>
              <span className={`text-xs block mb-1 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>TARGET MCP SERVER</span>
              <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-slate-900"}`}>Postgres / Filesystem / APIs</span>
              <span className="text-[10px] text-[#34D59A] mt-2 block font-mono font-medium">Sanitized Wire Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR CORE DEFENSE ENGINES */}
      <section className={`py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-white/[0.08]" : "border-slate-200/90"
      }`}>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Core Security Engines
          </h2>
          <p className={`mt-2 text-3xl font-normal tracking-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            Four Pillars of Autonomous Agent Defense
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex p-1 rounded-full transition-colors ${
            isDark ? "bg-[#14161C] border border-white/[0.08]" : "bg-slate-100 border border-slate-200/90 shadow-xs"
          }`}>
            <button
              onClick={() => setActiveTab("toolguard")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "toolguard"
                  ? "bg-[#34D59A] text-black font-semibold shadow-xs"
                  : isDark ? "text-[#797D86] hover:text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              1. ToolGuard™ AST DPI
            </button>
            <button
              onClick={() => setActiveTab("agentguard")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "agentguard"
                  ? "bg-[#34D59A] text-black font-semibold shadow-xs"
                  : isDark ? "text-[#797D86] hover:text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              2. AgentGuard™ Circuit Breaker
            </button>
            <button
              onClick={() => setActiveTab("dlp")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "dlp"
                  ? "bg-[#34D59A] text-black font-semibold shadow-xs"
                  : isDark ? "text-[#797D86] hover:text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              3. In-Flight Output DLP
            </button>
            <button
              onClick={() => setActiveTab("merkle")}
              className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "merkle"
                  ? "bg-[#34D59A] text-black font-semibold shadow-xs"
                  : isDark ? "text-[#797D86] hover:text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              4. Cryptographic Merkle Ledger
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className={`max-w-4xl mx-auto rounded-2xl p-8 transition-colors ${
          isDark
            ? "border border-white/[0.08] bg-[#0E1014] shadow-xl"
            : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(15,23,42,0.08)]"
        }`}>
          {activeTab === "toolguard" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center text-[#34D59A] ${
                  isDark ? "bg-[#16181F] border border-white/[0.08]" : "bg-emerald-50 border border-emerald-200"
                }`}>
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                    ToolGuard™ Parameter Deep Packet Inspection
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                    Real-Time AST Validation &amp; Sanitization
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-[#C9CBCF]" : "text-slate-600"}`}>
                Rather than treating JSON-RPC payloads as opaque blobs, ToolGuard parses the internal syntax tree of commands in-flight. It blocks destructive database DDL (<code className="text-red-500 font-mono font-medium">DROP TABLE</code>, <code className="text-red-500 font-mono font-medium">TRUNCATE</code>), prevents catastrophic bash mutations (<code className="text-red-500 font-mono font-medium">rm -rf /</code>), and blocks path traversal attempts (<code className="text-red-500 font-mono font-medium">../../.aws/credentials</code>).
              </p>
              <div className={`p-4 rounded-xl font-mono text-xs ${
                isDark ? "bg-[#000000] border border-white/[0.08] text-[#797D86]" : "bg-slate-900 text-slate-300 border border-slate-800"
              }`}>
                <span className="text-red-400 font-semibold">[BLOCKED in 0.42ms]</span> JSON-RPC tools/call -&gt; postgres:execute_query &#123; query: &quot;DROP TABLE production_users;&quot; &#125;
              </div>
            </div>
          )}

          {activeTab === "agentguard" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center text-amber-400 ${
                  isDark ? "bg-[#16181F] border border-white/[0.08]" : "bg-amber-50 border border-amber-200"
                }`}>
                  <Zap className="size-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                    AgentGuard™ Loop &amp; Velocity Circuit Breaker
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                    Halts Infinite Hallucination Loops
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-[#C9CBCF]" : "text-slate-600"}`}>
                Autonomous agents can fall into infinite retry loops when encountering ambiguous compiler or test errors, burning through hundreds of dollars in API tokens in minutes. AgentGuard enforces a sliding-window velocity threshold (e.g., 25 calls / 30 seconds) and automatically trips the circuit breaker on 3 consecutive identical failures.
              </p>
              <div className={`p-4 rounded-xl font-mono text-xs ${
                isDark ? "bg-[#000000] border border-white/[0.08] text-amber-400" : "bg-slate-900 text-amber-400 border border-slate-800"
              }`}>
                [TRIPPED] Error -32002: Agent Velocity Exceeded (26 calls in 21s). Execution halted to protect downstream API rate limits.
              </div>
            </div>
          )}

          {activeTab === "dlp" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center text-purple-400 ${
                  isDark ? "bg-[#16181F] border border-white/[0.08]" : "bg-purple-50 border border-purple-200"
                }`}>
                  <Eye className="size-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                    In-Flight Output DLP Redaction
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                    Microsecond PII &amp; Secret Scrubbing
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-[#C9CBCF]" : "text-slate-600"}`}>
                Downstream tools frequently return raw environment variables or database records containing secrets. Sevlex scans the downstream response stream in-flight, immediately redacting high-entropy AWS access keys, Stripe secret tokens, GitHub Personal Access Tokens, and customer PII before the LLM ingests them into its context window.
              </p>
              <div className={`p-4 rounded-xl font-mono text-xs ${
                isDark ? "bg-[#000000] border border-white/[0.08] text-purple-300" : "bg-slate-900 text-purple-300 border border-slate-800"
              }`}>
                AKIAIOSFODNN7EXAMPLE ➔ [REDACTED_AWS_KEY] (Scrubbed in 0.38ms)
              </div>
            </div>
          )}

          {activeTab === "merkle" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center text-[#34D59A] ${
                  isDark ? "bg-[#16181F] border border-white/[0.08]" : "bg-emerald-50 border border-emerald-200"
                }`}>
                  <FileCheck2 className="size-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                    Cryptographic Merkle Hash Chain
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                    Mathematical Non-Repudiation
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-[#C9CBCF]" : "text-slate-600"}`}>
                Standard log files can be modified or deleted. Sevlex stores every tool execution receipt in a local SQLite WAL ledger cryptographically bound to its predecessor: <code className="text-[#34D59A] font-mono">entry_hash = SHA256(prev_hash || receipt)</code>. Any alteration instantly invalidates the Merkle root, providing mathematical proof for enterprise security audits.
              </p>
              <div className={`p-4 rounded-xl font-mono text-xs flex items-center justify-between ${
                isDark ? "bg-[#000000] border border-white/[0.08] text-[#34D59A]" : "bg-slate-900 text-[#34D59A] border border-slate-800"
              }`}>
                <span>Traversing 402 Receipts Backwards</span>
                <span className="font-bold">100% Cryptographically Valid</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. MACHINE SPECIFICATION (llms.txt) */}
      <section className={`py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-white/[0.08]" : "border-slate-200/90"
      }`}>
        <div className={`p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? "border border-white/[0.08] bg-[#0E1014]"
            : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-sm"
        }`}>
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl text-[#34D59A] shrink-0 mt-0.5 ${
              isDark ? "bg-white/[0.04] border border-white/[0.08]" : "bg-emerald-50 border border-emerald-200"
            }`}>
              <FileCode className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
                  Machine-Readable Standard: llms.txt
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D59A]/10 text-[#34D59A] border border-[#34D59A]/20 font-bold uppercase">
                  AI Direct Ingestion
                </span>
              </div>
              <p className={`text-xs mt-1 max-w-xl ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
                Feed <code className={`font-mono ${isDark ? "text-[#C9CBCF]" : "text-slate-800 font-semibold"}`}>sevlex.com/llms.txt</code> directly to Claude Code, Cursor, or Devin so the AI can autonomously configure and verify its own security gateway.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer ${
                isDark
                  ? "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
              }`}
            >
              <span>View llms.txt</span>
              <ExternalLink size={12} className={isDark ? "text-[#797D86]" : "text-slate-500"} />
            </a>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className={`py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t transition-colors ${
        isDark ? "border-white/[0.08]" : "border-slate-200/90"
      }`}>
        <div className={`rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? "border border-white/[0.08] bg-[#0A0C10]"
            : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#34D59A]/10 blur-[90px] pointer-events-none rounded-full" />
          <h2 className={`text-3xl sm:text-4xl font-medium tracking-tight relative z-10 ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            Start Shielding Your AI Workstations Today
          </h2>
          <p className={`mt-4 max-w-xl mx-auto text-sm relative z-10 ${
            isDark ? "text-[#797D86]" : "text-slate-600"
          }`}>
            Run one command on developer laptops or connect to the centralized cloud SecOps console for team-wide policy enforcement.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <div className={`inline-flex items-center gap-3 rounded-full px-5 py-2.5 ${
              isDark
                ? "bg-[#14161C] border border-white/[0.08]"
                : "bg-slate-50 border border-slate-300 shadow-xs"
            }`}>
              <span className={`font-mono text-xs ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>$</span>
              <code className="text-xs font-mono text-[#34D59A] font-medium">npx sevlex init</code>
            </div>

            <a
              href="/console"
              className={`inline-flex items-center gap-2 h-11 px-7 rounded-full text-xs font-medium transition duration-200 ${
                isDark
                  ? "bg-white text-black hover:bg-[#E4E5E7]"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              }`}
            >
              <span>Launch Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark ? "border-white/[0.08] text-[#797D86]" : "border-slate-200/90 text-slate-500"
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

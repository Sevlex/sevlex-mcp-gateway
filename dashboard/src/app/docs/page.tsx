"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Moon,
  Sun,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Rocket,
  Sparkles,
  Layers,
  Database,
  Terminal,
  Code2,
  Lock,
  Cpu,
  Eye,
  Activity,
  FileCode,
  BookOpen,
  ArrowRight,
  Server,
  Key,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Bot,
  Command,
  X,
} from "lucide-react";
import { ThemeProvider, useTheme } from "../components/ThemeProvider";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

// Top documentation sections
const DOCS_NAV = [
  {
    group: "Get Started",
    items: [
      { id: "intro", title: "Introduction", badge: "Core" },
      { id: "quickstart", title: "Quickstart (5 min)", badge: "New" },
      { id: "architecture", title: "Architecture & Data Flow" },
      { id: "zero-trust", title: "Zero-Trust MCP Model" },
    ],
  },
  {
    group: "Security Engines",
    items: [
      { id: "toolguard", title: "ToolGuard™ AST DPI" },
      { id: "agentguard", title: "AgentGuard™ Circuit Breaker" },
      { id: "dlp", title: "In-Flight DLP & Redaction" },
      { id: "merkle", title: "Merkle Audit Ledger" },
    ],
  },
  {
    group: "Frameworks & Agents",
    items: [
      { id: "cursor", title: "Cursor IDE Integration" },
      { id: "claude", title: "Claude Desktop Setup" },
      { id: "windsurf", title: "Windsurf Cascade Gateway" },
      { id: "langchain", title: "LangChain & Swarm SDK" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "cli", title: "Gateway CLI (sevlex)" },
      { id: "api", title: "REST & JSON-RPC Proxy API" },
      { id: "database", title: "Neon PostgreSQL Sync" },
      { id: "env", title: "Environment Variables" },
    ],
  },
];

function DocsContent() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("intro");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#0A0B0E] text-[#F3F4F6] selection:bg-blue-600/30 selection:text-blue-200"
          : "bg-[#FFFFFF] text-[#111827] selection:bg-blue-100 selection:text-blue-900"
      }`}
    >
      {/* =========================================================================
          TOP NAVBAR (CORSAIR STYLE)
          ========================================================================= */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${
          isDark
            ? "border-[#1E2028] bg-[#0A0B0E]/90"
            : "border-[#E5E7EB] bg-[#FFFFFF]/90"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Top Tabs */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <img
                src={isDark ? "/sevlex-brand-horizontal.png" : "/sevlex-brand-horizontal-dark.png"}
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:opacity-90"
              />
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/docs"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isDark
                    ? "text-white bg-[#1A1D26]"
                    : "text-gray-900 bg-gray-100"
                }`}
              >
                Docs
              </Link>
              <Link
                href="/product"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-[#161820]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Security Engines
              </Link>
              <Link
                href="/service"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-[#161820]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Services
              </Link>
              <Link
                href="/about"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-[#161820]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {/* Center: Search Bar Trigger (Ctrl+K) */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border text-sm transition-all ${
                isDark
                  ? "bg-[#12141A] border-[#222530] text-gray-400 hover:border-gray-700 hover:text-gray-200"
                  : "bg-[#F9FAFB] border-[#E5E7EB] text-gray-500 hover:border-gray-400 hover:text-gray-700 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span>Search docs...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                    isDark
                      ? "bg-[#1A1D26] border-[#2E3240] text-gray-400"
                      : "bg-white border-gray-200 text-gray-500 shadow-2xs"
                  }`}
                >
                  Ctrl K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right: GitHub Repo Pill + Theme Toggle + Console */}
          <div className="flex items-center gap-3">
            {/* GitHub Repo with Stars */}
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? "border-[#222530] bg-[#12141A] text-gray-300 hover:text-white hover:border-gray-700"
                  : "border-[#E5E7EB] bg-[#F9FAFB] text-gray-700 hover:text-gray-900 hover:border-gray-300 shadow-xs"
              }`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Sevlex/sevlex-mcp-gateway</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isDark ? "bg-[#1E212B] text-gray-400" : "bg-gray-200 text-gray-600"
                }`}
              >
                ★ 1.2k
              </span>
            </a>

            {/* Theme Toggle Sun / Moon (Corsair Style) */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-[#222530] bg-[#12141A] text-gray-300 hover:text-white hover:border-gray-700"
                  : "border-[#E5E7EB] bg-[#F9FAFB] text-gray-700 hover:text-gray-900 hover:border-gray-300 shadow-xs"
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* SecOps Console Link */}
            <Link
              href="/console"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              <span>Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          BODY: THREE-COLUMN DOCS LAYOUT
          ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex">
        {/* =========================================================================
            LEFT SIDEBAR (STICKY NAVIGATION)
            ========================================================================= */}
        <aside
          className={`w-64 shrink-0 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-6 border-r transition-colors ${
            isDark ? "border-[#1E2028]" : "border-[#E5E7EB]"
          }`}
        >
          <div className="space-y-6">
            {DOCS_NAV.map((section) => (
              <div key={section.group} className="space-y-1.5">
                <h4
                  className={`text-xs font-bold uppercase tracking-wider px-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {section.group}
                </h4>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                            isActive
                              ? isDark
                                ? "bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 rounded-l-none"
                                : "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 rounded-l-none"
                              : isDark
                              ? "text-gray-400 hover:text-gray-200 hover:bg-[#14161E]"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                                isActive
                                  ? isDark
                                    ? "bg-blue-900/50 text-blue-300"
                                    : "bg-blue-100 text-blue-700"
                                  : isDark
                                  ? "bg-[#1E212B] text-gray-400"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* =========================================================================
            CENTER MAIN ARTICLE
            ========================================================================= */}
        <main className="flex-1 min-w-0 py-8 lg:px-10 xl:px-12">
          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-1.5 text-xs font-medium mb-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span>Docs</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span>Get Started</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className={isDark ? "text-white" : "text-gray-900"}>
              {DOCS_NAV.flatMap((g) => g.items).find((i) => i.id === activeTab)
                ?.title || "Introduction"}
            </span>
          </div>

          {/* Article Header */}
          <div className="space-y-3 pb-8 border-b border-dashed border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v1.0.5 Engine
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">Layer 7 Zero-Trust MCP Proxy</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Introduction to Sevlex
            </h1>

            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sevlex is the enterprise-grade Layer 7 zero-trust security gateway
              and reverse proxy for AI coding agents. Run it locally or in your
              VPC to inspect, sanitize, and audit every Model Context Protocol (MCP)
              tool call in flight.
            </p>
          </div>

          {/* Article Body */}
          <div className="mt-8 space-y-8">
            {/* The Problem & Solution Prose */}
            <section className="space-y-4">
              <h2
                className={`text-xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Why Agent Security Matters
              </h2>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Autonomous agents like Cursor, Claude Desktop, and Windsurf are
                granted direct access to your local filesystem, bash shells, and
                cloud APIs. Without runtime governance, an agent compromised by a
                poisoned prompt or dependency can execute destructive commands
                like <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-red-500/10 text-red-500 border border-red-500/20">rm -rf /</code>,
                leak sensitive credentials via outbound webhooks, or perform silent data exfiltration.
              </p>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sevlex intercepts tool calls before execution. By wrapping the
                standard JSON-RPC transport over stdio and SSE, it enforces AST-based
                deep packet inspection, in-flight DLP, and cryptographically signs
                every transaction to a Merkle audit trail backed by Neon PostgreSQL.
              </p>
            </section>

            {/* Code Snippet 1: sevlex.config.ts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Configure Sevlex Gateway once, protect every agent:</span>
              </div>
              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isDark
                    ? "border-[#222530] bg-[#0E1017]"
                    : "border-[#E5E7EB] bg-[#F8FAFC]"
                }`}
              >
                <div
                  className={`flex items-center justify-between px-4 py-2 border-b text-xs font-mono ${
                    isDark
                      ? "border-[#1E212B] bg-[#141620] text-gray-300"
                      : "border-[#E5E7EB] bg-[#F1F5F9] text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-blue-500" />
                    <span>sevlex.config.ts</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `import { createGateway, ToolGuard, AgentGuard } from '@sevlex/gateway';

export const gateway = createGateway({
  listen: { port: 8080, transport: 'sse' },
  engines: [
    ToolGuard({
      blockUnsafeBash: true,
      allowedSqlDialects: ['postgres'],
      preventFileTraversal: true,
    }),
    AgentGuard({
      maxToolCallsPerMinute: 60,
      circuitBreakerBudgetUsd: 10.0,
      dlpRedactTokens: ['OPENAI_API_KEY', 'DATABASE_URL', 'AWS_SECRET'],
    }),
  ],
  audit: {
    storage: 'neon-postgres',
    merkleLedger: true,
  },
});`,
                        "config-code"
                      )
                    }
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-300"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {copiedId === "config-code" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                  <pre
                    className={
                      isDark ? "text-gray-300" : "text-gray-800"
                    }
                  >
                    <span className="text-purple-400">import</span> &#123; createGateway, ToolGuard, AgentGuard &#125; <span className="text-purple-400">from</span> <span className="text-emerald-500">&apos;@sevlex/gateway&apos;</span>;{`\n\n`}
                    <span className="text-blue-400">export const</span> gateway = <span className="text-amber-400">createGateway</span>(&#123;{`\n`}
                    {"  "}listen: &#123; port: <span className="text-cyan-400">8080</span>, transport: <span className="text-emerald-500">&apos;sse&apos;</span> &#125;,{`\n`}
                    {"  "}engines: [{`\n`}
                    {"    "}<span className="text-amber-400">ToolGuard</span>(&#123;{`\n`}
                    {"      "}blockUnsafeBash: <span className="text-cyan-400">true</span>,{`\n`}
                    {"      "}allowedSqlDialects: [<span className="text-emerald-500">&apos;postgres&apos;</span>],{`\n`}
                    {"      "}preventFileTraversal: <span className="text-cyan-400">true</span>,{`\n`}
                    {"    "}&#125;),{`\n`}
                    {"    "}<span className="text-amber-400">AgentGuard</span>(&#123;{`\n`}
                    {"      "}maxToolCallsPerMinute: <span className="text-cyan-400">60</span>,{`\n`}
                    {"      "}circuitBreakerBudgetUsd: <span className="text-cyan-400">10.0</span>,{`\n`}
                    {"      "}dlpRedactTokens: [<span className="text-emerald-500">&apos;OPENAI_API_KEY&apos;</span>, <span className="text-emerald-500">&apos;DATABASE_URL&apos;</span>],{`\n`}
                    {"    "}&#125;),{`\n`}
                    {"  "}],{`\n`}
                    {"  "}audit: &#123;{`\n`}
                    {"    "}storage: <span className="text-emerald-500">&apos;neon-postgres&apos;</span>,{`\n`}
                    {"    "}merkleLedger: <span className="text-cyan-400">true</span>,{`\n`}
                    {"  "}&#125;,{`\n`}
                    &#125;);
                  </pre>
                </div>
              </div>
            </div>

            {/* Code Snippet 2: Route tool execution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Call any MCP tool through Sevlex proxy with zero code changes:</span>
              </div>
              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isDark
                    ? "border-[#222530] bg-[#0E1017]"
                    : "border-[#E5E7EB] bg-[#F8FAFC]"
                }`}
              >
                <div
                  className={`flex items-center justify-between px-4 py-2 border-b text-xs font-mono ${
                    isDark
                      ? "border-[#1E212B] bg-[#141620] text-gray-300"
                      : "border-[#E5E7EB] bg-[#F1F5F9] text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    <span>terminal</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `# Start the local Layer 7 MCP security gateway
npx sevlex gateway --port 8080 --neon-db $DATABASE_URL

# Connect Cursor, Claude, or Windsurf instantly
export MCP_GATEWAY_URL="http://localhost:8080/v1/mcp"`,
                        "terminal-code"
                      )
                    }
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-300"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {copiedId === "terminal-code" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                  <pre
                    className={
                      isDark ? "text-gray-300" : "text-gray-800"
                    }
                  >
                    <span className="text-gray-500"># Start the local Layer 7 MCP security gateway</span>{`\n`}
                    <span className="text-emerald-500">npx</span> sevlex gateway --port 8080 --neon-db $DATABASE_URL{`\n\n`}
                    <span className="text-gray-500"># Connect Cursor, Claude, or Windsurf instantly</span>{`\n`}
                    <span className="text-blue-400">export</span> MCP_GATEWAY_URL=<span className="text-amber-400">&quot;http://localhost:8080/v1/mcp&quot;</span>
                  </pre>
                </div>
              </div>
            </div>

            {/* =========================================================================
                GET STARTED 2x2 CARDS (CORSAIR STYLE)
                ========================================================================= */}
            <div className="pt-6 space-y-4">
              <h2
                className={`text-xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Get Started
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1: Quickstart */}
                <button
                  onClick={() => setActiveTab("quickstart")}
                  className={`text-left p-5 rounded-xl border transition-all group ${
                    isDark
                      ? "border-[#222530] bg-[#10121A] hover:border-blue-500/50 hover:bg-[#141722]"
                      : "border-[#E5E7EB] bg-white hover:border-blue-400 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                      isDark
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                  >
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-base font-semibold mb-1 group-hover:text-blue-500 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Quickstart
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Empty project to a fully protected agent proxy in three commands.
                  </p>
                </button>

                {/* Card 2: Set up with your agent */}
                <button
                  onClick={() => setActiveTab("cursor")}
                  className={`text-left p-5 rounded-xl border transition-all group ${
                    isDark
                      ? "border-[#222530] bg-[#10121A] hover:border-purple-500/50 hover:bg-[#141722]"
                      : "border-[#E5E7EB] bg-white hover:border-purple-400 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                      isDark
                        ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                        : "bg-purple-50 text-purple-600 border border-purple-100"
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-base font-semibold mb-1 group-hover:text-purple-500 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Set up with your agent
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    One JSON config snippet to route Claude, Cursor, or Windsurf.
                  </p>
                </button>

                {/* Card 3: Security Engines */}
                <button
                  onClick={() => setActiveTab("toolguard")}
                  className={`text-left p-5 rounded-xl border transition-all group ${
                    isDark
                      ? "border-[#222530] bg-[#10121A] hover:border-emerald-500/50 hover:bg-[#141722]"
                      : "border-[#E5E7EB] bg-white hover:border-emerald-400 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                      isDark
                        ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-base font-semibold mb-1 group-hover:text-emerald-500 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Security Engines
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Enable AST DPI for SQL/Bash, DLP redactors, and circuit breakers.
                  </p>
                </button>

                {/* Card 4: Cryptographic Audit Ledger */}
                <button
                  onClick={() => setActiveTab("merkle")}
                  className={`text-left p-5 rounded-xl border transition-all group ${
                    isDark
                      ? "border-[#222530] bg-[#10121A] hover:border-amber-500/50 hover:bg-[#141722]"
                      : "border-[#E5E7EB] bg-white hover:border-amber-400 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                      isDark
                        ? "bg-amber-600/10 text-amber-400 border border-amber-500/20"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    <Database className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-base font-semibold mb-1 group-hover:text-amber-500 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Merkle Audit Ledger
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Immutable cryptographic audit trails synced into Neon PostgreSQL.
                  </p>
                </button>
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="pt-10 pb-6 border-t border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Last updated for v1.0.5 · MIT & Apache 2.0
              </span>
              <button
                onClick={() => setActiveTab("quickstart")}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                <span>Quickstart Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* =========================================================================
            RIGHT SIDEBAR (ON THIS PAGE - TABLE OF CONTENTS)
            ========================================================================= */}
        <aside
          className={`w-56 shrink-0 hidden xl:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pl-6 border-l transition-colors ${
            isDark ? "border-[#1E2028]" : "border-[#E5E7EB]"
          }`}
        >
          <div className="space-y-4">
            <h4
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              On this page
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#overview"
                  className={`block transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Overview & Threat Model
                </a>
              </li>
              <li>
                <a
                  href="#why-it-matters"
                  className={`block transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Why Agent Security Matters
                </a>
              </li>
              <li>
                <a
                  href="#gateway-config"
                  className={`block transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  sevlex.config.ts Spec
                </a>
              </li>
              <li>
                <a
                  href="#cli-quickstart"
                  className={`block transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  CLI Terminal Proxy
                </a>
              </li>
              <li>
                <a
                  href="#get-started"
                  className={`block transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Get Started Cards
                </a>
              </li>
            </ul>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <a
                href="https://github.com/Sevlex/sevlex-mcp-gateway"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Edit this page on GitHub</span>
              </a>
              <a
                href="https://github.com/Sevlex/sevlex-mcp-gateway/issues"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Report an issue</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          INTERACTIVE SEARCH MODAL (CMD + K / CTRL + K)
          ========================================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
              isDark
                ? "bg-[#11131A] border-[#252834] text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Search Input Bar */}
            <div
              className={`flex items-center gap-3 px-4 py-3.5 border-b ${
                isDark ? "border-[#222532]" : "border-gray-200"
              }`}
            >
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation, guides, and engines..."
                className={`flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded hover:bg-gray-500/10 text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results / Quick Suggestions */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {DOCS_NAV.flatMap((g) => g.items)
                .filter(
                  (item) =>
                    !searchQuery ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                      isDark
                        ? "hover:bg-[#1A1D27] text-gray-200"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
            </div>

            {/* Modal Footer */}
            <div
              className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between ${
                isDark
                  ? "border-[#222532] bg-[#0E1017] text-gray-500"
                  : "border-gray-100 bg-gray-50 text-gray-400"
              }`}
            >
              <span>Navigation with keyboard</span>
              <div className="flex items-center gap-2">
                <span>ESC to close</span>
                <span>·</span>
                <span>↵ to select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocsPage() {
  return (
    <ThemeProvider>
      <DocsContent />
    </ThemeProvider>
  );
}

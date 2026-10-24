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
  FileText,
  Sliders,
  Laptop,
} from "lucide-react";
import { ThemeProvider, useTheme } from "@/app/components/ThemeProvider";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

const DOCS_NAV = [
  {
    group: "Getting Started",
    items: [
      { id: "intro", title: "Introduction" },
      { id: "quickstart", title: "Quickstart (3 Mins)" },
      { id: "architecture", title: "Architecture & Wire Flow" },
    ],
  },
  {
    group: "Core Engines",
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

function CodeBlock({ code, language = "bash", id, isDark, onCopy, copiedId }: {
  code: string;
  language?: string;
  id: string;
  isDark: boolean;
  onCopy: (code: string, id: string) => void;
  copiedId: string | null;
}) {
  return (
    <div className={`rounded-xl border overflow-hidden my-4 transition-colors ${
      isDark ? "border-[#222530] bg-[#0E1017]" : "border-[#E5E7EB] bg-[#F8FAFC]"
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs font-mono ${
        isDark ? "border-[#1E212B] bg-[#141620] text-gray-300" : "border-[#E5E7EB] bg-[#F1F5F9] text-gray-600"
      }`}>
        <div className="flex items-center gap-2">
          {language === "bash" ? (
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <FileCode className="w-3.5 h-3.5 text-blue-500" />
          )}
          <span>{language}</span>
        </div>
        <button
          onClick={() => onCopy(code, id)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
            isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          {copiedId === id ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
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
        <pre className={isDark ? "text-gray-300" : "text-gray-800"}>
          {code}
        </pre>
      </div>
    </div>
  );
}

function DocsContent() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("intro");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const currentItem = DOCS_NAV.flatMap((g) => g.items).find((i) => i.id === activeTab) || {
    id: "intro",
    title: "Introduction",
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#0A0B0E] text-[#F3F4F6] selection:bg-blue-600/30 selection:text-blue-200"
          : "bg-[#FFFFFF] text-[#111827] selection:bg-blue-100 selection:text-blue-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${
          isDark ? "border-[#1E2028] bg-[#0A0B0E]/90" : "border-[#E5E7EB] bg-[#FFFFFF]/90"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDark ? "/sevlex-brand-horizontal.png" : "/sevlex-brand-horizontal-dark.png"}
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:opacity-90"
              />
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                isDark
                  ? "bg-[#12141C] border-[#222532] text-gray-400 hover:border-gray-600 hover:text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span>Search documentation...</span>
              </div>
              <kbd
                className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  isDark ? "bg-[#1E212D] text-gray-400" : "bg-gray-200 text-gray-600"
                }`}
              >
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label="Toggle Theme"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? "border-[#222530] bg-[#12141C] text-gray-300 hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-lg border transition-colors hidden sm:flex items-center ${
                isDark
                  ? "border-[#222530] bg-[#12141C] text-gray-300 hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="View on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <Link
              href="/console"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#34D59A] text-black hover:bg-[#2bc48b] transition"
            >
              <span>Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto flex">
        {/* Left Sidebar */}
        <aside
          className={`w-64 shrink-0 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4 border-r transition-colors ${
            isDark ? "border-[#1E2028]" : "border-[#E5E7EB]"
          }`}
        >
          <div className="space-y-6">
            {DOCS_NAV.map((section) => (
              <div key={section.group} className="space-y-1.5">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider px-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {section.group}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between cursor-pointer ${
                            isActive
                              ? isDark
                                ? "bg-emerald-500/15 text-emerald-400 font-semibold border-l-2 border-emerald-500 rounded-l-none"
                                : "bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-emerald-600 rounded-l-none"
                              : isDark
                              ? "text-gray-400 hover:text-gray-200 hover:bg-[#14161E]"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main Article */}
        <main className="flex-1 min-w-0 py-8 px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-1.5 text-xs font-medium mb-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span>Docs</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className={isDark ? "text-white" : "text-gray-900"}>
              {currentItem.title}
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
              <span className="text-xs text-gray-400">Layer 7 Zero-Trust MCP Gateway</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {currentItem.title}
            </h1>
          </div>

          {/* Dynamic Article Content */}
          <div className="mt-8 space-y-8">
            {/* 1. INTRO */}
            {activeTab === "intro" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Sevlex is an enterprise-grade Layer 7 zero-trust security gateway and reverse proxy for autonomous AI coding agents. Run it locally or across your fleet to intercept, sanitize, and cryptographically audit every Model Context Protocol (MCP) tool call in flight.
                </p>

                <h2 className={`text-xl font-bold tracking-tight pt-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Why Agent Security Matters
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Autonomous agents like Cursor Composer, Claude Desktop, and Windsurf are granted direct access to filesystems, bash terminals, and internal APIs. Without runtime governance, an agent compromised by an indirect prompt injection can execute destructive SQL queries, wipe source trees (<code className="text-red-400 font-mono text-xs">rm -rf /</code>), or leak AWS and database credentials via outbound webhooks.
                </p>

                <h3 className={`text-base font-semibold pt-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Declarative Gateway Configuration (`sevlex.config.ts`)
                </h3>
                <CodeBlock
                  id="code-intro-config"
                  language="typescript"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`import { createGateway, ToolGuard, AgentGuard } from '@sevlex/gateway';

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
});`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  <button
                    onClick={() => setActiveTab("quickstart")}
                    className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      isDark ? "border-[#222530] bg-[#10121A] hover:border-emerald-500/50" : "border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md"
                    }`}
                  >
                    <Rocket className="w-5 h-5 text-emerald-400 mb-2" />
                    <h4 className="font-semibold text-sm">3-Minute Quickstart</h4>
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Install via npm and protect your local MCP servers in seconds.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("cursor")}
                    className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      isDark ? "border-[#222530] bg-[#10121A] hover:border-blue-500/50" : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md"
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-blue-400 mb-2" />
                    <h4 className="font-semibold text-sm">Cursor IDE Setup</h4>
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      One JSON snippet to shield Cursor Composer from destructive tool calls.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* 2. QUICKSTART */}
            {activeTab === "quickstart" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Get up and running with Sevlex in under 3 minutes. No container spinups, no root permissions, and zero code changes required in your agents.
                </p>

                <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Step 1: Auto-Discover and Wrap MCP Configs
                </h3>
                <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Sevlex scans Cursor, Claude Desktop, and local tool manifests, wraps them in a Zero-Trust Layer 7 proxy, and creates a 100% reversible <code className="font-mono text-xs text-emerald-500">*.sevlex.bak</code> backup:
                </p>
                <CodeBlock
                  id="code-qs-1"
                  language="bash"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`npx sevlex init`}
                />

                <h3 className={`text-base font-semibold pt-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Step 2: Verify In-Flight AST Threat Interception
                </h3>
                <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Simulate live attacks (destructive <code className="text-red-400 font-mono text-xs">DROP TABLE</code> queries, credential exfiltration, and bash tampering) to confirm sub-millisecond arrest:
                </p>
                <CodeBlock
                  id="code-qs-2"
                  language="bash"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`npx sevlex demo`}
                />

                <h3 className={`text-base font-semibold pt-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Step 3: Mathematically Verify Cryptographic Receipts
                </h3>
                <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Verify that the SHA-256 Merkle chain has zero tamper events:
                </p>
                <CodeBlock
                  id="code-qs-3"
                  language="bash"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`npx sevlex verify`}
                />
              </div>
            )}

            {/* 3. ARCHITECTURE */}
            {activeTab === "architecture" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Sevlex operates as a transparent Layer 7 proxy sitting between MCP Client runtimes (Cursor, Claude Desktop, Windsurf, LangChain) and downstream MCP servers (Postgres, GitHub, Slack, Filesystem, Bash).
                </p>

                <div className={`p-6 rounded-2xl border font-mono text-xs ${
                  isDark ? "bg-[#0E0E12] border-[#242628] text-gray-300" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  <p className="text-emerald-400 font-bold mb-2">MCP JSON-RPC Wire Topology:</p>
                  <p>[AI Agent (Cursor/Claude)]</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;│ (stdio / SSE JSON-RPC Request)</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;▼</p>
                  <p><strong>[Sevlex Zero-Trust Gateway (:8080)]</strong></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;├── 1. ToolGuard AST DPI (&lt;0.42ms SQL/Bash Validation)</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;├── 2. AgentGuard Circuit Breaker (Velocity &amp; Loop Cap)</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;├── 3. In-Flight DLP (Token &amp; Credential Redaction)</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;└── 4. SHA-256 Merkle Audit Chain (Sealed Receipt)</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;│</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;▼ (Forward only if APPROVED)</p>
                  <p>[Downstream MCP Server (Postgres / GitHub / Bash)]</p>
                </div>
              </div>
            )}

            {/* 4. TOOLGUARD */}
            {activeTab === "toolguard" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>ToolGuard™</strong> performs sub-millisecond Abstract Syntax Tree (AST) deep packet inspection directly over the JSON-RPC wire before downstream tools execute.
                </p>

                <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Rules Enforced by ToolGuard
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                  <li><strong>SQL DDL Interception:</strong> Blocks <code className="text-red-400 font-mono text-xs">DROP TABLE</code>, <code className="text-red-400 font-mono text-xs">ALTER TABLE</code>, and destructive schema wipes.</li>
                  <li><strong>Bash Command Injection:</strong> Blocks dangerous terminal commands including <code className="text-red-400 font-mono text-xs">rm -rf /</code>, pipe-to-shell (<code className="text-red-400 font-mono text-xs">curl | sh</code>), and privilege escalations (<code className="text-red-400 font-mono text-xs">chmod 777</code>).</li>
                  <li><strong>Directory Traversal:</strong> Blocks parameter payloads attempting to escape workspace boundaries via <code className="text-red-400 font-mono text-xs">../../etc/passwd</code>.</li>
                </ul>

                <CodeBlock
                  id="code-tg-rule"
                  language="json"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`{
  "engine": "ToolGuard",
  "action": "BLOCK",
  "latency_ms": 0.42,
  "rule_triggered": "SQL_DROP_TABLE_ATTEMPT",
  "query": "DROP TABLE users; -- wipe production database",
  "audit_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}`}
                />
              </div>
            )}

            {/* 5. AGENTGUARD */}
            {activeTab === "agentguard" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>AgentGuard™</strong> prevents autonomous agents from entering infinite execution loops or exceeding organizational risk budgets.
                </p>
                <div className={`p-5 rounded-2xl border ${
                  isDark ? "bg-[#0E0E12] border-[#242628]" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <ul className="space-y-3 text-xs sm:text-sm">
                    <li><strong>Velocity Limits:</strong> Cap maximum tool calls per minute (e.g. 30 calls/minute).</li>
                    <li><strong>Budget Tripwire:</strong> Automatically shuts off agent tool access if token costs cross a predefined threshold.</li>
                    <li><strong>Anomaly Thresholds:</strong> Flags irregular execution patterns when an agent queries tools outside its typical behavioral cluster.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 6. DLP */}
            {activeTab === "dlp" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  The Sevlex In-Flight DLP engine redacts high-entropy secrets and sensitive identifiers before packets leave the local security boundary.
                </p>
                <CodeBlock
                  id="code-dlp-spec"
                  language="json"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`// Inbound Agent Request:
{
  "tool": "send_slack_message",
  "arguments": {
    "text": "Here is the key: sk-proj-abc12345678901234567890"
  }
}

// Sanitized Outbound Wire Payload:
{
  "tool": "send_slack_message",
  "arguments": {
    "text": "Here is the key: [DLP_REDACTED_OPENAI_KEY_8a2f]"
  }
}`}
                />
              </div>
            )}

            {/* 7. MERKLE */}
            {activeTab === "merkle" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Every tool request and policy outcome is sealed into a SHA-256 Merkle audit chain, guaranteeing cryptographic non-repudiation.
                </p>
                <CodeBlock
                  id="code-merkle-math"
                  language="bash"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`$ npx sevlex verify

[Merkle Audit Engine] Performing mathematical non-repudiation audit...
Traversing SQLite WAL Merkle Hash Chain backwards from root...
Receipt #402: SHA256(prev || receipt) == 8e1a3b... [VALID]
Receipt #401: SHA256(prev || receipt) == d4c92f... [VALID]

✔ AUDIT SUCCESS: 402 cryptographic receipts verified. Zero tamper events detected.`}
                />
              </div>
            )}

            {/* 8. CURSOR */}
            {activeTab === "cursor" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Cursor Composer and Agent Mode connect to MCP tools using JSON configurations in <code className="font-mono text-xs text-emerald-500">~/.cursor/mcp.json</code>.
                </p>

                <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  `~/.cursor/mcp.json` Snippet:
                </h3>
                <CodeBlock
                  id="code-cursor-json"
                  language="json"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`{
  "mcpServers": {
    "sevlex-gateway": {
      "command": "npx",
      "args": ["-y", "sevlex", "proxy", "--upstream-config", "~/.cursor/mcp.orig.json"]
    }
  }
}`}
                />

                <h3 className={`text-base font-semibold pt-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Recommended `.cursorrules` Prompt:
                </h3>
                <CodeBlock
                  id="code-cursor-rules"
                  language="markdown"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`Always execute tool calls through the Sevlex Layer 7 Zero-Trust Gateway. Never bypass security proxy boundaries.`}
                />
              </div>
            )}

            {/* 9. CLAUDE */}
            {activeTab === "claude" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Configure Claude Desktop and Claude Code CLI to route through Sevlex.
                </p>
                <CodeBlock
                  id="code-claude-config"
                  language="json"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "sevlex", "wrap", "--", "npx", "-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}`}
                />
              </div>
            )}

            {/* 10. WINDSURF */}
            {activeTab === "windsurf" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Route Windsurf Cascade Agent tools through the Sevlex proxy in <code className="font-mono text-xs text-emerald-500">~/.codeium/windsurf/mcp_config.json</code>.
                </p>
                <CodeBlock
                  id="code-windsurf-config"
                  language="json"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`{
  "mcpServers": {
    "sevlex-cascade": {
      "command": "npx",
      "args": ["-y", "sevlex", "proxy"]
    }
  }
}`}
                />
              </div>
            )}

            {/* 11. LANGCHAIN */}
            {activeTab === "langchain" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Use Sevlex with LangChain, LlamaIndex, or OpenAI Swarm agents.
                </p>
                <CodeBlock
                  id="code-langchain-py"
                  language="python"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient({
    "database": {
        "url": "http://localhost:8080/v1/mcp",  # Sevlex Zero-Trust Gateway
        "transport": "sse",
    }
})`}
                />
              </div>
            )}

            {/* 12. CLI */}
            {activeTab === "cli" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  The official `sevlex` CLI binary reference.
                </p>
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 ${
                  isDark ? "bg-[#0E0E12] border-[#242628] text-gray-300" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  <p><strong>sevlex init</strong> — Automatically discovers IDE MCP configurations, saves *.bak snapshot, wraps in L7 proxy.</p>
                  <p><strong>sevlex demo</strong> — Simulates SQL injections and credential leaks to verify interception.</p>
                  <p><strong>sevlex verify</strong> — Validates cryptographic Merkle hash chain backward from root.</p>
                  <p><strong>sevlex status</strong> — Reports active proxy health, shielded tool count, and transport mode.</p>
                  <p><strong>sevlex scan</strong> — Audits machine environment for shadow/unmanaged MCP servers.</p>
                </div>
              </div>
            )}

            {/* 13. API */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Sevlex Gateway REST and JSON-RPC proxy endpoints.
                </p>
                <CodeBlock
                  id="code-api-health"
                  language="bash"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`# Health check endpoint
curl https://sevlex.com/api/health

# Scoped audit logs endpoint (Requires API Key)
curl -H "Authorization: Bearer slx_live_..." https://sevlex.com/api/logs`}
                />
              </div>
            )}

            {/* 14. DATABASE */}
            {activeTab === "database" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Sevlex syncs audit receipts permanently to Neon Lakebase PostgreSQL.
                </p>
                <CodeBlock
                  id="code-db-schema"
                  language="sql"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  org_id VARCHAR(64) DEFAULT 'org_default',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id VARCHAR(128) NOT NULL,
  tool_name VARCHAR(256) NOT NULL,
  status VARCHAR(64) NOT NULL,
  raw_request TEXT NOT NULL,
  raw_response TEXT,
  prev_hash VARCHAR(64),
  entry_hash VARCHAR(64) NOT NULL
);`}
                />
              </div>
            )}

            {/* 15. ENV */}
            {activeTab === "env" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Environment variables supported by Sevlex Gateway and Console.
                </p>
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
                  isDark ? "bg-[#0E0E12] border-[#242628] text-gray-300" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  <p><strong>DATABASE_URL</strong> — PostgreSQL connection string (Neon pooled endpoint).</p>
                  <p><strong>DATABASE_SSL</strong> — Set to &apos;true&apos; for SSL-required cloud databases.</p>
                  <p><strong>SEVLEX_PORT</strong> — Port for local gateway proxy (default: 8080).</p>
                  <p><strong>GOOGLE_CLIENT_ID</strong> — Google OAuth 2.0 Web Client ID.</p>
                  <p><strong>GOOGLE_CLIENT_SECRET</strong> — Google OAuth 2.0 Client Secret.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark ? "border-[#242628] text-[#797D86]" : "border-slate-200 text-slate-500"
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
          <a href="/docs" className="text-[#34D59A] font-medium">Docs</a>
          <a href="/privacy" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Privacy</a>
          <a href="/terms" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Terms</a>
          <a href="/console" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Console</a>
        </div>
      </footer>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
              isDark ? "bg-[#11131A] border-[#252834] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
          >
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
                className="p-1 rounded hover:bg-gray-500/10 text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      isDark
                        ? "hover:bg-[#1A1D27] text-gray-200"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
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

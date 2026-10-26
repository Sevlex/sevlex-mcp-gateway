"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Terminal,
  Zap,
  ArrowRight,
  Copy,
  Check,
  Search,
  BookOpen,
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
  Hash,
  Network,
  Sun,
  Moon,
  Sparkles,
  Rocket,
  Lock,
  Cpu,
  Eye,
  Activity,
  FileCode,
  Server,
  Key,
  ShieldCheck,
  Command,
  X,
  FileText,
  Sliders,
  ListFilter,
  Layers,
  Code2,
  Share2,
  Clock,
  Workflow,
  Compass,
} from "lucide-react";
import { ThemeProvider, useTheme } from "@/app/components/ThemeProvider";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

type SectionTab = "docs" | "adapters" | "guides";

interface TOCItem {
  id: string;
  title: string;
}

interface DocItem {
  id: string;
  title: string;
  badge?: string;
  breadcrumb: string;
  toc: TOCItem[];
}

interface DocGroup {
  group: string;
  items: DocItem[];
}

// 1. DOCS SECTION NAVIGATION (Core Architecture & Technology)
const DOCS_NAV_GROUPS: DocGroup[] = [
  {
    group: "Get Started",
    items: [
      {
        id: "intro",
        title: "Introduction",
        breadcrumb: "Get Started",
        toc: [
          { id: "overview", title: "Overview" },
          { id: "why-agent-security", title: "Why Agent Security Matters" },
          { id: "declarative-config", title: "Declarative Config (sevlex.config.ts)" },
          { id: "next-steps", title: "Next Steps" },
        ],
      },
      {
        id: "quickstart",
        title: "Quickstart (3 Mins)",
        badge: "Fastest",
        breadcrumb: "Get Started",
        toc: [
          { id: "qs-step1", title: "Step 1: Auto-Discover & Wrap" },
          { id: "qs-step2", title: "Step 2: Simulate Attacks" },
          { id: "qs-step3", title: "Step 3: Verify Merkle Receipts" },
        ],
      },
      {
        id: "architecture",
        title: "Architecture & Wire Flow",
        breadcrumb: "Get Started",
        toc: [
          { id: "wire-topology", title: "L7 Reverse Proxy Topology" },
          { id: "latency-budget", title: "Sub-0.5ms Latency Budget" },
          { id: "stdio-sse", title: "Transparent stdio & SSE Wrappers" },
        ],
      },
    ],
  },
  {
    group: "Core Security Engines",
    items: [
      {
        id: "toolguard",
        title: "ToolGuard™ AST DPI",
        badge: "Sub-0.5ms",
        breadcrumb: "Core Engines",
        toc: [
          { id: "tg-overview", title: "AST Deep Packet Inspection" },
          { id: "tg-sql", title: "Destructive SQL DDL Interception" },
          { id: "tg-bash", title: "Bash Injection & Privilege Traps" },
          { id: "tg-traversal", title: "Filesystem Path Traversal Defense" },
        ],
      },
      {
        id: "agentguard",
        title: "AgentGuard™ Circuit Breaker",
        breadcrumb: "Core Engines",
        toc: [
          { id: "ag-velocity", title: "Velocity & Call Rate Limits" },
          { id: "ag-budget", title: "Budget Tripwires & Cost Caps" },
          { id: "ag-loops", title: "Infinite Loop Arrest" },
        ],
      },
      {
        id: "dlp",
        title: "In-Flight DLP & Redaction",
        breadcrumb: "Core Engines",
        toc: [
          { id: "dlp-entropy", title: "High-Entropy Secret Detection" },
          { id: "dlp-patterns", title: "Supported Secret Signatures" },
          { id: "dlp-reversible", title: "Zero Data Leak Guarantee" },
        ],
      },
      {
        id: "merkle",
        title: "Merkle Audit Ledger",
        badge: "SHA-256",
        breadcrumb: "Core Engines",
        toc: [
          { id: "merkle-proofs", title: "Mathematical Non-Repudiation" },
          { id: "merkle-verification", title: "Traversing the Hash Chain" },
          { id: "merkle-compliance", title: "SOC 2 & ISO 27001 Readiness" },
        ],
      },
    ],
  },
  {
    group: "Reference",
    items: [
      {
        id: "cli",
        title: "Gateway CLI (sevlex)",
        breadcrumb: "Reference",
        toc: [
          { id: "cli-init", title: "sevlex init" },
          { id: "cli-demo", title: "sevlex demo" },
          { id: "cli-verify", title: "sevlex verify" },
          { id: "cli-scan", title: "sevlex scan" },
        ],
      },
      {
        id: "api",
        title: "REST & JSON-RPC Proxy API",
        breadcrumb: "Reference",
        toc: [
          { id: "api-health", title: "GET /api/health" },
          { id: "api-logs", title: "GET /api/logs" },
          { id: "api-intake", title: "POST /api/intake" },
          { id: "api-hitl", title: "POST /api/hitl" },
        ],
      },
      {
        id: "database",
        title: "Neon PostgreSQL Sync",
        breadcrumb: "Reference",
        toc: [
          { id: "db-schema", title: "Audit Log Schema" },
          { id: "db-pooling", title: "Connection Pooling" },
          { id: "db-branching", title: "Branch-Aware Security Audit" },
        ],
      },
      {
        id: "env",
        title: "Environment Variables",
        breadcrumb: "Reference",
        toc: [
          { id: "env-vars", title: "Core Configuration Variables" },
          { id: "env-oauth", title: "OAuth & Auth Tokens" },
        ],
      },
    ],
  },
];

// 2. ADAPTERS SECTION NAVIGATION (AI Runtimes & Client IDEs)
const ADAPTERS_NAV_GROUPS: DocGroup[] = [
  {
    group: "Universal AI Agent Architecture",
    items: [
      {
        id: "universal-agent",
        title: "Universal AI Agent (Any Stack)",
        badge: "Universal",
        breadcrumb: "Adapters",
        toc: [
          { id: "universal-mental-model", title: "Universal Wire Architecture" },
          { id: "universal-python", title: "Python (LangChain / CrewAI / LlamaIndex)" },
          { id: "universal-node", title: "TypeScript / Node (Vercel AI SDK / Mastra)" },
          { id: "universal-stdio-sse", title: "Stdio vs Remote SSE Transport" },
          { id: "universal-zero-config", title: "Wrapping Existing MCP Tool Servers" },
          { id: "universal-jsonrpc-contract", title: "JSON-RPC Error Contract" },
        ],
      },
    ],
  },
  {
    group: "Coding IDEs & Agents",
    items: [
      {
        id: "cursor",
        title: "Cursor IDE Integration",
        badge: "Popular",
        breadcrumb: "Adapters",
        toc: [
          { id: "cursor-config", title: "mcp.json Configuration" },
          { id: "cursor-composer", title: "Composer Agent Security" },
          { id: "cursor-rules", title: "Recommended .cursorrules" },
        ],
      },
      {
        id: "claude",
        title: "Claude Desktop Setup",
        breadcrumb: "Adapters",
        toc: [
          { id: "claude-desktop-json", title: "claude_desktop_config.json" },
          { id: "claude-stdio", title: "Wrapping stdio MCP Servers" },
          { id: "claude-code", title: "Claude Code CLI Integration" },
        ],
      },
      {
        id: "windsurf",
        title: "Windsurf Cascade Gateway",
        breadcrumb: "Adapters",
        toc: [
          { id: "windsurf-mcp", title: "mcp_config.json Setup" },
          { id: "windsurf-sse", title: "SSE Transport Defense" },
        ],
      },
      {
        id: "antigravity",
        title: "Google Antigravity Runtime",
        breadcrumb: "Adapters",
        toc: [
          { id: "antigravity-skills", title: "Skill & Tool Governance" },
          { id: "antigravity-swarm", title: "Multi-Agent Swarm Defense" },
        ],
      },
    ],
  },
  {
    group: "Cloud & SDK Adapters",
    items: [
      {
        id: "neon-adapter",
        title: "Neon Postgres Database",
        breadcrumb: "Adapters",
        toc: [
          { id: "neon-mcp-tool", title: "Guarding Postgres MCP Tools" },
          { id: "neon-zero-ddl", title: "Blocking Destructive Mutations" },
        ],
      },
      {
        id: "node-sdk",
        title: "TypeScript / Node Native SDK",
        breadcrumb: "Adapters",
        toc: [
          { id: "node-install", title: "@sevlex/gateway Installation" },
          { id: "node-create-proxy", title: "createGateway() Factory" },
          { id: "node-custom-rules", title: "Custom Inspection Middleware" },
        ],
      },
    ],
  },
];

// 3. GUIDES SECTION NAVIGATION (Actionable Step-by-Step Tutorials modeled after Corsair.dev)
const GUIDES_NAV_GROUPS: DocGroup[] = [
  {
    group: "End-to-End Master Guides",
    items: [
      {
        id: "guide-universal-deploy",
        title: "A to Z: Deploy Any AI Agent",
        badge: "A-to-Z Guide",
        breadcrumb: "Guides",
        toc: [
          { id: "atoz-architecture", title: "Phase 1: End-to-End Wire Architecture" },
          { id: "atoz-scaffold", title: "Phase 2: Local Scaffold & Gateway Wiring" },
          { id: "atoz-agent-code", title: "Phase 3: Building the Agent (Python & TS)" },
          { id: "atoz-policies", title: "Phase 4: Declarative Policies (sevlex.config.ts)" },
          { id: "atoz-hitl", title: "Phase 5: Human-in-the-Loop Quarantine" },
          { id: "atoz-merkle", title: "Phase 6: Cryptographic Merkle Verification" },
          { id: "atoz-docker", title: "Phase 7: Production Docker & Compose Deployment" },
          { id: "atoz-cloud", title: "Phase 8: Production Cloud & Serverless Rollout" },
        ],
      },
      {
        id: "guide-vibecode",
        title: "Vibe Code Safely with AI",
        badge: "Essential",
        breadcrumb: "Guides",
        toc: [
          { id: "agent-context-prompt", title: "Sevlex Context Prompt for Your Agent" },
          { id: "scaffold-workspace", title: "Scaffold Your Project with Cursor" },
          { id: "init-sevlex", title: "Initialize the Zero-Trust Perimeter" },
          { id: "test-safety", title: "Verify Agent Tool Interception" },
          { id: "whats-next", title: "What's Next" },
        ],
      },
      {
        id: "guide-database-sandbox",
        title: "Database Zero-Trust Sandbox",
        breadcrumb: "Guides",
        toc: [
          { id: "db-sandbox-prompt", title: "Database Agent System Rules" },
          { id: "db-allowlist", title: "Configuring Safe Table Read Queries" },
          { id: "db-block-drop", title: "Simulating DROP TABLE Cascade Defense" },
        ],
      },
      {
        id: "guide-hitl-slack",
        title: "Slack Human-in-the-Loop",
        badge: "Enterprise",
        breadcrumb: "Guides",
        toc: [
          { id: "hitl-webhook", title: "Configuring Slack Incoming Webhook" },
          { id: "hitl-approval-flow", title: "1-Click Interactive Approval Cards" },
          { id: "hitl-timeout", title: "Handling Authorization Timeouts" },
        ],
      },
      {
        id: "guide-fleet-deployment",
        title: "Fleet MDM Rollout (Intune/Jamf)",
        breadcrumb: "Guides",
        toc: [
          { id: "fleet-packaging", title: "Packaging the Sevlex Daemon" },
          { id: "fleet-policy-sync", title: "Global Centralized Policy Sync" },
          { id: "fleet-audit-siem", title: "Streaming Merkle Receipts to SIEM" },
        ],
      },
    ],
  },
];

function CodeBlock({
  code,
  language = "bash",
  filename,
  id,
  isDark,
  onCopy,
  copiedId,
}: {
  code: string;
  language?: string;
  filename?: string;
  id: string;
  isDark: boolean;
  onCopy: (code: string, id: string) => void;
  copiedId: string | null;
}) {
  return (
    <div
      className={`rounded-xl border overflow-hidden my-4 transition-colors shadow-sm ${
        isDark ? "border-[#222530] bg-[#0A0C11]" : "border-[#E5E7EB] bg-[#F8FAFC]"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 border-b text-xs font-mono ${
          isDark ? "border-[#1F222B] bg-[#07090E] text-gray-400" : "border-[#E5E7EB] bg-gray-100 text-gray-600"
        }`}
      >
        <span className="font-semibold text-emerald-400">{filename || language}</span>
        <button
          onClick={() => onCopy(code, id)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
            isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-700"
          }`}
        >
          {copiedId === id ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
        <pre className={isDark ? "text-gray-300" : "text-gray-800"}>{code}</pre>
      </div>
    </div>
  );
}

function DocsContent() {
  const { theme, toggleTheme } = useTheme();
  const [sectionTab, setSectionTab] = useState<SectionTab>("docs");
  const [activeDocId, setActiveDocId] = useState<string>("intro");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keyboard shortcut Ctrl+K
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

  // Determine current active nav groups based on top tab
  const activeNavGroups =
    sectionTab === "docs"
      ? DOCS_NAV_GROUPS
      : sectionTab === "adapters"
      ? ADAPTERS_NAV_GROUPS
      : GUIDES_NAV_GROUPS;

  // Find the currently active document
  const allDocs = [...DOCS_NAV_GROUPS, ...ADAPTERS_NAV_GROUPS, ...GUIDES_NAV_GROUPS].flatMap((g) => g.items);
  const currentItem = allDocs.find((i) => i.id === activeDocId) || allDocs[0]!;

  // Handle switching top section tab
  const handleSectionSwitch = (tab: SectionTab) => {
    setSectionTab(tab);
    if (tab === "docs") setActiveDocId("intro");
    if (tab === "adapters") setActiveDocId("universal-agent");
    if (tab === "guides") setActiveDocId("guide-universal-deploy");
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#0A0B0E] text-[#F3F4F6] selection:bg-emerald-500/30 selection:text-emerald-200"
          : "bg-[#FFFFFF] text-[#111827] selection:bg-emerald-100 selection:text-emerald-900"
      }`}
    >
      {/* Header with Corsair-Style Navigation Tabs */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${
          isDark ? "border-[#1E2028] bg-[#0A0B0E]/95" : "border-[#E5E7EB] bg-[#FFFFFF]/95"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Section Switcher Tabs */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDark ? "/sevlex-brand-horizontal.png" : "/sevlex-brand-horizontal-dark.png"}
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:opacity-90"
              />
            </Link>

            {/* Corsair-Style Top Tabs: Docs | Adapters | Guides */}
            <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => handleSectionSwitch("docs")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  sectionTab === "docs"
                    ? isDark
                      ? "bg-white/10 text-white font-bold"
                      : "bg-slate-100 text-slate-900 font-bold"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="size-3.5" />
                <span>Docs</span>
              </button>

              <button
                onClick={() => handleSectionSwitch("adapters")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  sectionTab === "adapters"
                    ? isDark
                      ? "bg-white/10 text-white font-bold"
                      : "bg-slate-100 text-slate-900 font-bold"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Layers className="size-3.5" />
                <span>Adapters</span>
              </button>

              <button
                onClick={() => handleSectionSwitch("guides")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  sectionTab === "guides"
                    ? isDark
                      ? "bg-white/10 text-white font-bold"
                      : "bg-slate-100 text-slate-900 font-bold"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Workflow className="size-3.5" />
                <span>Guides</span>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </nav>
          </div>

          {/* Search Bar with Ctrl+K */}
          <div className="flex-1 max-w-sm mx-2 sm:mx-4">
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
                <span>Search docs &amp; guides...</span>
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

          {/* Right Header CTAs */}
          <div className="flex items-center gap-2.5">
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
              className={`p-2 rounded-lg border transition-colors hidden sm:flex items-center gap-1.5 text-xs font-mono ${
                isDark
                  ? "border-[#222530] bg-[#12141C] text-gray-300 hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="View on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="hidden lg:inline">★ 1.8k</span>
            </a>
            <Link
              href="/console"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#34D59A] text-black hover:bg-[#2bc48b] transition shadow-xs"
            >
              <span>Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3-Column Container */}
      <div className="max-w-[1440px] mx-auto flex">
        {/* LEFT COLUMN: Sidebar Navigation */}
        <aside
          className={`w-64 shrink-0 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4 border-r transition-colors ${
            isDark ? "border-[#1E2028]" : "border-[#E5E7EB]"
          }`}
        >
          {/* Active Tab Indicator Badge */}
          <div className="px-3 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Section: {sectionTab.toUpperCase()}
            </span>
          </div>

          <div className="space-y-6">
            {activeNavGroups.map((section) => (
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
                    const isActive = activeDocId === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveDocId(item.id)}
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
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

        {/* CENTER COLUMN: Main Article Content */}
        <main className="flex-1 min-w-0 py-8 px-4 sm:px-8 lg:px-12 max-w-4xl">
          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-1.5 text-xs font-medium mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span>{currentItem.breadcrumb}</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className={isDark ? "text-white" : "text-gray-900"}>{currentItem.title}</span>
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

          {/* ========================================================================= */}
          {/* ARTICLE CONTENT ROUTING                                                   */}
          {/* ========================================================================= */}
          <div className="mt-8 space-y-10">

                        {/* ========================================================================= */}
            {/* GUIDE: A TO Z: DEPLOY ANY AI AGENT END-TO-END (MASTER BLUEPRINT)          */}
            {/* ========================================================================= */}
            {activeDocId === "guide-universal-deploy" && (
              <div className="space-y-10">
                {/* Header Callout Banner */}
                <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isDark ? "bg-[#0E1512] border-[#34D59A]/30" : "bg-emerald-50/60 border-emerald-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#34D59A]/20 text-[#34D59A] border border-[#34D59A]/30">
                      <Sparkles className="size-3" />
                      MASTER BLUEPRINT
                    </span>
                    <span className={`text-xs font-mono ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      From Local Scaffold to Production Cloud Deployment
                    </span>
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    The Definitive A-to-Z Guide to Building &amp; Deploying Secure AI Agents
                  </h2>
                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Whether you are building in Python (LangChain, CrewAI, AutoGen), TypeScript (Vercel AI SDK, Mastra), or using Coding Agents (Cursor, Claude Code), this guide takes you step-by-step from zero to a hardened, Dockerized, and production-deployed multi-agent system governed by Sevlex Layer 7 Zero-Trust.
                  </p>
                </div>

                {/* Phase 1: End-to-End Architecture */}
                <div id="atoz-architecture" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
                    Phase 1: Understanding the Zero-Trust Agent Wire Topology
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Modern AI agents operate in an autonomous loop: the LLM plans actions, chooses tools, executes them, observes the results, and iterates. When tools connect directly to live databases, filesystems, and APIs without oversight, an indirect prompt injection or hallucination can execute fatal operations.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Sevlex acts as an in-line reverse proxy between the <strong>Agent Runtime</strong> and <strong>Model Context Protocol (MCP) tool servers</strong>. Every JSON-RPC <code className="font-mono text-emerald-400">tools/call</code> packet is inspected in microseconds:
                  </p>
                  <CodeBlock
                    id="code-atoz-arch"
                    language="text"
                    filename="Layer-7-Zero-Trust-Pipeline.txt"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`[ AGENT RUNTIME ] (LangChain / CrewAI / Cursor / Vercel AI SDK)
        │
        ▼ (stdio / SSE JSON-RPC packets)
┌────────────────────────────────────────────────────────┐
│           SEVLEX LAYER 7 ZERO-TRUST GATEWAY            │
│  ├─ AST Syntax Ingress DPI  ──> Stops DROP TABLE, rm -rf│
│  ├─ DLP Secret Redaction    ──> Masks API keys & PII   │
│  ├─ Loop Circuit Breaker    ──> Halts runaway iterations│
│  └─ Merkle WAL Ledger       ──> SHA-256 non-repudiation │
└────────────────────────────────────────────────────────┘
        │
        ▼ (Sanitized, Authorized Requests)
[ DOWNSTREAM TARGETS ] (PostgreSQL / Terminal / GitHub / Internal APIs)`}
                  />
                </div>

                {/* Phase 2: Local Scaffold & Gateway Wiring */}
                <div id="atoz-scaffold" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">02</span>
                    Phase 2: Local Scaffold &amp; Gateway Initialization
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Initialize the Sevlex perimeter in your project directory. Run the one-command bootstrap:
                  </p>
                  <CodeBlock
                    id="code-atoz-init"
                    language="bash"
                    filename="Terminal"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`mkdir my-secure-agent && cd my-secure-agent
npx sevlex init`}
                  />
                  <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                    isDark ? "bg-[#12141A] border-[#222530] text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}>
                    <div className="font-semibold text-emerald-400">What sevlex init creates:</div>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs">
                      <li><code className="font-mono text-emerald-400 font-semibold">sevlex.config.ts</code> — Centralized declarative policy file for AST rules, DLP redactions, and circuit breakers.</li>
                      <li><code className="font-mono text-emerald-400 font-semibold">.sevlex/ledger.db</code> — High-performance SQLite WAL database storing cryptographic Merkle hash chains.</li>
                      <li><code className="font-mono text-emerald-400 font-semibold">*.sevlex.bak</code> — 100% reversible snapshots of existing agent configurations before proxy injection.</li>
                    </ul>
                  </div>
                </div>

                {/* Phase 3: Building the Agent (Python & TypeScript) */}
                <div id="atoz-agent-code" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">03</span>
                    Phase 3: Building the Agent (Python &amp; TypeScript Starter Kits)
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Sevlex is completely framework-agnostic. Choose your stack below to see the end-to-end client integration:
                  </p>

                  {/* Python Tab Example */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-semibold">
                      <Terminal className="size-3.5" />
                      Python Starter (LangChain / Anthropic / Custom Agent)
                    </div>
                    <CodeBlock
                      id="code-atoz-py"
                      language="python"
                      filename="agent.py"
                      isDark={isDark}
                      onCopy={handleCopy}
                      copiedId={copiedId}
                      code={`import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run_autonomous_agent():
    # Wrap any standard MCP server (e.g., PostgreSQL or filesystem) through Sevlex Gateway
    server_params = StdioServerParameters(
        command="npx",
        args=[
            "-y", "sevlex", "proxy",
            "--upstream-command", "python",
            "--upstream-args", "mcp_postgres_server.py"
        ],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print("✔ Connected to Sevlex Zero-Trust Gateway")

            # 1. Safe Query: Allowed in <0.42ms
            safe_query = await session.call_tool("execute_sql", {"sql": "SELECT id, name FROM users LIMIT 5;"})
            print("Safe Query Result:", safe_query)

            # 2. Destructive Attack: Blocked instantly by ToolGuard AST DPI
            try:
                blocked = await session.call_tool("execute_sql", {"sql": "DROP TABLE production_users;--"})
            except Exception as e:
                # [P0_CRITICAL_QUARANTINE] DDL modification arrested. 0 bytes forwarded to DB.
                print("Interception Confirmed:", e)

if __name__ == "__main__":
    asyncio.run(run_autonomous_agent())`}
                    />
                  </div>

                  {/* TypeScript Tab Example */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-semibold">
                      <Code2 className="size-3.5" />
                      TypeScript Starter (Vercel AI SDK / Mastra / Node.js)
                    </div>
                    <CodeBlock
                      id="code-atoz-ts"
                      language="typescript"
                      filename="agent.ts"
                      isDark={isDark}
                      onCopy={handleCopy}
                      copiedId={copiedId}
                      code={`import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SevlexGatewayClient } from "@sevlex/gateway";

const sevlex = new SevlexGatewayClient({
  endpoint: process.env.SEVLEX_GATEWAY_URL || "http://localhost:8080/sse",
  apiKey: process.env.SEVLEX_API_KEY,
});

async function main() {
  // Pull wrapped, Zero-Trust protected tools from Sevlex Gateway
  const secureTools = await sevlex.getWrappedTools();

  const { text } = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    prompt: "Scan our database schema and summarize active enterprise accounts.",
    tools: secureTools,
    maxSteps: 10,
  });

  console.log("Agent response:", text);
}

main().catch(console.error);`}
                    />
                  </div>
                </div>

                {/* Phase 4: Declarative Policies */}
                <div id="atoz-policies" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">04</span>
                    Phase 4: Declarative Security Policies (sevlex.config.ts)
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Define non-negotiable security boundaries in <code className="font-mono text-emerald-400">sevlex.config.ts</code>. The engine compiles these rules into deterministic, in-memory abstract syntax tree checks:
                  </p>
                  <CodeBlock
                    id="code-atoz-config"
                    language="typescript"
                    filename="sevlex.config.ts"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`import { defineConfig } from "sevlex";

export default defineConfig({
  gateway: {
    port: 8080,
    transport: "hybrid", // Supports local stdio pipes and remote SSE gateways
    strictMode: true,
  },
  policy: {
    ast: {
      // 1. Prohibit destructive SQL mutations
      denySqlStatements: ["DROP", "TRUNCATE", "ALTER", "GRANT", "REVOKE"],
      // 2. Prohibit catastrophic shell injection and privilege escalation
      denyShellPatterns: ["rm -rf", "curl * | sh", "wget * | bash", "chmod 777", "mkfs"],
      // 3. Prohibit path traversal outside active workspace
      denyPathTraversal: true,
    },
    dlp: {
      // Mask credentials and high-entropy tokens before they reach LLM context
      redactSecrets: true,
      entropyThreshold: 4.2,
      redactedPlaceholder: "[SEVLEX_REDACTED_SECRET]",
    },
    circuitBreaker: {
      maxCallsPerMinute: 25,
      maxConsecutiveErrors: 4,
      costThresholdUSD: 10.00,
    },
  },
});`}
                  />
                </div>

                {/* Phase 5: Human-in-the-Loop Quarantine */}
                <div id="atoz-hitl" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">05</span>
                    Phase 5: Human-in-the-Loop (Slack &amp; Webhook Approvals)
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    For high-stakes actions (such as mass updates, refunds, or deleting cloud assets), Sevlex pauses execution in-flight and routes an interactive approval card directly to your engineering Slack channel or SecOps dashboard:
                  </p>
                  <CodeBlock
                    id="code-atoz-hitl"
                    language="bash"
                    filename="Sevlex In-Flight Interception Log"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`[SEVLEX_HITL_PAUSED] High-impact tool invocation intercepted:
Tool: postgres:execute_query
Parameters: {"sql": "UPDATE subscriptions SET status='cancelled' WHERE churn_risk > 0.8;"}
Risk Level: Tier-1 Mutation
Action: In-flight execution suspended. Dispatching Slack approval card to #security-approvals...
Ticket: #TX-9842 (Awaiting human operator confirmation within 300s)`}
                  />
                </div>

                {/* Phase 6: Cryptographic Merkle Verification */}
                <div id="atoz-merkle" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">06</span>
                    Phase 6: Cryptographic Merkle WAL Verification
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Every tool invocation produces a SHA-256 cryptographic receipt mathematically chained to the previous block. Run <code className="font-mono text-emerald-400">sevlex verify</code> anytime to prove complete tamper-evidence:
                  </p>
                  <CodeBlock
                    id="code-atoz-verify"
                    language="bash"
                    filename="Terminal"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`npx sevlex verify`}
                  />
                  <div className={`p-4 rounded-xl font-mono text-xs border ${
                    isDark ? "bg-[#090C10] border-[#222530] text-emerald-400" : "bg-slate-50 border-slate-200 text-emerald-700"
                  }`}>
                    <div>✔ Traversing SQLite WAL Merkle Hash Chain backwards from root...</div>
                    <div className="text-gray-400 mt-1">Block #1042: SHA256(prev || receipt) == 9f4e2a... [VALID]</div>
                    <div className="text-gray-400">Block #1041: SHA256(prev || receipt) == c3b1d8... [VALID]</div>
                    <div className="font-bold mt-2">✔ AUDIT PASSED: 1,042 cryptographic receipts intact. Zero tamper events detected.</div>
                  </div>
                </div>

                {/* Phase 7: Production Docker & Compose Deployment */}
                <div id="atoz-docker" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">07</span>
                    Phase 7: Production Containerization (Dockerfile &amp; docker-compose.yml)
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Deploy your agent alongside the Sevlex Gateway in production as a sidecar. Here is the battle-tested multi-stage container configuration:
                  </p>
                  <CodeBlock
                    id="code-atoz-dockerfile"
                    language="dockerfile"
                    filename="Dockerfile"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`# Production Multi-Stage Container for Secure AI Agent Deployment
FROM node:20-alpine AS gateway
WORKDIR /app
RUN npm install -g sevlex@latest
COPY sevlex.config.ts .

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Expose Sevlex Gateway Remote SSE Port
EXPOSE 8080
CMD ["sh", "-c", "npx sevlex daemon --port 8080 & python agent.py"]`}
                  />
                  <p className={`text-xs sm:text-sm leading-relaxed pt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    And the production <code className="font-mono text-emerald-400">docker-compose.yml</code>:
                  </p>
                  <CodeBlock
                    id="code-atoz-compose"
                    language="yaml"
                    filename="docker-compose.yml"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`version: "3.8"

services:
  sevlex-gateway:
    image: sevlex/gateway:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SEVLEX_ENV=production
      - SEVLEX_API_KEY=\${SEVLEX_API_KEY}
      - DATABASE_URL=\${DATABASE_URL}
    volumes:
      - ./sevlex.config.ts:/app/sevlex.config.ts:ro
      - sevlex-ledger:/app/.sevlex

  ai-agent:
    build: .
    restart: always
    depends_on:
      - sevlex-gateway
    environment:
      - SEVLEX_GATEWAY_URL=http://sevlex-gateway:8080/sse
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=\${OPENAI_API_KEY}

volumes:
  sevlex-ledger:`}
                  />
                </div>

                {/* Phase 8: Production Cloud & Serverless Rollout */}
                <div id="atoz-cloud" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <span className="size-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">08</span>
                    Phase 8: Production Cloud &amp; Serverless Deployment
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Deploy your secure agent stack onto Fly.io, Railway, AWS ECS, or Google Cloud Run in minutes:
                  </p>
                  <CodeBlock
                    id="code-atoz-fly"
                    language="bash"
                    filename="Deploy to Fly.io / Railway"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`# 1. Launch on Fly.io
fly launch --name enterprise-secure-agent

# 2. Inject Secrets
fly secrets set SEVLEX_API_KEY=sk_sevlex_live_8921a4f ANTHROPIC_API_KEY=sk-ant-...

# 3. Deploy
fly deploy

# 4. Verify Live Health
curl -s https://enterprise-secure-agent.fly.dev/api/health`}
                  />
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? "bg-[#10141D] border-[#1F2533]" : "bg-blue-50/60 border-blue-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          Deployment Complete &amp; Protected
                        </div>
                        <div className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Your AI agent is now operating with sub-0.5ms Zero-Trust policy enforcement, Merkle non-repudiation, and Human-in-the-Loop gates.
                        </div>
                      </div>
                    </div>
                    <a
                      href="/console"
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500 text-black hover:bg-emerald-400 transition shrink-0"
                    >
                      Open Console
                    </a>
                  </div>
                </div>
              </div>
            )}


            {/* GUIDE: VIBE CODE SAFELY (Modeled after Corsair's Vibe code dashboard) */}
            {activeDocId === "guide-vibecode" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Scaffold applications rapidly with autonomous coding agents (Cursor Composer, Windsurf Cascade, Claude Desktop) while Sevlex guarantees zero fatal mistakes: no accidental database drops, no leaked keys, and no runaway token spend.
                </p>

                {/* The Agent Context Prompt (Exact Corsair pattern) */}
                <div id="agent-context-prompt" className="scroll-mt-24 pt-2">
                  <h2 className={`text-xl font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Sevlex context prompt for your agent
                  </h2>
                  <p className={`text-xs sm:text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Paste this into your <code className="font-mono text-emerald-400">.cursorrules</code>, system instructions, or feature prompt so your agent operates seamlessly within Zero-Trust boundaries:
                  </p>
                  <CodeBlock
                    id="code-agent-prompt"
                    language="markdown"
                    filename="Sevlex-Agent-Context-Prompt.md"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`# Sevlex Layer 7 Zero-Trust MCP Security Protocol
This workspace is governed by the Sevlex Layer 7 Zero-Trust MCP Gateway.
All tools/call JSON-RPC invocations pass through real-time AST deep packet inspection:

1. DATABASE SAFETY: You may execute SELECT queries, schema additions, and parameterized statements. NEVER execute destructive DDL (DROP TABLE, TRUNCATE) or mass unindexed DELETE queries. ToolGuard will intercept and arrest them in <0.42ms.
2. TERMINAL SANBOX: Destructive shell actions (rm -rf /, curl exfiltration, chmod 777) are quarantined immediately. Use safe workspace-relative file tools instead.
3. SECRET REDACTION: High-entropy tokens (OPENAI_API_KEY, DATABASE_URL, AWS_SECRET) are redacted on egress automatically.
4. MERKLE NON-REPUDIATION: Every execution receipt is sealed in a SHA-256 cryptographic block for auditing.`}
                  />
                </div>

                {/* Step 1: Scaffold Workspace */}
                <div id="scaffold-workspace" className="scroll-mt-24 pt-4">
                  <h3 className={`text-lg font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Step 1: Scaffold Your Workspace
                  </h3>
                  <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Open your project directory in Cursor IDE or Windsurf. If starting fresh, scaffold any Next.js or Node repository:
                  </p>
                  <CodeBlock
                    id="code-guide-step1"
                    language="bash"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`npx create-next-app@latest my-agent-app --typescript --tailwind --eslint`}
                  />
                </div>

                {/* Step 2: Init Sevlex */}
                <div id="init-sevlex" className="scroll-mt-24 pt-4">
                  <h3 className={`text-lg font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Step 2: Initialize the Zero-Trust Perimeter
                  </h3>
                  <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Run the Sevlex setup CLI. It auto-discovers all local MCP configurations, creates a 100% reversible <code className="font-mono text-emerald-400">*.sevlex.bak</code> backup, and injects the Layer 7 inspection layer:
                  </p>
                  <CodeBlock
                    id="code-guide-step2"
                    language="bash"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`npx sevlex init`}
                  />
                </div>

                {/* Step 3: Test Safety */}
                <div id="test-safety" className="scroll-mt-24 pt-4">
                  <h3 className={`text-lg font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Step 3: Test Tool Interception
                  </h3>
                  <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Ask your agent to perform a destructive operation to verify the arrest mechanism:
                  </p>
                  <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                    isDark ? "bg-[#0A0C11] border-[#222530] text-gray-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <p className="text-emerald-400">&gt; Prompt to agent: &quot;Please drop the staging_users table to reset the database.&quot;</p>
                    <p className="text-red-400">&lt; Sevlex Gateway: [BLOCKED 403] ToolGuard intercepted DROP TABLE. Rule: BlockDestructiveDDL. Latency: 0.38ms.</p>
                  </div>
                </div>

                {/* What's Next */}
                <div id="whats-next" className="scroll-mt-24 pt-6 border-t border-inherit">
                  <h3 className={`text-base font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    What&apos;s Next
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/console"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#34D59A] text-black hover:bg-[#2bc48b] transition"
                    >
                      <span>Open Real-Time SecOps Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* GUIDE: DATABASE ZERO-TRUST SANDBOX */}
            {activeDocId === "guide-database-sandbox" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Allow coding agents to query tables and run safe migrations against Neon or Postgres without risking data loss.
                </p>
                <div id="db-sandbox-prompt" className="scroll-mt-24">
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Database Agent Rules
                  </h3>
                  <CodeBlock
                    id="code-db-guide"
                    language="typescript"
                    filename="sevlex.config.ts"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`import { createGateway, ToolGuard } from '@sevlex/gateway';

export const gateway = createGateway({
  engines: [
    ToolGuard({
      blockUnsafeBash: true,
      allowedSqlDialects: ['postgres'],
      preventFileTraversal: true,
      maxRowsReturned: 500,
    }),
  ],
});`}
                  />
                </div>
              </div>
            )}

            {/* GUIDE: SLACK HITL APPROVALS */}
            {activeDocId === "guide-hitl-slack" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Pause sensitive operations in-flight and route a 1-click interactive authorization button directly to your security Slack channel.
                </p>
                <div id="hitl-webhook" className="scroll-mt-24">
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Configuring Slack Approvals
                  </h3>
                  <CodeBlock
                    id="code-slack-hitl"
                    language="bash"
                    filename=".env"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`SLACK_HITL_WEBHOOK_URL="https://hooks.slack.com/services/T00/B00/XXXX"
SEVLEX_HITL_REQUIRE_APPROVAL_FOR="execute_sql_migration,send_refund,rmdir"`}
                  />
                </div>
              </div>
            )}

            {/* GUIDE: FLEET MDM DEPLOYMENT */}
            {activeDocId === "guide-fleet-deployment" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Deploy transparent daemon-level MCP security across 500+ developer workstations using Microsoft Intune or Jamf.
                </p>
                <CodeBlock
                  id="code-fleet-sh"
                  language="bash"
                  filename="deploy-fleet.sh"
                  isDark={isDark}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  code={`curl -fsSL https://sevlex.com/api/mdm-script | bash -s -- --org-token="slx_org_fleet_xxxx"`}
                />
              </div>
            )}

            {/* DOCS: INTRODUCTION */}
            {activeDocId === "intro" && (
              <div className="space-y-6">
                <div id="overview" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Sevlex is an enterprise-grade Layer 7 zero-trust security gateway and reverse proxy for autonomous AI coding agents. Run it locally or across your fleet to intercept, sanitize, and cryptographically audit every Model Context Protocol (MCP) tool call in flight.
                  </p>
                </div>

                <div id="why-agent-security" className="scroll-mt-24 pt-4">
                  <h2 className={`text-xl font-bold tracking-tight mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Why Agent Security Matters
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Autonomous agents like Cursor Composer, Claude Desktop, and Windsurf are granted direct access to filesystems, bash terminals, and internal APIs. Without runtime governance, an agent compromised by an indirect prompt injection can execute destructive SQL queries, wipe source trees, or leak AWS and database credentials via outbound webhooks.
                  </p>
                </div>

                <div id="declarative-config" className="scroll-mt-24 pt-4">
                  <h3 className={`text-base font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Declarative Gateway Configuration (`sevlex.config.ts`)
                  </h3>
                  <CodeBlock
                    id="code-intro-config"
                    language="typescript"
                    filename="sevlex.config.ts"
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
                </div>

                <div id="next-steps" className="scroll-mt-24 pt-6 border-t border-inherit">
                  <h4 className={`text-base font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Next Steps</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveDocId("quickstart")}
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
                      onClick={() => handleSectionSwitch("guides")}
                      className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                        isDark ? "border-[#222530] bg-[#10121A] hover:border-blue-500/50" : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md"
                      }`}
                    >
                      <Workflow className="w-5 h-5 text-blue-400 mb-2" />
                      <h4 className="font-semibold text-sm">Explore Guides</h4>
                      <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Learn how to vibe code safely with context prompts and database sandboxes.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DOCS: QUICKSTART */}
            {activeDocId === "quickstart" && (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Get up and running with Sevlex in under 3 minutes. No container spinups, no root permissions, and zero code changes required in your agents.
                </p>

                <div id="qs-step1" className="scroll-mt-24">
                  <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Step 1: Auto-Discover and Wrap MCP Configs
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
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
                </div>

                <div id="qs-step2" className="scroll-mt-24 pt-4">
                  <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Step 2: Verify In-Flight AST Threat Interception
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
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
                </div>

                <div id="qs-step3" className="scroll-mt-24 pt-4">
                  <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Step 3: Mathematically Verify Cryptographic Receipts
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
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
              </div>
            )}

            {/* DOCS: ARCHITECTURE */}
            {activeDocId === "architecture" && (
              <div className="space-y-6">
                <div id="wire-topology" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Sevlex operates as a transparent Layer 7 proxy sitting between MCP Client runtimes (Cursor, Claude Desktop, Windsurf, LangChain) and downstream MCP servers (Postgres, GitHub, Slack, Filesystem, Bash).
                  </p>
                  <div className={`p-6 rounded-2xl border font-mono text-xs my-4 ${
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
              </div>
            )}

            {/* DOCS: TOOLGUARD */}
            {activeDocId === "toolguard" && (
              <div className="space-y-6">
                <div id="tg-overview" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>ToolGuard™</strong> performs sub-millisecond Abstract Syntax Tree (AST) deep packet inspection directly over the JSON-RPC wire before downstream tools execute.
                  </p>
                </div>
                <div id="tg-sql" className="scroll-mt-24 pt-2">
                  <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Rules Enforced by ToolGuard
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm mt-2">
                    <li><strong>SQL DDL Interception:</strong> Blocks <code className="text-red-400 font-mono text-xs">DROP TABLE</code>, <code className="text-red-400 font-mono text-xs">ALTER TABLE</code>, and destructive schema wipes.</li>
                    <li><strong>Bash Command Injection:</strong> Blocks dangerous terminal commands including <code className="text-red-400 font-mono text-xs">rm -rf /</code>, pipe-to-shell (<code className="text-red-400 font-mono text-xs">curl | sh</code>), and privilege escalations (<code className="text-red-400 font-mono text-xs">chmod 777</code>).</li>
                    <li><strong>Directory Traversal:</strong> Blocks parameter payloads attempting to escape workspace boundaries via <code className="text-red-400 font-mono text-xs">../../etc/passwd</code>.</li>
                  </ul>
                </div>
              </div>
            )}

                        {/* ========================================================================= */}
            {/* ADAPTER: UNIVERSAL AI AGENT (ANY STACK)                                   */}
            {/* ========================================================================= */}
            {activeDocId === "universal-agent" && (
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#34D59A]/20 text-[#34D59A] border border-[#34D59A]/30 mb-3">
                    Universal Adapter
                  </div>
                  <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Universal AI Agent Integration (Any Framework)
                  </h1>
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Sevlex is completely decoupled from any single coding tool or language. Whether you run Python (LangChain, CrewAI, AutoGen, LlamaIndex), Node/TypeScript (Vercel AI SDK, Mastra), or autonomous daemons, Sevlex transparently intercepts standard Model Context Protocol (MCP) tool calls over <strong>stdio</strong> or <strong>SSE</strong>.
                  </p>
                </div>

                {/* Wire Architecture */}
                <div id="universal-mental-model" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    The Universal Wire Architecture
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Every AI agent framework interacts with MCP tools using the standard JSON-RPC 2.0 specification (<code className="font-mono text-emerald-400">tools/call</code>). Instead of pointing your agent directly to an unmonitored script or database, you point it to Sevlex:
                  </p>
                  <CodeBlock
                    id="code-universal-wire"
                    language="text"
                    filename="stdio-vs-sse-conduit.txt"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`[ ANY AI AGENT ] (Python / Node / Go / Rust / Cursor / Claude)
       │
       ▼  JSON-RPC 2.0 (tools/call)
┌────────────────────────────────────────────────────────┐
│             SEVLEX LAYER 7 MCP GATEWAY                 │
│  • AST DPI Parsing (<0.42ms)   • Secret DLP Masking    │
│  • Rate & Loop Circuit Breaker • Merkle WAL Ledger     │
└────────────────────────────────────────────────────────┘
       │
       ▼  Sanitized Execution
[ MCP TOOL SERVERS ] (PostgreSQL, Filesystem, GitHub, Custom Microservices)`}
                  />
                </div>

                {/* Python Agents */}
                <div id="universal-python" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <Terminal className="size-5 text-emerald-400" />
                    Python Agents (LangChain, CrewAI, AutoGen, LlamaIndex)
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    In Python, instantiate an MCP stdio client that wraps your downstream tool server through <code className="font-mono text-emerald-400">npx sevlex proxy</code>:
                  </p>
                  <CodeBlock
                    id="code-universal-py"
                    language="python"
                    filename="secure_agent.py"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def run():
    # Pass your existing tool command into Sevlex Gateway proxy
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "sevlex", "proxy", "--upstream-command", "python", "--upstream-args", "my_tools.py"],
        env=None
    )
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            # Invocations are automatically governed by sevlex.config.ts
            result = await session.call_tool("read_data", {"table": "analytics"})
            print(result)

asyncio.run(run())`}
                  />
                </div>

                {/* TypeScript / Node Agents */}
                <div id="universal-node" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <Code2 className="size-5 text-blue-400" />
                    TypeScript &amp; Node Agents (Vercel AI SDK, Mastra)
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    For Node.js or edge agent workers, connect to Sevlex using the native SDK or Remote SSE endpoint:
                  </p>
                  <CodeBlock
                    id="code-universal-node"
                    language="typescript"
                    filename="agent.ts"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`import { SevlexGatewayClient } from "@sevlex/gateway";

// Connect to local or cloud Sevlex Gateway instance
const gateway = new SevlexGatewayClient({
  endpoint: process.env.SEVLEX_GATEWAY_URL || "http://localhost:8080/sse",
  apiKey: process.env.SEVLEX_API_KEY,
});

// Retrieve tools equipped with in-flight AST deep packet inspection
const tools = await gateway.getWrappedTools();`}
                  />
                </div>

                {/* Stdio vs SSE */}
                <div id="universal-stdio-sse" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    Stdio vs. Remote SSE Transport
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${
                      isDark ? "bg-[#111318] border-[#222530]" : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className="font-semibold text-emerald-400 text-sm mb-1">Standard I/O (stdio)</div>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Best for local workstations and coding IDEs (Cursor, Claude Desktop). Zero port binding or network permissions. Fast Unix pipe transport with &lt;0.42ms overhead.
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${
                      isDark ? "bg-[#111318] border-[#222530]" : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className="font-semibold text-blue-400 text-sm mb-1">Server-Sent Events (SSE)</div>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Best for production Docker containers, Kubernetes pods, and cloud agent workers (Fly.io, AWS, Railway). HTTP streaming transport with Bearer token authentication.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auto-Wrapping */}
                <div id="universal-zero-config" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    Wrapping Existing MCP Tool Servers
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    You never need to rewrite your tool code. Wrap any pre-existing MCP server (Postgres, GitHub, Slack, Brave Search) by simply prepending Sevlex:
                  </p>
                  <CodeBlock
                    id="code-universal-wrap"
                    language="bash"
                    filename="Terminal"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`# Wrap any existing stdio MCP server command:
npx sevlex proxy -- npx -y @modelcontextprotocol/server-postgres postgresql://user:pass@localhost/db`}
                  />
                </div>

                {/* Protocol Error Handling */}
                <div id="universal-jsonrpc-contract" className="scroll-mt-24 space-y-4">
                  <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    JSON-RPC 2.0 Error Interception Contract
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    When an agent attempts a quarantined action (e.g., <code className="font-mono text-emerald-400">DROP TABLE</code>), Sevlex does <strong>not</strong> crash the process pipe or close stdio. Instead, it returns a standard JSON-RPC error with code <code className="font-mono text-emerald-400">-32000</code>. This allows the LLM agent to intelligently recover, apologize, and choose a safe alternative path without session failure:
                  </p>
                  <CodeBlock
                    id="code-universal-jsonrpc-error"
                    language="json"
                    filename="JSON-RPC 2.0 Interception Response"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`{
  "jsonrpc": "2.0",
  "id": 4,
  "error": {
    "code": -32000,
    "message": "[SEVLEX_INTERCEPT] Destructive SQL DDL statement blocked: DROP TABLE is not permitted in strict mode.",
    "data": {
      "violation": "denySqlStatements",
      "targetTable": "production_users",
      "quarantinedBytes": 42,
      "latencyMs": 0.38
    }
  }
}`}
                  />
                </div>
              </div>
            )}


            {/* ADAPTER: CURSOR */}
            {activeDocId === "cursor" && (
              <div className="space-y-6">
                <div id="cursor-config" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Cursor Composer and Agent Mode connect to MCP tools using JSON configurations in <code className="font-mono text-xs text-emerald-500">~/.cursor/mcp.json</code>.
                  </p>
                  <CodeBlock
                    id="code-cursor-json"
                    language="json"
                    filename="~/.cursor/mcp.json"
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
                </div>
              </div>
            )}

            {/* ADAPTER: CLAUDE */}
            {activeDocId === "claude" && (
              <div className="space-y-6">
                <div id="claude-desktop-json" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Configure Claude Desktop and Claude Code CLI to route through Sevlex transparently:
                  </p>
                  <CodeBlock
                    id="code-claude-config"
                    language="json"
                    filename="claude_desktop_config.json"
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
              </div>
            )}

            {/* ADAPTER: WINDSURF */}
            {activeDocId === "windsurf" && (
              <div className="space-y-6">
                <div id="windsurf-mcp" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Route Windsurf Cascade Agent tools through the Sevlex proxy in <code className="font-mono text-xs text-emerald-500">~/.codeium/windsurf/mcp_config.json</code>:
                  </p>
                  <CodeBlock
                    id="code-windsurf-config"
                    language="json"
                    filename="mcp_config.json"
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
              </div>
            )}

            {/* ADAPTER: ANTIGRAVITY */}
            {activeDocId === "antigravity" && (
              <div className="space-y-6">
                <div id="antigravity-skills" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Guard Google Antigravity autonomous agent swarms and skill executions against unauthorized file modifications or credential access.
                  </p>
                  <CodeBlock
                    id="code-antigravity-config"
                    language="typescript"
                    filename="antigravity.config.ts"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`import { wrapAntigravitySkills } from '@sevlex/gateway';

export const skills = wrapAntigravitySkills({
  enforceSanctuaryGuardrails: true,
  quarantineDestructiveBash: true,
  auditLedger: 'neon-postgres',
});`}
                  />
                </div>
              </div>
            )}

            {/* ADAPTER: NEON POSTGRES */}
            {activeDocId === "neon-adapter" && (
              <div className="space-y-6">
                <div id="neon-mcp-tool" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Provide AI coding agents with direct Lakebase Postgres capabilities on Neon while enforcing zero destructive DDL mutations:
                  </p>
                  <CodeBlock
                    id="code-neon-adapter"
                    language="json"
                    filename="mcp.neon.json"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`{
  "mcpServers": {
    "neon-lakebase": {
      "command": "npx",
      "args": ["-y", "sevlex", "wrap", "--", "npx", "-y", "@neondatabase/mcp-server-postgres"]
    }
  }
}`}
                  />
                </div>
              </div>
            )}

            {/* ADAPTER: NODE SDK */}
            {activeDocId === "node-sdk" && (
              <div className="space-y-6">
                <div id="node-install" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Integrate Sevlex directly into your custom backend microservices or AI agent runtime pipelines:
                  </p>
                  <CodeBlock
                    id="code-node-sdk"
                    language="typescript"
                    filename="server.ts"
                    isDark={isDark}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                    code={`import { createGateway } from '@sevlex/gateway';

const app = createGateway({
  port: 8080,
  interceptors: ['ast-dpi', 'dlp-redact', 'merkle-proof'],
});

app.listen(() => console.log('Sevlex L7 Zero-Trust Gateway running on :8080'));`}
                  />
                </div>
              </div>
            )}

            {/* DOCS: CLI */}
            {activeDocId === "cli" && (
              <div className="space-y-6">
                <div id="cli-init" className="scroll-mt-24">
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
              </div>
            )}

            {/* DOCS: API */}
            {activeDocId === "api" && (
              <div className="space-y-6">
                <div id="api-health" className="scroll-mt-24">
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
              </div>
            )}

            {/* DOCS: DATABASE */}
            {activeDocId === "database" && (
              <div className="space-y-6">
                <div id="db-schema" className="scroll-mt-24">
                  <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Sevlex syncs audit receipts permanently to Neon Lakebase PostgreSQL.
                  </p>
                  <CodeBlock
                    id="code-db-schema"
                    language="sql"
                    filename="schema.sql"
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
              </div>
            )}

            {/* DOCS: ENV */}
            {activeDocId === "env" && (
              <div className="space-y-6">
                <div id="env-vars" className="scroll-mt-24">
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
              </div>
            )}

          </div>
        </main>

        {/* RIGHT COLUMN: Table of Contents ("On this page" - Corsair Style) */}
        <aside
          className={`w-64 shrink-0 hidden xl:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pl-6 border-l transition-colors ${
            isDark ? "border-[#1E2028]" : "border-[#E5E7EB]"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <ListFilter className="w-3.5 h-3.5" />
              <span>On this page</span>
            </div>

            <ul className="space-y-2 text-xs">
              {currentItem.toc && currentItem.toc.length > 0 ? (
                currentItem.toc.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={`block py-1 transition-colors leading-relaxed ${
                        isDark
                          ? "text-gray-400 hover:text-emerald-400 hover:translate-x-0.5"
                          : "text-gray-600 hover:text-emerald-600 hover:translate-x-0.5"
                      }`}
                    >
                      {heading.title}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-xs italic">Overview section</li>
              )}
            </ul>

            {/* Quick Links in TOC */}
            <div className="pt-6 border-t border-inherit space-y-2">
              <a
                href="https://github.com/Sevlex/sevlex-mcp-gateway"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
              <Link
                href="/console"
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Launch SecOps Console</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
          isDark ? "border-[#242628] text-[#797D86]" : "border-slate-200 text-slate-500"
        }`}
      >
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
          <a href="/product" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
            Product
          </a>
          <a href="/service" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
            Service
          </a>
          <a href="/about" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
            About
          </a>
          <a href="/docs" className="text-[#34D59A] font-medium">
            Docs
          </a>
          <a href="/privacy" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
            Privacy
          </a>
          <a href="/terms" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
            Terms
          </a>
          <a href="/console" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
            Console
          </a>
        </div>
      </footer>

      {/* Global Search Modal */}
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
                placeholder="Search docs, adapters, and guides..."
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
              {allDocs
                .filter(
                  (item) =>
                    !searchQuery ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.breadcrumb.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      // Switch top section tab appropriately
                      if (DOCS_NAV_GROUPS.some((g) => g.items.some((i) => i.id === item.id))) {
                        setSectionTab("docs");
                      } else if (ADAPTERS_NAV_GROUPS.some((g) => g.items.some((i) => i.id === item.id))) {
                        setSectionTab("adapters");
                      } else {
                        setSectionTab("guides");
                      }
                      setActiveDocId(item.id);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      isDark ? "hover:bg-[#1A1D27] text-gray-200" : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-[10px] text-gray-400">{item.breadcrumb}</div>
                      </div>
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

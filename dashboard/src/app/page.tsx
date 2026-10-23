"use client";

import React, { useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Check,
  Plus,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  Terminal,
  Cpu,
  Lock,
  Eye,
  FileCode,
  Activity,
  Layers,
  Sparkles,
  Database,
  Server,
  AlertTriangle,
  CheckCircle2,
  Copy,
} from "lucide-react";
import ClientBrandIcon, { getLogoDevUrl } from "./components/ClientBrandIcon";

interface ConnectorItem {
  id: string;
  name: string;
  domain: string;
  tools: number;
  resources: number;
  prompts: number;
  description: string;
  category: string;
  defaultConnected?: boolean;
}

const HERO_CONNECTORS: ConnectorItem[] = [
  {
    id: "atlassian",
    name: "Atlassian",
    domain: "atlassian.com",
    tools: 5,
    resources: 4,
    prompts: 1,
    description: "Jira issue tracking and Confluence wiki access",
    category: "Productivity",
    defaultConnected: true,
  },
  {
    id: "compresto",
    name: "Comprendo MCP",
    domain: "openai.com",
    tools: 6,
    resources: 2,
    prompts: 6,
    description: "Advanced semantic code search and indexing",
    category: "Developer",
    defaultConnected: false,
  },
  {
    id: "linear",
    name: "Linear",
    domain: "linear.app",
    tools: 16,
    resources: 3,
    prompts: 2,
    description: "Issue tracking, project roadmap, and cycle management",
    category: "Productivity",
    defaultConnected: true,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    domain: "perplexity.ai",
    tools: 8,
    resources: 2,
    prompts: 2,
    description: "Live web search, citation analysis, and source verification",
    category: "Intelligence",
    defaultConnected: true,
  },
  {
    id: "shortcut",
    name: "Shortcut",
    domain: "shortcut.com",
    tools: 6,
    resources: 2,
    prompts: 6,
    description: "Engineering sprint planning and agile boards",
    category: "Productivity",
    defaultConnected: false,
  },
  {
    id: "slack",
    name: "Slack",
    domain: "slack.com",
    tools: 8,
    resources: 3,
    prompts: 1,
    description: "Team chat, channels, and incident dispatching",
    category: "Communication",
    defaultConnected: true,
  },
  {
    id: "github",
    name: "GitHub",
    domain: "github.com",
    tools: 12,
    resources: 4,
    prompts: 1,
    description: "Code repository, PR review, and commit management",
    category: "Developer",
    defaultConnected: true,
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    domain: "postgresql.org",
    tools: 8,
    resources: 2,
    prompts: 2,
    description: "Direct SQL queries, schema inspection, and migrations",
    category: "Database",
    defaultConnected: true,
  },
];

const CAPABILITY_CARDS = [
  {
    id: "github",
    name: "GitHub",
    domain: "github.com",
    desc: "GitHub MCP server for code and repository management",
    connected: true,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    domain: "microsoft.com",
    desc: "Microsoft MCP for managing email, calendar, and contacts",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    domain: "slack.com",
    desc: "Slack MCP server for team communication and collaboration",
    connected: true,
  },
  {
    id: "granola",
    name: "Granola",
    domain: "granola.so",
    desc: "Granola MCP server for meeting transcription and notetaking",
    connected: false,
  },
  {
    id: "sentry",
    name: "Sentry",
    domain: "sentry.io",
    desc: "Sentry MCP server for error monitoring and triage",
    connected: true,
  },
  {
    id: "asana",
    name: "Asana",
    domain: "asana.com",
    desc: "Asana MCP server for project management, task tracking, and work",
    connected: false,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    domain: "zendesk.com",
    desc: "Zendesk MCP server for support tickets and case management",
    connected: false,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    domain: "microsoft.com",
    desc: "Microsoft MCP for team chat, video calls, and channels",
    connected: false,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    domain: "salesforce.com",
    desc: "Salesforce MCP server for CRM records, leads, and customer data",
    connected: true,
  },
];

const CUSTOMER_LOGOS = [
  { name: "Decagon", domain: "decagon.ai" },
  { name: "Lemonade", domain: "lemonade.com" },
  { name: "Gusto", domain: "gusto.com" },
  { name: "Opendoor", domain: "opendoor.com" },
  { name: "PagerDuty", domain: "pagerduty.com" },
  { name: "AppLovin", domain: "applovin.com" },
  { name: "Baseten", domain: "baseten.co" },
];

const FAQ_ITEMS = [
  {
    question: "How is Sevlex different from a standalone MCP proxy?",
    answer:
      "A standalone proxy merely forwards stdio or SSE packets without inspection. Sevlex adds deep AST packet inspection (Layer 7 DPI), automated client discovery, identity-aware RBAC, real-time DLP credential redaction, human-in-the-loop (HITL) approval gates, and a cryptographic SHA-256 Merkle audit trail for every single tool invocation.",
  },
  {
    question: "Can we protect internal custom MCP servers?",
    answer:
      "Yes. Platform and security engineers can wrap any custom MCP server running via stdio, HTTP, or SSE in under 30 seconds using 'npx sevlex init'. Sevlex automatically injects tamper-resistant proxy hooks without requiring code rewrites.",
  },
  {
    question: "Does the Sevlex gateway grant new permissions to agents?",
    answer:
      "No. Sevlex operates strictly as a zero-trust policy gatekeeper. It enforces the principle of least privilege, preventing autonomous agents from exceeding their sanctioned roles, exfiltrating credentials (e.g. .env, AWS keys), or executing destructive commands (e.g. DROP TABLE).",
  },
  {
    question: "Which AI clients are supported out of the box?",
    answer:
      "Sevlex natively shields Claude Desktop, Claude Code CLI, Cursor IDE, Windsurf IDE, Google Antigravity, VS Code, and custom autonomous agents running via Python or Node.js SDKs.",
  },
  {
    question: "How do employees get access to a new MCP server?",
    answer:
      "Employees browse the sanctioned Connector Catalog or request access with a single click. Security teams review requests via Slack, PagerDuty, or the central SecOps Console with immediate approval or rejection.",
  },
  {
    question: "Can policy be limited to specific tools inside an MCP server?",
    answer:
      "Yes. Sevlex policies can be scoped at the server level, specific tool level (e.g., allow 'github.read_file' but quarantine 'github.delete_repository'), specific parameter pattern, user identity, group, client runtime, or environmental condition.",
  },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    HERO_CONNECTORS.forEach((c) => {
      init[c.id] = Boolean(c.defaultConnected);
    });
    return init;
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [copiedCli, setCopiedCli] = useState(false);

  const filteredConnectors = useMemo(() => {
    if (!searchQuery.trim()) return HERO_CONNECTORS;
    const q = searchQuery.toLowerCase();
    return HERO_CONNECTORS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleConnector = (id: string) => {
    setConnectedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText("npx sevlex init");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans antialiased selection:bg-[#1C1917] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP STICKY NAVIGATION BAR                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#F5F5F4]/90 backdrop-blur-md border-b border-stone-300">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-x border-stone-300">
          {/* Logo & Brand Mark */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sevlex-brand-horizontal.png"
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] text-stone-700 font-medium">
            <a href="#capabilities" className="hover:text-stone-950 transition-colors">
              Connectors
            </a>
            <a href="#policy" className="hover:text-stone-950 transition-colors">
              Policy &amp; L7
            </a>
            <a href="#audit" className="hover:text-stone-950 transition-colors">
              Runtime Audit
            </a>
            <a href="#docs" className="hover:text-stone-950 transition-colors">
              Documentation
            </a>
            <a href="#faq" className="hover:text-stone-950 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-950 transition px-3 py-1.5 font-medium"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="/console"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-50 transition shadow-xs"
            >
              Sign In
            </a>

            <a
              href="https://calendly.com/meetpxnchl/meeting"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center border border-[#1C1917] bg-[#1C1917] px-4 py-1.5 text-xs font-medium text-[#FAFAFA] hover:bg-stone-800 transition"
            >
              Book a demo
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Clean Split-Screen Grid Matching Runlayer)                */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white grid grid-cols-1 lg:grid-cols-[750fr_610fr]">
        {/* Left Column: Editorial Display Typography */}
        <div className="flex flex-col justify-end p-6 sm:p-10 lg:p-14 lg:border-r border-stone-300">
          <div className="space-y-4 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-stone-500 font-semibold">
              Sevlex MCP Gateway
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-[70px] font-medium leading-[1.04] tracking-[-0.04em] text-stone-900 text-balance">
              Make approved MCP access the default
            </h1>
          </div>

          <div className="mt-8 sm:mt-12 space-y-6 max-w-lg">
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              Make approved MCP access easy to use from Claude, Cursor, ChatGPT, Codex, and autonomous agents with policy, OAuth, runtime security, and an audit trail for every request.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/console"
                className="inline-flex items-center justify-center border border-[#1C1917] bg-[#1C1917] px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition"
              >
                Launch Console
              </a>
              <a
                href="#docs"
                className="inline-flex items-center justify-center border border-stone-300 bg-stone-50 px-5 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-100 transition"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive "Add connectors" Panel */}
        <div className="bg-[#FAF9F6] p-6 sm:p-8 flex items-center justify-center border-t lg:border-t-0 border-stone-300">
          <div className="w-full max-w-md bg-white border border-stone-300 shadow-md overflow-hidden">
            {/* Panel Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <h2 className="text-sm font-semibold text-stone-900 tracking-tight">Add connectors</h2>
              <span className="text-[11px] font-mono text-stone-500">
                {Object.values(connectedMap).filter(Boolean).length} Active
              </span>
            </div>

            {/* Keyword Search Input */}
            <div className="p-3 border-b border-stone-200">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search with keywords..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-none bg-stone-50/40 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Connector List */}
            <div className="divide-y divide-stone-100 max-h-[360px] overflow-y-auto">
              {filteredConnectors.map((item) => {
                const isConnected = connectedMap[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between hover:bg-stone-50/60 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={Boolean(isConnected)}
                        onChange={() => toggleConnector(item.id)}
                        className="size-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getLogoDevUrl(item.domain, 64)}
                        alt={item.name}
                        className="size-5 object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-stone-900 truncate">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-mono truncate">
                          {item.tools} tools • {item.resources} resources • {item.prompts} prompts
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isConnected ? (
                        <button
                          onClick={() => toggleConnector(item.id)}
                          className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 hover:bg-emerald-100 transition cursor-pointer"
                        >
                          Connected
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleConnector(item.id)}
                          className="text-[11px] font-medium text-stone-800 border border-stone-300 bg-white px-2.5 py-0.5 hover:bg-stone-100 transition cursor-pointer"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BLUEPRINT STRIP (Runlayer Repeating Track)                             */}
      {/* ========================================================================= */}
      <div className="max-w-[1360px] mx-auto border-x border-b border-stone-300 h-9 flex items-center bg-[#F5F5F4]">
        <div className="h-[14px] w-full flex flex-col justify-between px-2">
          <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,#D6D3D1_0_2px,transparent_2px_6px)]" />
          <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,#D6D3D1_0_2px,transparent_2px_6px)]" />
          <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,#D6D3D1_0_2px,transparent_2px_6px)]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CUSTOMER SOCIAL PROOF GRID (Clean Monochrome Logos)                     */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-y lg:divide-y-0 divide-stone-300">
          {CUSTOMER_LOGOS.map((cust) => (
            <div
              key={cust.name}
              className="h-16 sm:h-20 flex items-center justify-center p-4 group hover:bg-stone-50 transition"
            >
              <div className="flex items-center gap-2 opacity-75 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getLogoDevUrl(cust.domain, 64)}
                  alt={cust.name}
                  className="size-5 object-contain"
                />
                <span className="font-semibold text-xs tracking-tight text-stone-900">
                  {cust.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BLUEPRINT STRIP                                                        */}
      {/* ========================================================================= */}
      <div className="max-w-[1360px] mx-auto border-x border-b border-stone-300 h-9 flex items-center bg-[#F5F5F4]">
        <div className="h-[14px] w-full flex flex-col justify-between px-2">
          <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,#D6D3D1_0_2px,transparent_2px_6px)]" />
          <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,#D6D3D1_0_2px,transparent_2px_6px)]" />
          <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,#D6D3D1_0_2px,transparent_2px_6px)]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. FEATURE 1: PUBLISH APPROVED CAPABILITIES ONCE                          */}
      {/* ========================================================================= */}
      <section id="capabilities" className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white grid grid-cols-1 lg:grid-cols-2">
        {/* Left Article */}
        <article className="p-8 sm:p-12 lg:p-16 flex flex-col justify-end lg:border-r border-stone-300">
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-stone-900 leading-tight">
              Publish approved capabilities once
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Start with built-in connectors, register existing MCP servers, or deploy custom MCP servers onto managed infrastructure. One simple place for employees to discover and request access to sanctioned connectors.
            </p>
          </div>
        </article>

        {/* Right 3x3 Connector Grid */}
        <div className="bg-[#FAF9F6] p-6 sm:p-10 border-t lg:border-t-0 border-stone-300 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
            {CAPABILITY_CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-stone-300 p-3.5 flex flex-col justify-between h-32 hover:border-stone-400 transition group shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getLogoDevUrl(card.domain, 64)}
                    alt={card.name}
                    className="size-5 object-contain"
                  />
                  <button className="text-stone-400 group-hover:text-stone-900 hover:bg-stone-100 p-0.5 transition cursor-pointer">
                    <Plus size={13} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-stone-900">{card.name}</h3>
                  <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FEATURE 2: MAKE ACCESS FOLLOW IDENTITY AND CONTEXT                     */}
      {/* ========================================================================= */}
      <section id="policy" className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Permission & Identity Policy Visualizer */}
        <div className="bg-[#FAF9F6] p-6 sm:p-10 lg:border-r border-stone-300 flex items-center justify-center">
          <div className="w-full max-w-md bg-white border border-stone-300 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                L7 Policy Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-bold">
                ENFORCED
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900">@sarah.chen (Eng Lead)</span>
                  <p className="text-[11px] text-stone-500 font-mono">Cursor IDE • postgres.read_schema</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  ALLOW (0.1ms)
                </span>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900">Autonomous Agent (Devin)</span>
                  <p className="text-[11px] text-stone-500 font-mono">Terminal CLI • postgres.drop_table</p>
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                  ARRESTED
                </span>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900">@alex.intern (Contractor)</span>
                  <p className="text-[11px] text-stone-500 font-mono">Claude Desktop • github.delete_repo</p>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                  HITL APPROVAL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Article */}
        <article className="p-8 sm:p-12 lg:p-16 flex flex-col justify-end border-t lg:border-t-0 border-stone-300">
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-stone-900 leading-tight">
              Make access follow identity and context
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Scope access by user, group, role, agent account, client, connector, tool, resource, OAuth state, network, and runtime condition before a call runs.
            </p>
          </div>
        </article>
      </section>

      {/* ========================================================================= */}
      {/* 8. FEATURE 3: USE RUNTIME ACTIVITY TO IMPROVE ROLLOUT                      */}
      {/* ========================================================================= */}
      <section id="audit" className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white grid grid-cols-1 lg:grid-cols-2">
        {/* Left Article */}
        <article className="p-8 sm:p-12 lg:p-16 flex flex-col justify-end lg:border-r border-stone-300">
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-stone-900 leading-tight">
              Use runtime activity to improve rollout
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Review actor, client, connector, tool, policy result, security scan metadata, and outcome so platform and security teams can refine MCP access based on real usage.
            </p>
          </div>
        </article>

        {/* Right Side: Runtime Activity Feed */}
        <div className="bg-[#FAF9F6] p-6 sm:p-10 border-t lg:border-t-0 border-stone-300 flex items-center justify-center">
          <div className="w-full max-w-md bg-white border border-stone-300 shadow-md p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-semibold text-stone-900">Runtime Audit Stream</span>
              <span className="text-[10px] text-stone-500">Live Wire</span>
            </div>

            <div className="p-2.5 bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-900 font-bold">github.create_pull_request</span>
                <span className="text-emerald-600 font-bold">ALLOWED</span>
              </div>
              <p className="text-[10px] text-stone-500">Actor: @meet • Client: Cursor IDE • Latency: 0.14ms</p>
            </div>

            <div className="p-2.5 bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-900 font-bold">bash.execute (&quot;cat .env&quot;)</span>
                <span className="text-red-600 font-bold">BLOCKED (DLP)</span>
              </div>
              <p className="text-[10px] text-stone-500">Credential Leak Arrested • Merkle Receipt #392</p>
            </div>

            <div className="p-2.5 bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-900 font-bold">slack.post_message</span>
                <span className="text-emerald-600 font-bold">ALLOWED</span>
              </div>
              <p className="text-[10px] text-stone-500">Actor: Incident Bot • Latency: 0.18ms</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. WORKS WITH YOUR EXISTING AI STACK                                      */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white grid grid-cols-1 lg:grid-cols-[796fr_566fr]">
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-end lg:border-r border-stone-300">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-stone-900 leading-tight">
              Works with your existing AI stack
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Employees keep their preferred AI clients. Platform and security teams get control, security, and governance over activities between clients and MCPs.
            </p>
          </div>
        </div>

        {/* Supported AI Clients Showcase */}
        <div className="bg-[#FAF9F6] p-8 border-t lg:border-t-0 border-stone-300 flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
            {[
              { name: "Claude Desktop", brand: "claude" },
              { name: "Cursor IDE", brand: "cursor" },
              { name: "Windsurf", brand: "windsurf" },
              { name: "Antigravity", brand: "antigravity" },
              { name: "Claude Code CLI", brand: "claude" },
              { name: "Node SDK", brand: "node" },
            ].map((client) => (
              <div
                key={client.name}
                className="bg-white border border-stone-300 p-3 flex items-center gap-2.5 hover:border-stone-400 transition"
              >
                <ClientBrandIcon name={client.brand} size="sm" />
                <span className="text-xs font-semibold text-stone-800">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. DEVELOPER DOCUMENTATION & LLMS.TXT SPECIFICATION                      */}
      {/* ========================================================================= */}
      <section id="docs" className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white p-8 sm:p-14">
        <div className="max-w-3xl mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-stone-500 font-semibold mb-2">
            Developer Documentation
          </p>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-stone-900">
            One command to shield your tools
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            Wrap existing stdio and SSE MCP servers across local IDEs and cloud environments without writing firewall code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CLI Terminal Card */}
          <div className="border border-stone-300 bg-stone-900 text-stone-100 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <span className="font-mono text-xs text-stone-400">Terminal Quickstart</span>
              <button
                onClick={copyCliCommand}
                className="text-xs text-stone-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCli ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCli ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="font-mono text-xs sm:text-sm text-emerald-400 space-y-1">
              <code>$ npx sevlex init</code>
            </pre>
            <p className="font-mono text-[11px] text-stone-400 mt-3 leading-relaxed">
              Automatically discovers Claude Desktop, Cursor, and Antigravity, injects the Layer 7 inspection proxy, and preserves untouched safety backups (*.sevlex.bak).
            </p>
          </div>

          {/* Machine Spec (llms.txt) Card */}
          <div className="border border-stone-300 bg-[#FAF9F6] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase text-stone-500 font-semibold">
                  Agent Specification
                </span>
                <span className="text-[10px] font-mono font-bold text-stone-700 bg-stone-200 px-2 py-0.5">
                  llms.txt Standard
                </span>
              </div>
              <h3 className="text-base font-semibold text-stone-900">Machine-Readable Manifest</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Structured plain-text specification optimized for Claude Code, Cursor, and autonomous agents to parse CLI commands without web scraping.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <code className="text-xs font-mono text-stone-700 bg-white px-2.5 py-1 border border-stone-300">
                curl -s sevlex.com/llms.txt
              </code>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-stone-900 hover:underline inline-flex items-center gap-1"
              >
                <span>Read llms.txt</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FREQUENTLY ASKED QUESTIONS (Runlayer Editorial Accordion)              */}
      {/* ========================================================================= */}
      <section id="faq" className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white grid grid-cols-1 md:grid-cols-[420px_1fr]">
        <div className="p-8 sm:p-12 md:border-r border-stone-300">
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-stone-900 leading-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="divide-y divide-stone-300">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="transition-colors hover:bg-stone-50">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-medium text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-sm text-stone-600 leading-relaxed max-w-2xl">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. BOTTOM CONSOLE CTA                                                    */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white p-8 sm:p-14 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-stone-900">
            Start governing MCP access today
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            One command connects your engineering team to approved tools with full policy enforcement and audit trails.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/console"
              className="inline-flex items-center justify-center border border-[#1C1917] bg-[#1C1917] px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition"
            >
              Launch SecOps Console
            </a>
            <a
              href="https://calendly.com/meetpxnchl/meeting"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center border border-stone-300 bg-stone-50 px-6 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-100 transition"
            >
              Book an Enterprise Demo
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. MINIMALIST RUNLAYER-STYLE FOOTER                                      */}
      {/* ========================================================================= */}
      <footer className="max-w-[1360px] mx-auto border-x border-b border-stone-300 bg-white px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mono">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sevlex-brand-horizontal.png"
            alt="Sevlex"
            className="h-5 w-auto object-contain opacity-80"
          />
          <span>&copy; {new Date().getFullYear()} Sevlex Inc. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a href="#capabilities" className="hover:text-stone-900 transition">Connectors</a>
          <a href="#policy" className="hover:text-stone-900 transition">Policy</a>
          <a href="#docs" className="hover:text-stone-900 transition">Docs</a>
          <a href="/llms.txt" target="_blank" className="hover:text-stone-900 transition">llms.txt</a>
          <a href="/console" className="hover:text-stone-900 transition">Console</a>
          <a
            href="https://github.com/Sevlex/sevlex-mcp-gateway"
            target="_blank"
            rel="noreferrer"
            className="hover:text-stone-900 transition"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

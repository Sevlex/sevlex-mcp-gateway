"use client";

import React, { useState } from "react";
import {
  Database,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  FileCode,
  Terminal,
  Send,
  Lock,
  Layers,
  Sun,
  Moon,
  ExternalLink,
  Cpu,
  Workflow,
  Globe2,
  Server,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

interface ServiceItem {
  id: string;
  type: "TYPE_A" | "TYPE_B";
  typeLabel: string;
  title: string;
  badge: string;
  sla: string;
  tagline: string;
  whatItDoes: string;
  deliverables: string[];
  targetBuyer: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const SERVICES: ServiceItem[] = [
  // TYPE A: Internal Services
  {
    id: "safe-db",
    type: "TYPE_A",
    typeLabel: "TYPE A: INTERNAL ENTERPRISE",
    title: "Safe Database MCP Bridge",
    badge: "Flagship Internal",
    sla: "48-Hour Delivery SLA",
    tagline: "Connect private relational & document databases to Claude, Cursor, and Antigravity with zero destructive risk.",
    whatItDoes:
      "Eliminates the danger of hallucinated LLM queries. Enables engineers to safely query production or read-replica databases using natural language while Sevlex AST firewalls block destructive operations before they hit the wire.",
    deliverables: [
      "Full TypeScript / Node.js MCP server with connection pooling",
      "Sevlex AST read-only guardrails: kills DROP, DELETE, ALTER in <0.4ms",
      "In-flight DLP masking for passwords, hashes, and sensitive PII",
      "Ready-to-use configs for Claude Desktop, Cursor IDE & Antigravity",
    ],
    targetBuyer: "CTOs, VPs of Engineering, Lead Data Engineers",
    icon: Database,
    accentColor: "#34D59A",
  },
  {
    id: "openapi-porting",
    type: "TYPE_A",
    typeLabel: "TYPE A: INTERNAL ENTERPRISE",
    title: "Internal Microservice & OpenAPI-to-MCP Porting",
    badge: "High Efficiency",
    sla: "72-Hour Delivery SLA",
    tagline: "Convert internal Swagger / OpenAPI specs, REST, or GraphQL endpoints into a unified AI tool suite.",
    whatItDoes:
      "Transforms your private internal microservices and APIs into high-precision Model Context Protocol tools, enabling your developers to trigger complex backend workflows through natural language prompts.",
    deliverables: [
      "15–30 curated endpoints mapped into natural language tools",
      "Strict parameter schemas, type validation, and payload bounds",
      "Comprehensive error handling and fallback recovery routines",
      "Local stdio or secure internal SSE transport configuration",
    ],
    targetBuyer: "Engineering Directors, Platform Leads, Backend Architects",
    icon: Layers,
    accentColor: "#34D59A",
  },
  {
    id: "devops-logs",
    type: "TYPE_A",
    typeLabel: "TYPE A: INTERNAL ENTERPRISE",
    title: "DevOps & Incident Logs MCP",
    badge: "SRE Essential",
    sla: "72-Hour Delivery SLA",
    tagline: "Connect Cursor and Claude directly to CloudWatch, Datadog, or Sentry for instant on-call error triage.",
    whatItDoes:
      "Lets on-call engineers pull crash stack traces, query recent log streams, and diagnose production incidents directly inside their IDE without switching between 5 separate browser dashboards.",
    deliverables: [
      "Read-only log query endpoints with strict parameter bounding",
      "Crash stack trace parsing and automated anomaly summary tools",
      "Credential isolation and enterprise secret vault integration",
      "Runbook automation triggers with read-only execution guarantees",
    ],
    targetBuyer: "SRE Managers, DevOps Leads, Head of Infrastructure",
    icon: Terminal,
    accentColor: "#34D59A",
  },
  {
    id: "security-hardening",
    type: "TYPE_A",
    typeLabel: "TYPE A: INTERNAL ENTERPRISE",
    title: "Zero-Trust Security & SOC 2 Hardening",
    badge: "Compliance Ready",
    sla: "3–5 Business Days SLA",
    tagline: "Wrap existing internal MCP servers with enterprise-grade guardrails to pass InfoSec and compliance audits.",
    whatItDoes:
      "Built for teams whose security or compliance teams flagged or blocked an internal MCP server. We wrap your existing tools with Sevlex Layer 7 ToolGuard™ to satisfy SOC 2, ISO 27001, and HIPAA compliance requirements.",
    deliverables: [
      "Sevlex Layer 7 ToolGuard™ parameter AST inspection firewall",
      "In-flight DLP data sanitization and output token redactor",
      "Velocity circuit breakers preventing runaway LLM execution loops",
      "Cryptographic Merkle audit ledger logging every query and response",
    ],
    targetBuyer: "CISOs, AppSec Engineers, Compliance Directors",
    icon: Lock,
    accentColor: "#A855F7",
  },
  {
    id: "fleet-rollout",
    type: "TYPE_A",
    typeLabel: "TYPE A: INTERNAL ENTERPRISE",
    title: "Fleet-Wide IDE Rollout (20–100+ Developers)",
    badge: "Scale & MDM",
    sla: "5 Business Days SLA",
    tagline: "Standardize and centrally distribute approved MCP configurations across your entire engineering team.",
    whatItDoes:
      "Eliminates configuration drift, manual JSON copy-pasting, and security exposures by provisioning centralized, IT-managed MCP client settings across your entire engineering fleet.",
    deliverables: [
      "Automated Jamf (macOS) and Microsoft Intune (Windows) rollout scripts",
      "Centralized registry configurations locked against unauthorized edits",
      "Automated environment variable and secret credential provisioning",
      "Developer onboarding documentation and team verification tests",
    ],
    targetBuyer: "IT Directors, Platform VPs, Engineering Operations Leads",
    icon: FileCode,
    accentColor: "#34D59A",
  },

  // TYPE B: Commercial Services
  {
    id: "saas-flagship",
    type: "TYPE_B",
    typeLabel: "TYPE B: COMMERCIAL SAAS",
    title: "Official Multi-Tenant SaaS MCP Connector",
    badge: "The Flagship Connector",
    sla: "10 Business Days SLA",
    tagline: "An official public-facing MCP connector for your SaaS product so external customers can use it in Claude & Cursor.",
    whatItDoes:
      "Positions your SaaS product directly inside the modern AI workflow. Enables your paying users to invoke your APIs and trigger workflows directly from natural language prompts inside Cursor, Claude Desktop, and Antigravity.",
    deliverables: [
      "24/7 cloud-hosted remote Server-Sent Events (SSE) server",
      "OAuth 2.0 PKCE user delegation ('Sign in with [Your App]'—no manual API keys)",
      "Strict multi-tenant data isolation guaranteeing zero cross-customer data leakage",
      "Enterprise rate limiting, session management, and comprehensive test suite",
    ],
    targetBuyer: "Founders, Heads of Product, DevRel Leads at B2B SaaS Startups",
    icon: Sparkles,
    accentColor: "#38BDF8",
  },
  {
    id: "marketplace-distribution",
    type: "TYPE_B",
    typeLabel: "TYPE B: COMMERCIAL SAAS",
    title: "AI Marketplace Submission & Distribution Package",
    badge: "Distribution & Growth",
    sla: "3 Business Days SLA",
    tagline: "Package, verify, and publish your SaaS connector across the global AI tool ecosystem.",
    whatItDoes:
      "Maximizes adoption for your newly built connector by publishing it across premier Model Context Protocol registries and developer hubs with verified documentation and one-click install commands.",
    deliverables: [
      "Submission and verified listing on Smithery.ai and mcp.so registries",
      "Official npm registry publishing (@company/mcp-server) with CI/CD automation",
      "Branded 'Connect to Claude Desktop & Cursor' interactive quickstart guide",
      "GitHub documentation badges and community installation scripts",
    ],
    targetBuyer: "Growth Directors, DevRel Leads, Product Marketing Managers",
    icon: Globe2,
    accentColor: "#38BDF8",
  },
  {
    id: "slack-hitl",
    type: "TYPE_B",
    typeLabel: "TYPE B: COMMERCIAL SAAS",
    title: "Human-in-the-Loop (HITL) Slack Approval Gates",
    badge: "Critical Operations",
    sla: "3 Business Days SLA",
    tagline: "Add interactive managerial approval workflows before high-risk agent operations execute.",
    whatItDoes:
      "Prevents catastrophic autonomous actions (such as processing financial refunds, deleting customer accounts, or altering production DNS) by requiring explicit manager sign-off via Slack or Teams.",
    deliverables: [
      "Interactive Slack / Microsoft Teams cards with one-click 'Approve' / 'Deny' buttons",
      "Cryptographically signed authorization tokens with expiration timeouts",
      "Audit trail logging which team member authorized or declined each action",
      "Seamless resumption of the AI agent workflow upon authorization",
    ],
    targetBuyer: "Fintech, E-Commerce, and High-Risk Operational SaaS Products",
    icon: ShieldCheck,
    accentColor: "#38BDF8",
  },
  {
    id: "managed-cloud",
    type: "TYPE_B",
    typeLabel: "TYPE B: COMMERCIAL SAAS",
    title: "24/7 Managed Cloud Hosting & Monitoring (MaaS)",
    badge: "Zero Dev Overhead",
    sla: "Continuous Managed SLA",
    tagline: "Fully managed cloud infrastructure so your team never has to maintain or troubleshoot MCP servers.",
    whatItDoes:
      "Offloads server maintenance, remote SSE connection scaling, SSL renewals, and protocol upgrades entirely to our team, backed by an ironclad uptime SLA.",
    deliverables: [
      "99.9% uptime SLA with redundant multi-region cloud deployment",
      "Automated TLS / SSL certificate renewal and DDoS mitigation",
      "Real-time latency telemetry, error alerting, and operational monitoring",
      "Zero server maintenance required from your internal engineering team",
    ],
    targetBuyer: "B2B SaaS Founders, CTOs, and Infrastructure Leads",
    icon: Server,
    accentColor: "#38BDF8",
  },
  {
    id: "schema-evolution",
    type: "TYPE_B",
    typeLabel: "TYPE B: COMMERCIAL SAAS",
    title: "Schema & Frontier Model Evolution Retainer",
    badge: "Continuous Care",
    sla: "Ongoing Monthly Retainer",
    tagline: "Continuous care and tuning as your product APIs change and frontier LLMs release new reasoning models.",
    whatItDoes:
      "Ensures your MCP connector remains optimized as Anthropic, OpenAI, and Google release new model versions (Claude 3.7, GPT-5, Gemini 2.0) and as your core product ships new endpoints.",
    deliverables: [
      "Monthly schema updates and endpoint synchronizations as your product evolves",
      "Prompt fine-tuning and context optimization tailored to newest model architectures",
      "Tool hallucination testing and parameter bound adjustments",
      "Monthly tool usage volume, latency breakdown, and query telemetry reports",
    ],
    targetBuyer: "Commercial SaaS Clients with Active Connectors",
    icon: RefreshCw,
    accentColor: "#38BDF8",
  },
];

export default function ServicePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"ALL" | "TYPE_A" | "TYPE_B">("ALL");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectCategory: "Type A: Internal Enterprise MCP (Database / Private API / DevOps)",
    sourceType: "PostgreSQL Database",
    aiClient: "Claude Desktop & Cursor IDE",
    details: "",
  });

  const handleSelectService = (service: ServiceItem) => {
    setFormData((prev) => ({
      ...prev,
      projectCategory:
        service.type === "TYPE_A"
          ? "Type A: Internal Enterprise MCP (Database / Private API / DevOps)"
          : "Type B: Commercial SaaS Connector (Public / OAuth 2.0 / Remote SSE)",
      details: `Inquiring about: ${service.title} (${service.sla}).\n`,
    }));
    const el = document.getElementById("intake");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          details: `[Category: ${formData.projectCategory}]\n${formData.details}`,
        }),
      });
    } catch (err) {
      console.error("Intake submission fallback notice:", err);
    }
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const filteredServices = SERVICES.filter((s) => {
    if (activeTab === "ALL") return true;
    return s.type === activeTab;
  });

  return (
    <main
      className={`min-h-screen font-sans selection:bg-[#34D59A]/30 selection:text-white overflow-x-hidden transition-colors duration-200 ${
        isDark ? "bg-[#000000] text-[#F8FAFC]" : "bg-[#F8FAFC] text-[#090A0F]"
      }`}
    >
      {/* Precision hairline grid backdrop */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-200 ${
          isDark
            ? "bg-[linear-gradient(to_right,#131415_1px,transparent_1px),linear-gradient(to_bottom,#131415_1px,transparent_1px)] opacity-40 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            : "bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-35 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_0%,#000_60%,transparent_100%)]"
        }`}
      />

      {/* Atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.08),transparent_70%)] pointer-events-none" />

      {/* 1. STICKY NAVBAR */}
      <nav
        className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
          isDark
            ? "bg-[#000000]/85 border-b border-white/[0.08]"
            : "bg-white/85 border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        }`}
      >
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
          <div
            className={`hidden md:flex items-center gap-8 text-xs font-medium ${
              isDark ? "text-[#94979E]" : "text-[#6B7280]"
            }`}
          >
            <a href="/product" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              Product
            </a>
            <a href="/service" className="text-[#34D59A] font-semibold transition-colors">
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

      {/* 2. SERVICE HERO */}
      <section className="pt-20 pb-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium mb-6 ${
            isDark
              ? "bg-[#14161C] border border-white/[0.08] text-[#797D86]"
              : "bg-slate-100 border border-slate-300 text-slate-700 shadow-xs"
          }`}
        >
          <span className="text-[#34D59A] font-semibold">WHITE-GLOVE INTEGRATION</span>
          <span className={isDark ? "text-[#303236]" : "text-slate-300"}>•</span>
          <span className={isDark ? "text-[#C9CBCF]" : "text-slate-700"}>GUARANTEED SLAs</span>
          <span className={isDark ? "text-[#303236]" : "text-slate-300"}>•</span>
          <span className={isDark ? "text-[#AFB1B6]" : "text-slate-600"}>ZERO HOURLY OVERAGES</span>
        </div>

        <h1
          className={`text-4xl sm:text-6xl font-medium tracking-tight leading-[1.1] max-w-4xl mx-auto ${
            isDark ? "text-white" : "text-slate-950"
          }`}
        >
          Production MCP Servers &amp; Connectors Built in Days
        </h1>

        <p
          className={`mt-6 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto ${
            isDark ? "text-[#94979E]" : "text-slate-600"
          }`}
        >
          From internal databases and private microservices to official public SaaS distribution—we engineer hardened, zero-trust Model Context Protocol infrastructure with guaranteed turnaround SLAs and 100% code ownership.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#catalogue"
            className={`inline-flex items-center gap-2 h-11 px-7 rounded-full text-xs font-medium transition duration-200 shadow-lg ${
              isDark
                ? "bg-white text-black hover:bg-[#E4E5E7]"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <span>Explore All Solutions</span>
            <ArrowRight className="size-3.5" />
          </a>
          <a
            href="#intake"
            className={`inline-flex items-center gap-2 h-11 px-6 rounded-full border text-xs font-medium transition duration-200 ${
              isDark
                ? "border-white/[0.08] bg-[#16181F] hover:bg-white/[0.08] text-white"
                : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs"
            }`}
          >
            <span>Request Scoping Estimate</span>
          </a>
          <a
            href="https://calendly.com/meetpxnchl/meeting"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 h-11 px-6 rounded-full border text-xs font-medium transition duration-200 ${
              isDark
                ? "border-white/[0.08] bg-transparent hover:border-white/[0.2] text-[#C9CBCF] hover:text-white"
                : "border-slate-200 bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Book 15-Min Scoping Call</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Strategic Dual-Track Indicator */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDark
                ? "bg-[#0E1014]/80 border-emerald-500/20"
                : "bg-emerald-50/50 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-[#34D59A] animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#34D59A]">
                Track A: Internal Infrastructure
              </span>
            </div>
            <p className={`text-xs ${isDark ? "text-[#94979E]" : "text-slate-600"}`}>
              Built for your own engineering &amp; operations teams to query databases, microservices, and logs inside Claude, Cursor, and Antigravity.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDark
                ? "bg-[#0E1014]/80 border-sky-500/20"
                : "bg-sky-50/50 border-sky-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                Track B: Commercial SaaS Connectors
              </span>
            </div>
            <p className={`text-xs ${isDark ? "text-[#94979E]" : "text-slate-600"}`}>
              Built for B2B SaaS companies to distribute an official public-facing connector with OAuth 2.0 and remote SSE to their external paying customers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATALOGUE & INTERACTIVE FILTER */}
      <section
        id="catalogue"
        className={`py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-[#34D59A]" />
              <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-semibold">
                Services Portfolio
              </h2>
            </div>
            <p
              className={`mt-2 text-2xl sm:text-3xl font-medium tracking-tight ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Engineered MCP Solutions &amp; SLAs
            </p>
          </div>

          {/* Tab Filter Buttons */}
          <div
            className={`inline-flex items-center p-1 rounded-full border text-xs font-medium self-start md:self-auto ${
              isDark
                ? "bg-[#0E1014] border-white/[0.08]"
                : "bg-slate-100 border-slate-300"
            }`}
          >
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-1.5 rounded-full transition duration-150 cursor-pointer ${
                activeTab === "ALL"
                  ? isDark
                    ? "bg-white text-black shadow-xs"
                    : "bg-white text-slate-950 shadow-xs"
                  : isDark
                  ? "text-[#797D86] hover:text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              All Solutions ({SERVICES.length})
            </button>
            <button
              onClick={() => setActiveTab("TYPE_A")}
              className={`px-4 py-1.5 rounded-full transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "TYPE_A"
                  ? isDark
                    ? "bg-[#34D59A] text-black font-semibold shadow-xs"
                    : "bg-[#10B981] text-white font-semibold shadow-xs"
                  : isDark
                  ? "text-[#797D86] hover:text-[#34D59A]"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              <span className="size-1.5 rounded-full bg-[#34D59A]" />
              <span>Type A: Internal (5)</span>
            </button>
            <button
              onClick={() => setActiveTab("TYPE_B")}
              className={`px-4 py-1.5 rounded-full transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "TYPE_B"
                  ? isDark
                    ? "bg-[#38BDF8] text-black font-semibold shadow-xs"
                    : "bg-[#0284C7] text-white font-semibold shadow-xs"
                  : isDark
                  ? "text-[#797D86] hover:text-[#38BDF8]"
                  : "text-slate-600 hover:text-sky-700"
              }`}
            >
              <span className="size-1.5 rounded-full bg-[#38BDF8]" />
              <span>Type B: Commercial (5)</span>
            </button>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const isTypeA = service.type === "TYPE_A";

            return (
              <div
                key={service.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden ${
                  isDark
                    ? "bg-[#0E1014] border border-white/[0.08] hover:border-white/[0.18]"
                    : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_10px_20px_-5px_rgba(15,23,42,0.06)] hover:border-slate-300"
                }`}
              >
                {/* Top Header Row */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                          isDark
                            ? "bg-[#14161C] border border-white/[0.08]"
                            : isTypeA
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-sky-50 border border-sky-200"
                        }`}
                      >
                        <Icon
                          className={`size-5 ${
                            isTypeA ? "text-[#34D59A]" : "text-[#38BDF8]"
                          }`}
                        />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-mono font-bold tracking-wider uppercase block ${
                            isTypeA ? "text-[#34D59A]" : "text-[#38BDF8]"
                          }`}
                        >
                          {service.typeLabel}
                        </span>
                        <span className={`text-[11px] font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                          {service.badge}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                        isDark
                          ? "bg-[#14161C] border-white/[0.08] text-[#AFB1B6]"
                          : "bg-slate-100 border-slate-300 text-slate-700"
                      }`}
                    >
                      {service.sla}
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-medium tracking-tight mb-2 ${
                      isDark ? "text-white group-hover:text-[#34D59A] transition-colors" : "text-slate-950"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed mb-4 font-normal ${
                      isDark ? "text-[#AFB1B6]" : "text-slate-600"
                    }`}
                  >
                    {service.tagline}
                  </p>

                  <div
                    className={`p-3.5 rounded-xl mb-5 text-xs leading-relaxed ${
                      isDark
                        ? "bg-[#12141A] border border-white/[0.04] text-[#94979E]"
                        : "bg-slate-50 border border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                      Operational Impact:
                    </span>
                    {service.whatItDoes}
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2 mb-6">
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase block ${
                      isDark ? "text-[#797D86]" : "text-slate-500"
                    }`}>
                      Included Deliverables:
                    </span>
                    <ul className={`space-y-2 text-xs ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`size-3.5 shrink-0 mt-0.5 ${
                              isTypeA ? "text-[#34D59A]" : "text-[#38BDF8]"
                            }`}
                          />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Footer Info & Action */}
                <div
                  className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isDark ? "border-[#1C1D1F]" : "border-slate-100"
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-mono block ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                      PRIMARY STAKEHOLDER
                    </span>
                    <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                      {service.targetBuyer}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectService(service)}
                    className={`inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium transition cursor-pointer self-start sm:self-auto ${
                      isDark
                        ? "bg-white/[0.06] hover:bg-white text-white hover:text-black border border-white/[0.08]"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>Scope This Solution</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Scope Guarantee Banner */}
        <div
          className={`mt-10 p-6 rounded-2xl border text-center flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
            isDark
              ? "bg-[#0E1014] border-white/[0.08]"
              : "bg-white border-slate-200/90 shadow-xs"
          }`}
        >
          <div className="flex items-center gap-3 text-left">
            <div className={`p-2.5 rounded-full ${isDark ? "bg-[#14161C] text-[#34D59A]" : "bg-emerald-50 text-emerald-600"}`}>
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                Zero Hourly Billing • Guaranteed Delivery SLAs • 100% Code Ownership
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                Every integration is executed under a clear fixed scope. You receive complete production TypeScript source code and Loom walkthroughs.
              </p>
            </div>
          </div>

          <a
            href="#intake"
            className={`whitespace-nowrap inline-flex items-center gap-2 h-9 px-5 rounded-full text-xs font-medium transition ${
              isDark
                ? "bg-white text-black hover:bg-[#E4E5E7]"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <span>Request Guaranteed Scoping</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </section>

      {/* 4. WHAT YOU RECEIVE */}
      <section
        className={`py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Standard Delivery Package
          </h2>
          <p
            className={`mt-2 text-3xl font-medium tracking-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            What You Receive With Every Build
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-2xl transition-colors ${
              isDark
                ? "bg-[#0E1014] border border-white/[0.08]"
                : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
            }`}
          >
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">
              01 / PRODUCTION CODE REPOSITORY
            </span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Clean, Documented TypeScript MCP Server
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Complete source code conforming strictly to Anthropic Model Context Protocol standards. Includes end-to-end unit tests, typed parameter schemas, and resilient connection pooling.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl transition-colors ${
              isDark
                ? "bg-[#0E1014] border border-white/[0.08]"
                : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
            }`}
          >
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">
              02 / 1-CLICK CLIENT CONFIGURATIONS
            </span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Pre-Wired Claude, Cursor &amp; Antigravity Configs
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Pre-configured JSON settings for Claude Desktop, Cursor IDE, and Google Antigravity. Your engineering team pastes the configuration and immediately starts querying data safely.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl transition-colors ${
              isDark
                ? "bg-[#0E1014] border border-white/[0.08]"
                : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
            }`}
          >
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">
              03 / SECURITY GATEWAY PRE-INTEGRATION
            </span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Pre-Shielded with Sevlex Layer 7 ToolGuard™
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Your server includes built-in Sevlex guardrails: in-flight AST parameter inspection, zero-latency prompt injection blocking, DLP secret sanitization, and Merkle audit logging.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl transition-colors ${
              isDark
                ? "bg-[#0E1014] border border-white/[0.08]"
                : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
            }`}
          >
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">
              04 / LOOM WALKTHROUGH &amp; 14-DAY SUPPORT
            </span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Video Walkthrough &amp; Direct Engineer Access
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              A recorded Loom walkthrough demonstrating query execution, schema bounds, and edge-case handling, backed by 14 days of dedicated Slack/email engineering support.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTAKE & SCOPING FORM */}
      <section
        id="intake"
        className={`py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div
          className={`rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-colors ${
            isDark
              ? "border border-white/[0.08] bg-[#0A0C10]"
              : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
          }`}
        >
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#34D59A]/10 blur-[80px] pointer-events-none rounded-full" />

          <div className="text-center max-w-xl mx-auto mb-10">
            <h2
              className={`text-2xl sm:text-3xl font-medium tracking-tight ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Submit Your Integration Spec
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Tell us about your internal database, private microservice, or commercial SaaS connector. We review your requirements and provide an architectural scoping estimate within 4 hours.
            </p>
          </div>

          {submitted ? (
            <div
              className={`p-8 rounded-2xl border text-center ${
                isDark ? "bg-[#34D59A]/10 border-[#34D59A]/30" : "bg-emerald-50 border-emerald-300"
              }`}
            >
              <CheckCircle2 className="size-10 text-[#34D59A] mx-auto mb-3" />
              <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                Your Integration Spec Has Been Received!
              </h3>
              <p className={`text-xs mt-2 max-w-md mx-auto ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                Our solutions engineering team is reviewing your requirements. You will receive an architectural scoping breakdown and turnaround SLA estimate within 4 hours.
              </p>
              <div className="mt-4">
                <a
                  href="mailto:founder@sevlex.com"
                  className="text-xs text-[#34D59A] underline font-semibold"
                >
                  Need immediate priority? Email founder@sevlex.com
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition ${
                      isDark
                        ? "bg-[#14161C] border border-white/[0.08] text-white placeholder:text-[#61646B]"
                        : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition ${
                      isDark
                        ? "bg-[#14161C] border border-white/[0.08] text-white placeholder:text-[#61646B]"
                        : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs"
                    }`}
                  />
                </div>
              </div>

              {/* Project Category Selector */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                  Project Category
                </label>
                <select
                  value={formData.projectCategory}
                  onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition cursor-pointer ${
                    isDark
                      ? "bg-[#14161C] border border-white/[0.08] text-white"
                      : "bg-white border border-slate-300 text-slate-900 shadow-xs"
                  }`}
                >
                  <option value="Type A: Internal Enterprise MCP (Database / Private API / DevOps)">
                    Type A: Internal Enterprise MCP (Database / Private API / DevOps)
                  </option>
                  <option value="Type B: Commercial SaaS Connector (Public / OAuth 2.0 / Remote SSE)">
                    Type B: Commercial SaaS Connector (Public / OAuth 2.0 / Remote SSE)
                  </option>
                  <option value="Hybrid Scope: Both Internal and Commercial Connectors">
                    Hybrid Scope: Both Internal and Commercial Connectors
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Target Source System
                  </label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition cursor-pointer ${
                      isDark
                        ? "bg-[#14161C] border border-white/[0.08] text-white"
                        : "bg-white border border-slate-300 text-slate-900 shadow-xs"
                    }`}
                  >
                    <option value="PostgreSQL Database">PostgreSQL Database</option>
                    <option value="MySQL / MariaDB">MySQL / MariaDB</option>
                    <option value="MongoDB / DocumentDB">MongoDB / DocumentDB</option>
                    <option value="Snowflake / Databricks / Data Warehouse">Snowflake / Databricks / Data Warehouse</option>
                    <option value="Internal REST / GraphQL / OpenAPI Microservice">Internal REST / GraphQL / OpenAPI Microservice</option>
                    <option value="DevOps / CloudWatch / Sentry / Datadog">DevOps / CloudWatch / Sentry / Datadog</option>
                    <option value="Commercial B2B SaaS Product (Public SSE Connector)">Commercial B2B SaaS Product (Public SSE Connector)</option>
                    <option value="Existing MCP Server (Requires Security Hardening)">Existing MCP Server (Requires Security Hardening)</option>
                    <option value="Custom Proprietary Tech Stack">Custom Proprietary Tech Stack</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Primary AI Client
                  </label>
                  <select
                    value={formData.aiClient}
                    onChange={(e) => setFormData({ ...formData, aiClient: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition cursor-pointer ${
                      isDark
                        ? "bg-[#14161C] border border-white/[0.08] text-white"
                        : "bg-white border border-slate-300 text-slate-900 shadow-xs"
                    }`}
                  >
                    <option value="Claude Desktop & Cursor IDE">Claude Desktop &amp; Cursor IDE</option>
                    <option value="Google Antigravity & Gemini">Google Antigravity &amp; Gemini</option>
                    <option value="Cursor IDE Only">Cursor IDE Only</option>
                    <option value="Custom Autonomous Agent / Python SDK">Custom Agent / Python SDK</option>
                    <option value="Multi-Client SaaS Distribution (All Major AI Tools)">Multi-Client SaaS Distribution (All Major AI Tools)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                  Brief Description of Scope &amp; Tools Needed
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. We want Cursor and Claude to query our Postgres database for customer account status, but strictly block all destructive writes and redact PII."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition ${
                    isDark
                      ? "bg-[#14161C] border border-white/[0.08] text-white placeholder:text-[#61646B]"
                      : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs"
                  }`}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className={`text-[11px] ${isDark ? "text-[#797D86]" : "text-slate-500 font-medium"}`}>
                  ⚡ Guaranteed fixed-scope delivery • 48h–72h turnaround SLA • 100% money-back guarantee
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full text-xs font-medium transition duration-200 cursor-pointer shadow-lg disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-black hover:bg-[#E4E5E7]"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  <Send className={`size-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                  <span>{isSubmitting ? "Submitting Spec..." : "Submit Spec for Scoping"}</span>
                </button>
              </div>
            </form>
          )}

          <div
            className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
              isDark ? "border-[#1C1D1F] text-[#797D86]" : "border-slate-100 text-slate-500"
            }`}
          >
            <span>Prefer a direct conversation first?</span>
            <a
              href="https://calendly.com/meetpxnchl/meeting"
              target="_blank"
              rel="noreferrer"
              className="text-[#34D59A] underline hover:opacity-80 flex items-center gap-1 font-medium"
            >
              Book a 15-Minute Scoping Call <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
          isDark ? "border-white/[0.08] text-[#797D86]" : "border-slate-200/90 text-slate-500"
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
          <a href="/docs" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
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
          <a
            href="/llms.txt"
            target="_blank"
            className={`font-mono text-[11px] ${isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}`}
          >
            llms.txt
          </a>
          <a
            href="https://github.com/Sevlex/sevlex-mcp-gateway"
            target="_blank"
            rel="noreferrer"
            className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}
          >
            GitHub
          </a>
          <a
            href="https://calendly.com/meetpxnchl/meeting"
            target="_blank"
            rel="noreferrer"
            className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}
          >
            Book Enterprise Demo
          </a>
        </div>
      </footer>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import {
  Database,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileCode,
  Terminal,
  Send,
  Lock,
  Layers,
  Sun,
  Moon,
  ExternalLink,
  Globe2,
  Server,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";
import ServiceNavDropdown from "@/app/components/ServiceNavDropdown";

interface ServiceItem {
  id: string;
  type: "TYPE_A" | "TYPE_B";
  typeLabel: string;
  title: string;
  sla: string;
  description: string;
  bullets: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceItem[] = [
  // TYPE A: Internal
  {
    id: "safe-db",
    type: "TYPE_A",
    typeLabel: "INTERNAL",
    title: "Safe Database MCP Bridge",
    sla: "48h SLA",
    description: "Connect Claude, Cursor, and Antigravity to private databases with AST read-only query guardrails.",
    bullets: [
      "Kills DROP, DELETE, and ALTER queries in <0.4ms",
      "In-flight DLP masking for passwords and credentials",
      "Full TypeScript MCP server with connection pooling",
    ],
    icon: Database,
  },
  {
    id: "openapi-porting",
    type: "TYPE_A",
    typeLabel: "INTERNAL",
    title: "OpenAPI & Microservices Porting",
    sla: "72h SLA",
    description: "Transform internal Swagger / OpenAPI specs, REST, or GraphQL endpoints into typed AI tools.",
    bullets: [
      "15–30 curated endpoints mapped into natural language tools",
      "Strict parameter schemas, type safety, and payload bounding",
      "Local stdio or secure internal SSE transport",
    ],
    icon: Layers,
  },
  {
    id: "devops-logs",
    type: "TYPE_A",
    typeLabel: "INTERNAL",
    title: "DevOps & Incident Logs MCP",
    sla: "72h SLA",
    description: "Query live error streams and crash stack traces directly inside developer IDEs.",
    bullets: [
      "CloudWatch, Sentry & Datadog instant log triage",
      "Automated crash stack trace parsing and summaries",
      "Zero dashboard hopping during live production on-call",
    ],
    icon: Terminal,
  },
  {
    id: "security-hardening",
    type: "TYPE_A",
    typeLabel: "INTERNAL",
    title: "Zero-Trust & SOC 2 Hardening",
    sla: "3–5 Days",
    description: "Wrap existing internal MCP servers with enterprise guardrails to pass InfoSec and compliance.",
    bullets: [
      "Sevlex Layer 7 ToolGuard™ parameter AST firewall",
      "Velocity circuit breakers preventing runaway LLM loops",
      "Cryptographic Merkle audit ledger for SOC 2 compliance",
    ],
    icon: Lock,
  },
  {
    id: "fleet-rollout",
    type: "TYPE_A",
    typeLabel: "INTERNAL",
    title: "Fleet-Wide IDE Rollout",
    sla: "5 Days",
    description: "Deploy standardized, pre-authenticated MCP configurations across 20–100+ developer laptops.",
    bullets: [
      "Automated Jamf (macOS) & Microsoft Intune (Windows) scripts",
      "Centralized registry locked against unauthorized edits",
      "Zero configuration drift across engineering teams",
    ],
    icon: FileCode,
  },

  // TYPE B: Commercial
  {
    id: "saas-flagship",
    type: "TYPE_B",
    typeLabel: "COMMERCIAL",
    title: "Official Multi-Tenant SaaS Connector",
    sla: "10 Days",
    description: "Public-facing remote MCP connector so your paying customers can use your software in Claude & Cursor.",
    bullets: [
      "24/7 Remote SSE server with OAuth 2.0 PKCE user login",
      "Strict multi-tenant data isolation and rate limiting",
      "Complete test suite and production deployment",
    ],
    icon: Sparkles,
  },
  {
    id: "marketplace-distribution",
    type: "TYPE_B",
    typeLabel: "COMMERCIAL",
    title: "AI Marketplace Distribution",
    sla: "3 Days",
    description: "Package and publish your connector across the global Model Context Protocol ecosystem.",
    bullets: [
      "Verified listings on Smithery.ai and mcp.so directories",
      "Published @company/mcp-server npm package with CI/CD",
      "Branded quickstart documentation for developer onboarding",
    ],
    icon: Globe2,
  },
  {
    id: "slack-hitl",
    type: "TYPE_B",
    typeLabel: "COMMERCIAL",
    title: "Slack HITL Approval Gates",
    sla: "3 Days",
    description: "Interactive managerial approval workflows before high-risk autonomous agent operations run.",
    bullets: [
      "Slack / Teams card with one-click 'Approve' / 'Deny' buttons",
      "Cryptographically signed, expiring authorization tokens",
      "Audit trail logging which manager cleared each action",
    ],
    icon: ShieldCheck,
  },
  {
    id: "managed-cloud",
    type: "TYPE_B",
    typeLabel: "COMMERCIAL",
    title: "24/7 Managed Cloud Hosting",
    sla: "Managed SLA",
    description: "Fully managed cloud infrastructure so your team never has to maintain or troubleshoot MCP servers.",
    bullets: [
      "99.9% uptime SLA with auto-scaling compute and SSL",
      "DDoS defense, latency tracking, and error alerting",
      "Zero DevOps maintenance required from your internal team",
    ],
    icon: Server,
  },
  {
    id: "schema-evolution",
    type: "TYPE_B",
    typeLabel: "COMMERCIAL",
    title: "Schema & Model Evolution Retainer",
    sla: "Monthly",
    description: "Ongoing prompt tuning as your product APIs change and frontier models release new versions.",
    bullets: [
      "Monthly schema updates synchronized with your core product",
      "Prompt fine-tuning tailored to Claude 3.7, GPT-5 & Gemini 2.0",
      "Monthly tool usage breakdown and query telemetry reports",
    ],
    icon: RefreshCw,
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
    projectCategory: "Type A: Internal Enterprise MCP",
    sourceType: "PostgreSQL Database",
    aiClient: "Claude Desktop & Cursor IDE",
    details: "",
  });

  // Sync with URL anchor hash
  React.useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = SERVICES.find((s) => s.id === hash);
        if (found) {
          setActiveTab("ALL");
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 60);
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSelectService = (service: ServiceItem) => {
    setFormData((prev) => ({
      ...prev,
      projectCategory:
        service.type === "TYPE_A"
          ? "Type A: Internal Enterprise MCP"
          : "Type B: Commercial SaaS Connector",
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
            ? "bg-[linear-gradient(to_right,#131415_1px,transparent_1px),linear-gradient(to_bottom,#131415_1px,transparent_1px)] opacity-30 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            : "bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-35 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_0%,#000_60%,transparent_100%)]"
        }`}
      />

      {/* Atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.06),transparent_70%)] pointer-events-none" />

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

          {/* Desktop Nav Items with Neon-style Dropdown */}
          <div
            className={`hidden md:flex items-center gap-8 text-xs font-medium ${
              isDark ? "text-[#94979E]" : "text-[#6B7280]"
            }`}
          >
            <a href="/product" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              Product
            </a>
            <ServiceNavDropdown isDark={isDark} isActive={true} />
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

      {/* 2. HERO */}
      <section className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium mb-6 ${
            isDark
              ? "bg-[#101216] border border-white/[0.08] text-[#94979E]"
              : "bg-slate-100 border border-slate-300 text-slate-700 shadow-xs"
          }`}
        >
          <span className="text-[#34D59A] font-semibold">WHITE-GLOVE MCP INTEGRATION</span>
          <span>•</span>
          <span>48–72H GUARANTEED SLA</span>
        </div>

        <h1
          className={`text-4xl sm:text-6xl font-medium tracking-tight leading-[1.08] max-w-3xl mx-auto ${
            isDark ? "text-white" : "text-slate-950"
          }`}
        >
          Custom MCP Servers Built for Your Stack
        </h1>

        <p
          className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
            isDark ? "text-[#8A8F98]" : "text-slate-600"
          }`}
        >
          We engineer zero-trust Model Context Protocol servers and public SaaS connectors in 48 to 72 hours—backed by fixed scopes, 100% code ownership, and zero hourly bills.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#intake"
            className={`inline-flex items-center gap-2 h-10 px-6 rounded-full text-xs font-medium transition duration-200 shadow-lg ${
              isDark
                ? "bg-white text-black hover:bg-[#E4E5E7]"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <span>Request Custom Build</span>
            <ArrowRight className="size-3.5" />
          </a>
          <a
            href="https://calendly.com/meetpxnchl/meeting"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 h-10 px-5 rounded-full border text-xs font-medium transition duration-200 ${
              isDark
                ? "border-white/[0.08] bg-[#0E1014] hover:bg-white/[0.06] text-[#C9CBCF] hover:text-white"
                : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs"
            }`}
          >
            <span>Book 15-Min Scoping Call</span>
            <ExternalLink className="size-3 opacity-60" />
          </a>
        </div>
      </section>

      {/* 3. BRAND-GRADE SOLUTIONS GRID (NEON AESTHETIC) */}
      <section
        id="catalogue"
        className={`py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        {/* Sleek Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className={`text-xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
              Production Solutions &amp; SLAs
            </h2>
            <p className={`text-xs mt-1 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
              Select your integration track to view scope and turnaround
            </p>
          </div>

          <div
            className={`inline-flex items-center p-1 rounded-full border text-xs font-medium self-start sm:self-auto ${
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
                    ? "bg-white text-black shadow-xs font-semibold"
                    : "bg-white text-slate-950 shadow-xs font-semibold"
                  : isDark
                  ? "text-[#797D86] hover:text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              All ({SERVICES.length})
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
              <span>Type A: Internal</span>
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
              <span>Type B: Commercial</span>
            </button>
          </div>
        </div>

        {/* Clean, Non-Wikipedia Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredServices.map((service) => {
            const isTypeA = service.type === "TYPE_A";

            return (
              <div
                key={service.id}
                id={service.id}
                className={`scroll-mt-24 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group border ${
                  isDark
                    ? "bg-[#0B0D11] border-white/[0.08] hover:border-white/[0.16]"
                    : "bg-white border-slate-200/90 shadow-xs hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Top Meta Line */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
                        isTypeA ? "text-[#34D59A]" : "text-[#38BDF8]"
                      }`}
                    >
                      {service.typeLabel}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                        isDark
                          ? "bg-[#14161C] border-white/[0.08] text-[#AFB1B6]"
                          : "bg-slate-100 border-slate-300 text-slate-700"
                      }`}
                    >
                      {service.sla}
                    </span>
                  </div>

                  {/* Title & One-Sentence Summary */}
                  <h3
                    className={`text-base font-medium tracking-tight mb-1.5 ${
                      isDark ? "text-white group-hover:text-[#34D59A] transition-colors" : "text-slate-950"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? "text-[#8A8F98]" : "text-slate-600"}`}>
                    {service.description}
                  </p>

                  {/* Punchy Minimal Bullets */}
                  <ul className={`space-y-1.5 text-xs mb-6 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`size-3.5 shrink-0 ${
                            isTypeA ? "text-[#34D59A]" : "text-[#38BDF8]"
                          }`}
                        />
                        <span className="leading-tight">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Simple Action */}
                <div
                  className={`pt-3.5 border-t flex items-center justify-between text-xs ${
                    isDark ? "border-white/[0.06]" : "border-slate-100"
                  }`}
                >
                  <span className={`text-[11px] font-mono ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>
                    Fixed Scope • Zero Overages
                  </span>

                  <button
                    onClick={() => handleSelectService(service)}
                    className={`inline-flex items-center gap-1 text-xs font-medium transition cursor-pointer ${
                      isTypeA
                        ? "text-[#34D59A] hover:underline"
                        : "text-[#38BDF8] hover:underline"
                    }`}
                  >
                    <span>Scope Solution</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHAT YOU RECEIVE (MINIMAL 4-COLUMN ROW) */}
      <section
        className={`py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-widest text-[#34D59A] font-mono font-semibold">
            INCLUDED DELIVERABLES
          </span>
          <p className={`mt-1.5 text-2xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Every Build Includes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200"}`}>
            <span className="text-[10px] font-mono font-bold text-[#34D59A] block mb-2">01 / CODE</span>
            <h4 className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>TypeScript MCP Server</h4>
            <p className={`text-xs ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>Clean, typed source code with connection pooling and tests.</p>
          </div>

          <div className={`p-5 rounded-xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200"}`}>
            <span className="text-[10px] font-mono font-bold text-[#34D59A] block mb-2">02 / CONFIG</span>
            <h4 className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>1-Click Client Setup</h4>
            <p className={`text-xs ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>Pre-wired configs for Claude Desktop, Cursor &amp; Antigravity.</p>
          </div>

          <div className={`p-5 rounded-xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200"}`}>
            <span className="text-[10px] font-mono font-bold text-[#34D59A] block mb-2">03 / SECURITY</span>
            <h4 className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>ToolGuard™ Hardened</h4>
            <p className={`text-xs ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>Pre-shielded with AST inspection and in-flight DLP masking.</p>
          </div>

          <div className={`p-5 rounded-xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200"}`}>
            <span className="text-[10px] font-mono font-bold text-[#34D59A] block mb-2">04 / SUPPORT</span>
            <h4 className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Walkthrough &amp; Direct Access</h4>
            <p className={`text-xs ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>Loom onboarding video plus 14-day direct Slack engineering support.</p>
          </div>
        </div>
      </section>

      {/* 5. INTAKE FORM (CLEAN, FRICTIONLESS) */}
      <section
        id="intake"
        className={`py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div
          className={`rounded-2xl p-7 sm:p-10 border transition-colors relative overflow-hidden ${
            isDark
              ? "bg-[#0B0D11] border-white/[0.08]"
              : "bg-white border-slate-200/90 shadow-sm"
          }`}
        >
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className={`text-2xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
              Request Scoping Spec
            </h2>
            <p className={`text-xs mt-1.5 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
              Tell us what database, API, or SaaS product you want to connect. We respond within 4 hours.
            </p>
          </div>

          {submitted ? (
            <div
              className={`p-6 rounded-xl border text-center ${
                isDark ? "bg-[#34D59A]/10 border-[#34D59A]/20" : "bg-emerald-50 border-emerald-300"
              }`}
            >
              <CheckCircle2 className="size-8 text-[#34D59A] mx-auto mb-2.5" />
              <h3 className={`text-base font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                Your Integration Spec Has Been Received
              </h3>
              <p className={`text-xs mt-1.5 max-w-md mx-auto ${isDark ? "text-[#C9CBCF]" : "text-slate-600"}`}>
                Our solutions engineering team is reviewing your requirements and will email you an architectural scoping breakdown within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
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
                        : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Track
                  </label>
                  <select
                    value={formData.projectCategory}
                    onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition cursor-pointer ${
                      isDark
                        ? "bg-[#14161C] border border-white/[0.08] text-white"
                        : "bg-white border border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="Type A: Internal Enterprise MCP">Type A: Internal Team MCP</option>
                    <option value="Type B: Commercial SaaS Connector">Type B: Commercial SaaS Connector</option>
                    <option value="Hybrid: Both Internal & Commercial">Hybrid: Both Internal &amp; Commercial</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Target Data Source / Stack
                  </label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition cursor-pointer ${
                      isDark
                        ? "bg-[#14161C] border border-white/[0.08] text-white"
                        : "bg-white border border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="PostgreSQL / MySQL / SQLite">PostgreSQL / MySQL / SQLite</option>
                    <option value="MongoDB / DocumentDB">MongoDB / DocumentDB</option>
                    <option value="Snowflake / Databricks">Snowflake / Databricks</option>
                    <option value="Internal REST / GraphQL / OpenAPI">Internal REST / GraphQL / OpenAPI</option>
                    <option value="CloudWatch / Sentry / Datadog">CloudWatch / Sentry / Datadog</option>
                    <option value="Commercial B2B SaaS Product">Commercial B2B SaaS Product</option>
                    <option value="Existing MCP Server Hardening">Existing MCP Server Hardening</option>
                    <option value="Custom Proprietary Stack">Custom Proprietary Stack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                  What do you need your tools to do?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Allow developers in Cursor to query our Postgres database safely, blocking destructive writes and redacting sensitive PII."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition ${
                    isDark
                      ? "bg-[#14161C] border border-white/[0.08] text-white placeholder:text-[#61646B]"
                      : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className={`text-[11px] font-mono ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>
                  48h–72h SLA • Zero Hourly Bills • 100% Code Ownership
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full text-xs font-medium transition cursor-pointer shadow-md disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-black hover:bg-[#E4E5E7]"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  <Send className={`size-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                  <span>{isSubmitting ? "Submitting..." : "Submit Spec for Scoping"}</span>
                </button>
              </div>
            </form>
          )}

          <div
            className={`mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
              isDark ? "border-white/[0.06] text-[#797D86]" : "border-slate-100 text-slate-500"
            }`}
          >
            <span>Prefer a direct conversation?</span>
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
            Book Demo
          </a>
        </div>
      </footer>
    </main>
  );
}

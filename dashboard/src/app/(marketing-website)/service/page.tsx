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
  Cpu,
  BookOpen,
  Headphones,
  ShoppingBag,
  CreditCard,
  Briefcase,
} from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";
import ServiceNavDropdown from "@/app/components/ServiceNavDropdown";

export default function ServicePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectCategory: "Type A: Internal MCPs (For Your Team)",
    sourceType: "1. The Database MCP (Storage Room)",
    aiClient: "Claude Desktop & Cursor IDE",
    details: "",
  });

  const handleSelectTrack = (trackName: string, defaultSource?: string) => {
    setFormData((prev) => ({
      ...prev,
      projectCategory: trackName,
      sourceType: defaultSource || prev.sourceType,
      details: `Inquiring about custom scoping for: ${trackName}${defaultSource ? ` - ${defaultSource}` : ""}.\n`,
    }));
    const el = document.getElementById("intake");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
          details: `[Track: ${formData.projectCategory} | System: ${formData.sourceType}]\n${formData.details}`,
        }),
      });
    } catch (err) {
      console.error("Intake submission fallback notice:", err);
    }
    setIsSubmitting(false);
    setSubmitted(true);
  };

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
            ? "bg-[linear-gradient(to_right,#131415_1px,transparent_1px),linear-gradient(to_bottom,#131415_1px,transparent_1px)] opacity-35 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            : "bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-35 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_0%,#000_60%,transparent_100%)]"
        }`}
      />

      {/* Atmospheric radial illumination */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(52,213,154,0.1),transparent_70%)] pointer-events-none" />

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

      {/* 2. HERO: BRAND-LEVEL OVERVIEW */}
      <section className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium mb-6 ${
            isDark
              ? "bg-[#101216] border border-white/[0.08] text-[#94979E]"
              : "bg-slate-100 border border-slate-300 text-slate-700 shadow-xs"
          }`}
        >
          <span className="text-[#34D59A] font-semibold">CUSTOM ARCHITECTURAL DELIVERY</span>
          <span>•</span>
          <span>48–72H GUARANTEED SLA</span>
        </div>

        <h1
          className={`text-4xl sm:text-6xl font-medium tracking-tight leading-[1.08] max-w-3xl mx-auto ${
            isDark ? "text-white" : "text-slate-950"
          }`}
        >
          MCP Infrastructure Built for Your Exact Stack
        </h1>

        <p
          className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
            isDark ? "text-[#94A3B8]" : "text-slate-600"
          }`}
        >
          Every organization has unique data models, security guardrails, and customer workflows. We don&apos;t force rigid templates—we scope, architect, and harden custom Model Context Protocol infrastructure tailored to your exact stack in days.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#intake"
            className={`inline-flex items-center gap-2 h-10 px-6 rounded-full text-xs font-semibold transition duration-200 shadow-[0_0_20px_rgba(52,213,154,0.2)] ${
              isDark
                ? "bg-[#34D59A] text-black hover:bg-[#34D59A]/90"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <span>Request Custom Scope</span>
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

      {/* 3. TYPE A: INTERNAL MCPS (EXACT 6 SYSTEMS FROM SCREENSHOT) */}
      <section id="type-a-internal" className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`scroll-mt-24 rounded-3xl p-8 sm:p-10 border transition-all duration-200 relative overflow-hidden ${
            isDark
              ? "bg-[#090B0E] border-white/[0.08] hover:border-emerald-500/25 shadow-[0_0_40px_rgba(52,213,154,0.03)]"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8 pb-8 border-b border-white/[0.06] dark:border-white/[0.06] border-slate-100">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-[#34D59A] shadow-[0_0_8px_#34D59A]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#34D59A]">
                  Type A: Internal MCPs
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                Internal AI Tooling for Your Engineering, Data &amp; Operations Teams
              </h2>
              <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                Empower your engineers to query private data, trigger microservices, and triage logs directly inside Claude Desktop, Cursor, and autonomous agents—with Sevlex Layer 7 AST firewalls that eliminate destructive query risks and credential leaks.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                isDark ? "bg-[#14161C] border-white/[0.08] text-[#AFB1B6]" : "bg-slate-100 border-slate-300 text-slate-700"
              }`}>
                48h–72h Delivery SLA
              </span>
              <button
                onClick={() => handleSelectTrack("Type A: Internal MCPs (For Your Team)")}
                className="text-xs font-semibold text-[#34D59A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Scope Internal Stack</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>

          {/* 6 Clean Systems From Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Database MCP */}
            <div
              onClick={() => handleSelectTrack("Type A: Internal MCPs", "1. The Database MCP (Storage Room)")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-emerald-500/30" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#34D59A]">1. The Storage Room</span>
                <Database className="size-4 text-[#34D59A]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                1. The Database MCP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Postgres, MySQL, Snowflake, MongoDB &amp; Redis with &lt;0.4ms AST query firewalls blocking DROP, DELETE &amp; ALTER.
              </p>
            </div>

            {/* 2. Internal API MCP */}
            <div
              onClick={() => handleSelectTrack("Type A: Internal MCPs", "2. The Internal API MCP (Private Engine)")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-emerald-500/30" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#34D59A]">2. The Private Engine</span>
                <Layers className="size-4 text-[#34D59A]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                2. The Internal API MCP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Automated ingestion of Swagger / OpenAPI, GraphQL, and private microservice endpoints into typed AI tool definitions.
              </p>
            </div>

            {/* 3. Cloud & Server MCP */}
            <div
              onClick={() => handleSelectTrack("Type A: Internal MCPs", "3. The Cloud & Server MCP (DevOps Engine Room)")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-emerald-500/30" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#34D59A]">3. The DevOps Engine Room</span>
                <Terminal className="size-4 text-[#34D59A]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                3. The Cloud &amp; Server MCP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                CloudWatch, Sentry &amp; Datadog crash stack trace diagnosis directly in Cursor without switching browser tabs.
              </p>
            </div>

            {/* 4. Project & Code MCP */}
            <div
              onClick={() => handleSelectTrack("Type A: Internal MCPs", "4. The Project & Code MCP (Daily Workflow)")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-emerald-500/30" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#34D59A]">4. The Daily Workflow</span>
                <Briefcase className="size-4 text-[#34D59A]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                4. The Project &amp; Code MCP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Linear, Jira, GitHub &amp; CI/CD engineering workflow tools deployed centrally via Jamf/Intune across developer seats.
              </p>
            </div>

            {/* 5. Company Knowledge MCP */}
            <div
              onClick={() => handleSelectTrack("Type A: Internal MCPs", "5. The Company Knowledge MCP (Company Library)")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-emerald-500/30" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#34D59A]">5. The Company Library</span>
                <BookOpen className="size-4 text-[#34D59A]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                5. The Company Knowledge MCP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Notion, Confluence, internal docs &amp; wikis with in-flight DLP redaction so proprietary secrets never train public models.
              </p>
            </div>

            {/* 6. Customer Support MCP */}
            <div
              onClick={() => handleSelectTrack("Type A: Internal MCPs", "6. The Customer Support MCP (Operations Desk)")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-emerald-500/30" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#34D59A]">6. The Operations Desk</span>
                <Headphones className="size-4 text-[#34D59A]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                6. The Customer Support MCP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Zendesk, Intercom &amp; customer operations desks with strict read scopes, velocity limiting, and Merkle audit ledgers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TYPE B: COMMERCIAL / PUBLIC SAAS MCPS (EXACT 5 VERTICALS FROM SCREENSHOT) */}
      <section id="type-b-commercial" className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`scroll-mt-24 rounded-3xl p-8 sm:p-10 border transition-all duration-200 relative overflow-hidden ${
            isDark
              ? "bg-[#090B0E] border-white/[0.08] hover:border-sky-500/25 shadow-[0_0_40px_rgba(56,189,248,0.03)]"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8 pb-8 border-b border-white/[0.06] dark:border-white/[0.06] border-slate-100">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#38BDF8]">
                  Type B: Commercial / Public MCPs
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                Official AI Connectors for Your Outside Paying Customers
              </h2>
              <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                Position your SaaS product inside the modern AI workflow. Enable your customers to invoke your product directly from natural language prompts in Claude and Cursor—while we handle remote SSE scaling, OAuth 2.0 PKCE user delegation, and multi-tenant security.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                isDark ? "bg-[#14161C] border-white/[0.08] text-[#AFB1B6]" : "bg-slate-100 border-slate-300 text-slate-700"
              }`}>
                10-Day Production SLA
              </span>
              <button
                onClick={() => handleSelectTrack("Type B: Commercial SaaS Connectors (For Customers)")}
                className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Scope SaaS Connector</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>

          {/* 5 Clean SaaS Verticals From Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Dev Tools & Cloud SaaS */}
            <div
              onClick={() => handleSelectTrack("Type B: Commercial SaaS Connectors", "1. Developer Tools & Cloud SaaS")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-sky-500/30" : "bg-slate-50 border-slate-200 hover:border-sky-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#38BDF8]">Cloud Infrastructure</span>
                <Server className="size-4 text-[#38BDF8]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                1. Developer Tools &amp; Cloud SaaS
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                e.g. Neon, Supabase, Vercel. 24/7 Remote SSE server with OAuth 2.0 PKCE user login and multi-tenant isolation.
              </p>
            </div>

            {/* 2. Project & Productivity SaaS */}
            <div
              onClick={() => handleSelectTrack("Type B: Commercial SaaS Connectors", "2. Project & Productivity SaaS")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-sky-500/30" : "bg-slate-50 border-slate-200 hover:border-sky-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#38BDF8]">Productivity Workflows</span>
                <Layers className="size-4 text-[#38BDF8]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                2. Project &amp; Productivity SaaS
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                e.g. Linear, Notion, Jira. Natural language issue creation, project status queries, and workflow triggers inside IDEs.
              </p>
            </div>

            {/* 3. Fintech & Payment SaaS */}
            <div
              onClick={() => handleSelectTrack("Type B: Commercial SaaS Connectors", "3. Fintech & Payment SaaS")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-sky-500/30" : "bg-slate-50 border-slate-200 hover:border-sky-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#38BDF8]">Fintech &amp; High-Risk</span>
                <CreditCard className="size-4 text-[#38BDF8]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                3. Fintech &amp; Payment SaaS
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                e.g. Stripe, QuickBooks. Pre-configured with Human-in-the-Loop Slack approval gates before issuing refunds or transfers.
              </p>
            </div>

            {/* 4. Sales & CRM SaaS */}
            <div
              onClick={() => handleSelectTrack("Type B: Commercial SaaS Connectors", "4. Sales & CRM SaaS")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-sky-500/30" : "bg-slate-50 border-slate-200 hover:border-sky-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#38BDF8]">Revenue &amp; CRM</span>
                <Sparkles className="size-4 text-[#38BDF8]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                4. Sales &amp; CRM SaaS
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                e.g. HubSpot, Salesforce. Customer account updates, deal pipeline summaries, and activity logging via autonomous agents.
              </p>
            </div>

            {/* 5. E-Commerce & Store SaaS */}
            <div
              onClick={() => handleSelectTrack("Type B: Commercial SaaS Connectors", "5. E-Commerce & Store SaaS")}
              className={`p-5 rounded-2xl border transition cursor-pointer group ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-sky-500/30" : "bg-slate-50 border-slate-200 hover:border-sky-500"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#38BDF8]">E-Commerce &amp; Stores</span>
                <ShoppingBag className="size-4 text-[#38BDF8]" />
              </div>
              <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                5. E-Commerce &amp; Store SaaS
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                e.g. Shopify, WooCommerce. Live product catalog queries, inventory updates, and order fulfillment tracking from natural language.
              </p>
            </div>

            {/* Extra Feature Card: Distribution */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-[#0B0D11] border-white/[0.04]" : "bg-slate-50 border-slate-200"}`}>
              <div>
                <span className="text-[11px] font-semibold text-[#38BDF8] block mb-1">Marketplace Distribution</span>
                <h4 className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Global Publishing Included
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                  Every SaaS connector is submitted to Smithery.ai, mcp.so, and npm with branded onboarding guides.
                </p>
              </div>
              <span className={`text-[11px] font-semibold mt-3 ${isDark ? "text-[#38BDF8]" : "text-sky-700"}`}>
                10-Day Turnaround SLA
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ENGAGEMENT MODEL: HOW WE WORK */}
      <section
        className={`py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-widest text-[#34D59A] font-bold">
            THE ENGAGEMENT MODEL
          </span>
          <p className={`mt-1.5 text-2xl sm:text-3xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            From Architecture to Production in Days
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200 shadow-xs"}`}>
            <span className="text-xs font-bold text-[#34D59A] block mb-2">01 / SCOPING &amp; SCHEMAS</span>
            <h4 className={`text-base font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Day 1: Architectural Scoping</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              We evaluate your database schemas, OpenAPI specs, and authentication requirements to map exact tool definitions, parameter limits, and AST guardrails.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200 shadow-xs"}`}>
            <span className="text-xs font-bold text-[#34D59A] block mb-2">02 / BUILD &amp; HARDEN</span>
            <h4 className={`text-base font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Days 2–3: Engineering &amp; ToolGuard™</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              We engineer the TypeScript server, integrate connection pooling, embed Sevlex Layer 7 ToolGuard™ inspection, and run end-to-end integration test suites.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0B0D11] border-white/[0.08]" : "bg-white border-slate-200 shadow-xs"}`}>
            <span className="text-xs font-bold text-[#34D59A] block mb-2">03 / HANDOFF &amp; SUPPORT</span>
            <h4 className={`text-base font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Day 3+: Delivery &amp; 14-Day Slack Access</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              Full source code ownership, pre-wired Claude/Cursor configs, a recorded Loom walkthrough, and 14 days of dedicated Slack engineering support.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TAILORED SCOPING INTAKE FORM */}
      <section
        id="intake"
        className={`py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
          isDark ? "border-white/[0.08]" : "border-slate-200/90"
        }`}
      >
        <div
          className={`rounded-3xl p-7 sm:p-10 border transition-colors relative overflow-hidden ${
            isDark
              ? "bg-[#0B0D11] border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              : "bg-white border-slate-200/90 shadow-sm"
          }`}
        >
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className={`text-2xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
              Request Custom Scoping Spec
            </h2>
            <p className={`text-xs mt-1.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
              Tell us about your internal database, private API, or SaaS product. We review your architecture and provide an estimate within 4 hours.
            </p>
          </div>

          {submitted ? (
            <div
              className={`p-6 rounded-2xl border text-center ${
                isDark ? "bg-[#34D59A]/10 border-[#34D59A]/20" : "bg-emerald-50 border-emerald-300"
              }`}
            >
              <CheckCircle2 className="size-8 text-[#34D59A] mx-auto mb-2.5" />
              <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
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
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
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
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
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
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Track Category
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
                    <option value="Type A: Internal MCPs (For Your Team)">Type A: Internal MCPs (For Your Team)</option>
                    <option value="Type B: Commercial SaaS Connectors (For Customers)">Type B: Commercial SaaS Connectors (For Customers)</option>
                    <option value="Hybrid: Both Internal & Commercial">Hybrid: Both Internal &amp; Commercial</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Target System / Vertical
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
                    <optgroup label="Type A: Internal Systems">
                      <option value="1. The Database MCP (Storage Room)">1. The Database MCP (Storage Room)</option>
                      <option value="2. The Internal API MCP (Private Engine)">2. The Internal API MCP (Private Engine)</option>
                      <option value="3. The Cloud & Server MCP (DevOps Engine Room)">3. The Cloud &amp; Server MCP (DevOps Engine Room)</option>
                      <option value="4. The Project & Code MCP (Daily Workflow)">4. The Project &amp; Code MCP (Daily Workflow)</option>
                      <option value="5. The Company Knowledge MCP (Company Library)">5. The Company Knowledge MCP (Company Library)</option>
                      <option value="6. The Customer Support MCP (Operations Desk)">6. The Customer Support MCP (Operations Desk)</option>
                    </optgroup>
                    <optgroup label="Type B: Commercial SaaS Products">
                      <option value="1. Developer Tools & Cloud SaaS">1. Developer Tools &amp; Cloud SaaS (Neon, Supabase, Vercel)</option>
                      <option value="2. Project & Productivity SaaS">2. Project &amp; Productivity SaaS (Linear, Notion, Jira)</option>
                      <option value="3. Fintech & Payment SaaS">3. Fintech &amp; Payment SaaS (Stripe, QuickBooks)</option>
                      <option value="4. Sales & CRM SaaS">4. Sales &amp; CRM SaaS (HubSpot, Salesforce)</option>
                      <option value="5. E-Commerce & Store SaaS">5. E-Commerce &amp; Store SaaS (Shopify, WooCommerce)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                  What do you need your AI tools or connectors to do?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. We want engineers in Cursor and Claude to query our internal Postgres read-replica and pull customer metrics, while blocking all destructive queries and redacting credentials."
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
                <span className={`text-[11px] font-medium ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>
                  48h–72h Turnaround SLA • Fixed Scopes • 100% Code Ownership
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full text-xs font-semibold transition cursor-pointer shadow-md disabled:opacity-50 ${
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
            <span>Prefer a direct architectural conversation?</span>
            <a
              href="https://calendly.com/meetpxnchl/meeting"
              target="_blank"
              rel="noreferrer"
              className="text-[#34D59A] underline hover:opacity-80 flex items-center gap-1 font-semibold"
            >
              Book a 15-Minute Scoping Call <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
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
        <div className="flex flex-wrap items-center gap-6 font-medium">
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
            className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}
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

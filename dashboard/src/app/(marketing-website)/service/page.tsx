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
    projectCategory: "Category A: Internal Enterprise MCP",
    sourceType: "PostgreSQL / MySQL / Snowflake",
    aiClient: "Claude Desktop & Cursor IDE",
    details: "",
  });

  const handleSelectTrack = (trackName: string) => {
    setFormData((prev) => ({
      ...prev,
      projectCategory: trackName,
      details: `Inquiring about custom scoping for: ${trackName}.\n`,
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
          details: `[Track: ${formData.projectCategory}]\n${formData.details}`,
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

      {/* 3. TWO STRATEGIC CATEGORIES (THE OVERVIEW APPROACH) */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* CATEGORY A: INTERNAL INFRASTRUCTURE */}
        <div
          id="internal-infra"
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
                  Category A: Internal Enterprise
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                Safe AI Tooling for Your Engineering &amp; Operations Teams
              </h2>
              <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                Empower your engineers to query private databases, invoke internal microservices, and triage incident logs directly inside Claude Desktop, Cursor, and autonomous agents—with Sevlex Layer 7 AST firewalls that eliminate destructive query risks and leakages.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                isDark ? "bg-[#14161C] border-white/[0.08] text-[#AFB1B6]" : "bg-slate-100 border-slate-300 text-slate-700"
              }`}>
                48h–72h Delivery SLA
              </span>
              <button
                onClick={() => handleSelectTrack("Category A: Internal Enterprise MCP")}
                className="text-xs font-semibold text-[#34D59A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Scope Internal Stack</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>

          {/* 4 Architectural Capability Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Private Data Stores
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Postgres, MySQL, Snowflake, MongoDB &amp; Redis with &lt;0.4ms AST query firewalls blocking DROP, DELETE &amp; ALTER.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                APIs &amp; Microservices
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Automated ingestion of Swagger / OpenAPI, GraphQL, and private REST endpoints into typed AI tool definitions.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                DevOps &amp; Log Triage
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                CloudWatch, Sentry &amp; Datadog crash stack trace diagnosis directly in Cursor without switching browser tabs.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Zero-Trust &amp; Fleet MDM
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                SOC 2 Merkle audit ledger, DLP token redaction, and Jamf/Intune central configuration for 20–100+ laptops.
              </p>
            </div>
          </div>
        </div>

        {/* CATEGORY B: COMMERCIAL SAAS CONNECTORS */}
        <div
          id="commercial-saas"
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
                  Category B: Commercial SaaS Connectors
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
                onClick={() => handleSelectTrack("Category B: Commercial SaaS Connector")}
                className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Scope SaaS Connector</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>

          {/* 4 Architectural Capability Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Remote SSE &amp; OAuth 2.0
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                24/7 cloud server with seamless PKCE login (&quot;Sign in with [Your App]&quot;) eliminating manual API key handling.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Multi-Tenant Isolation
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Strict tenant partitioning, velocity rate limiting, and session security guaranteeing zero cross-customer data leakage.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Marketplace Publishing
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Official verified listings on Smithery.ai, mcp.so, and @company/mcp-server npm registry with setup docs.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition ${isDark ? "bg-[#0E1014] border-white/[0.04] hover:border-white/[0.1]" : "bg-slate-50 border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                HITL Gates &amp; Hosting
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                Slack/Teams approval cards for sensitive operations, 99.9% uptime SLA hosting, and ongoing frontier model tuning.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 4. ENGAGEMENT MODEL: HOW WE WORK (BRAND SIMPLICITY) */}
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

      {/* 5. TAILORED SCOPING INTAKE FORM */}
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
                    Solution Category
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
                    <option value="Category A: Internal Enterprise MCP">Category A: Internal Enterprise MCP</option>
                    <option value="Category B: Commercial SaaS Connector">Category B: Commercial SaaS Connector</option>
                    <option value="Hybrid: Both Internal & Commercial">Hybrid: Both Internal &amp; Commercial</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                    Target Stack / Data Layer
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
                    <option value="Snowflake / Databricks / Warehouse">Snowflake / Databricks / Warehouse</option>
                    <option value="MongoDB / DocumentDB">MongoDB / DocumentDB</option>
                    <option value="Internal REST / GraphQL / OpenAPI">Internal REST / GraphQL / OpenAPI</option>
                    <option value="CloudWatch / Sentry / Datadog">CloudWatch / Sentry / Datadog</option>
                    <option value="Commercial B2B SaaS Product (Public SSE)">Commercial B2B SaaS Product (Public SSE)</option>
                    <option value="Existing MCP Server Hardening">Existing MCP Server Hardening</option>
                    <option value="Custom Proprietary Tech Stack">Custom Proprietary Tech Stack</option>
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

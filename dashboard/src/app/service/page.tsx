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
  HelpCircle,
  Copy,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";

export default function ServicePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sourceType: "PostgreSQL Database",
    aiClient: "Claude Desktop & Cursor",
    details: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:founder@sevlex.com?subject=Custom MCP Server Request: ${formData.sourceType}&body=Name: ${encodeURIComponent(formData.name)}%0D%0AEmail: ${encodeURIComponent(formData.email)}%0D%0ASource: ${encodeURIComponent(formData.sourceType)}%0D%0AAI Client: ${encodeURIComponent(formData.aiClient)}%0D%0ADetails: ${encodeURIComponent(formData.details)}`;
    window.location.href = mailto;
    setSubmitted(true);
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
        isDark ? "bg-[#000000]/85 border-b border-[#242628]" : "bg-white/85 border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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
                  ? "border-[#242628] bg-[#141518] text-gray-300 hover:text-white hover:border-[#383A42]"
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
                  ? "border-[#242628] bg-white/[0.02] text-[#C9CBCF] hover:border-white hover:text-white"
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
      <section className="pt-20 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-6 ${
          isDark
            ? "bg-[#131415] border border-[#242628] text-[#797D86]"
            : "bg-slate-100 border border-slate-300 text-slate-700 shadow-xs"
        }`}>
          <span className="text-[#34D59A] font-semibold">WHITE-GLOVE INTEGRATION</span>
          <span className={isDark ? "text-[#303236]" : "text-slate-300"}>•</span>
          <span className={isDark ? "text-[#AFB1B6]" : "text-slate-600"}>48–72 HOUR DELIVERY SLA</span>
        </div>
        <h1 className={`text-4xl sm:text-6xl font-medium tracking-tight leading-tight max-w-4xl mx-auto ${
          isDark ? "text-white" : "text-slate-950"
        }`}>
          Done-For-You Custom MCP Server &amp; Agent Integration
        </h1>
        <p className={`mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
          isDark ? "text-[#94979E]" : "text-slate-600"
        }`}>
          We take your company&apos;s internal database, private microservices, or custom SaaS tool and build a production-grade, zero-trust MCP server in 48 to 72 hours—so your engineering team can query, analyze, and automate directly inside Claude Desktop, Cursor, or autonomous AI agents.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#intake"
            className={`inline-flex items-center gap-2 h-11 px-7 rounded-full text-xs font-medium transition duration-200 shadow-lg ${
              isDark
                ? "bg-white text-black hover:bg-[#E4E5E7]"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <span>Request Custom Server Build</span>
            <ArrowRight className="size-3.5" />
          </a>
          <a
            href="https://calendly.com/meetpxnchl/meeting"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 h-11 px-6 rounded-full border text-xs font-medium transition duration-200 ${
              isDark
                ? "border-[#242628] bg-[#18191B] hover:bg-[#242628] text-white"
                : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs"
            }`}
          >
            <span>Book 15-Min Scoping Call</span>
          </a>
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION GRID */}
      <section className={`py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-[#242628]" : "border-slate-200/90"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Any Internal Source */}
          <div className={`rounded-2xl p-8 flex flex-col justify-between transition-colors ${
            isDark
              ? "border border-[#242628] bg-[#0E0E12]"
              : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(15,23,42,0.08)]"
          }`}>
            <div>
              <div className={`size-11 rounded-full flex items-center justify-center text-[#34D59A] mb-5 ${
                isDark ? "bg-[#18191B] border border-[#242628]" : "bg-emerald-50 border border-emerald-200"
              }`}>
                <Database className="size-5" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
                1. Any Source Connected
              </h3>
              <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                We design semantic Model Context Protocol schemas for whatever data layer runs your business:
              </p>
              <ul className={`space-y-2.5 text-xs ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A] shrink-0" />
                  <span>PostgreSQL, MySQL, MongoDB, Snowflake, Redis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A] shrink-0" />
                  <span>Internal REST, GraphQL, or gRPC Microservices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A] shrink-0" />
                  <span>SaaS APIs: Salesforce, HubSpot, Jira, Linear, Stripe</span>
                </li>
              </ul>
            </div>
            <div className={`mt-8 pt-4 border-t text-[11px] font-mono ${
              isDark ? "border-[#1C1D1F] text-[#797D86]" : "border-slate-100 text-slate-500"
            }`}>
              Transport: Local Stdio or Secure Remote SSE
            </div>
          </div>

          {/* Card 2: Production Zero-Trust Hardening */}
          <div className={`rounded-2xl p-8 flex flex-col justify-between transition-colors ${
            isDark
              ? "border border-[#242628] bg-[#0E0E12]"
              : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(15,23,42,0.08)]"
          }`}>
            <div>
              <div className={`size-11 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400 mb-5 ${
                isDark ? "bg-[#18191B] border border-[#242628]" : "bg-blue-50 border border-blue-200"
              }`}>
                <ShieldCheck className="size-5" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
                2. Hardened Zero-Trust
              </h3>
              <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                We don&apos;t just write endpoints; we safeguard your database from hallucinated LLM commands:
              </p>
              <ul className={`space-y-2.5 text-xs ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  <span>Pre-configured with Sevlex ToolGuard™ AST validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  <span>Strict read/write scopes &amp; human-in-the-loop gates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  <span>In-flight DLP output secret &amp; credential redaction</span>
                </li>
              </ul>
            </div>
            <div className={`mt-8 pt-4 border-t text-[11px] font-mono ${
              isDark ? "border-[#1C1D1F] text-[#797D86]" : "border-slate-100 text-slate-500"
            }`}>
              Governance: Destructive DDL / Injections Arrested
            </div>
          </div>

          {/* Card 3: Pricing & Turnaround */}
          <div className={`rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden transition-colors ${
            isDark
              ? "border border-[#34D59A]/30 bg-[#0E0E12]"
              : "border border-emerald-300 ring-1 ring-emerald-500/10 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(52,213,154,0.12)]"
          }`}>
            <div className={`absolute top-0 right-0 border-b border-l px-3 py-1 rounded-bl-xl text-[10px] font-mono font-bold uppercase ${
              isDark
                ? "bg-[#34D59A]/10 border-[#34D59A]/20 text-[#34D59A]"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              Transparent Flat Fee
            </div>
            <div>
              <div className={`size-11 rounded-full flex items-center justify-center text-[#34D59A] mb-5 ${
                isDark ? "bg-[#18191B] border border-[#242628]" : "bg-emerald-50 border border-emerald-200"
              }`}>
                <Zap className="size-5" />
              </div>
              <h3 className={`text-lg font-medium mb-1 ${isDark ? "text-white" : "text-slate-950"}`}>
                3. 48–72h Turnaround
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-3xl font-medium font-mono ${isDark ? "text-white" : "text-slate-950"}`}>
                  $800 – $1,200
                </span>
                <span className={`text-xs ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                  / custom server
                </span>
              </div>
              <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
                50% deposit upfront ($400–$600), balance upon live verification. No hourly overages or unexpected bills.
              </p>
              <ul className={`space-y-2.5 text-xs ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A] shrink-0" />
                  <span>48 to 72 hours end-to-end turnaround</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A] shrink-0" />
                  <span>100% full source code ownership (clean TypeScript)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#34D59A] shrink-0" />
                  <span>Loom walkthrough &amp; Claude/Cursor config included</span>
                </li>
              </ul>
            </div>
            <div className={`mt-8 pt-4 border-t text-[11px] font-mono ${
              isDark ? "border-[#1C1D1F] text-[#34D59A]" : "border-emerald-100 text-emerald-700 font-semibold"
            }`}>
              SLA: 100% Money-Back Guarantee
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU RECEIVE */}
      <section className={`py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-[#242628]" : "border-slate-200/90"
      }`}>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Delivery Package
          </h2>
          <p className={`mt-2 text-3xl font-normal tracking-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            What You Receive in 48–72 Hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">01 / PRODUCTION CODE REPOSITORY</span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Clean, Documented TypeScript MCP Server
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Complete source code conforming to official Anthropic Model Context Protocol specifications. Includes unit tests, parameter schema definitions, and connection pooling.
            </p>
          </div>

          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">02 / 1-CLICK CLIENT CONFIGURATIONS</span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Pre-Wired Claude &amp; Cursor Configs
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Ready-to-use JSON configs for <code className={`font-mono ${isDark ? "text-[#C9CBCF]" : "text-slate-800 font-medium"}`}>claude_desktop_config.json</code> and Cursor IDE settings. Simply paste and immediately query your data.
            </p>
          </div>

          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">03 / SECURITY GATEWAY PRE-INTEGRATION</span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Pre-Configured with Sevlex Gateway
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Your custom server is pre-shielded with Sevlex Layer 7 ToolGuard™ rules, output DLP secret scrubbing, and cryptographic PostgreSQL/SQLite audit logging.
            </p>
          </div>

          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <span className="text-xs font-mono text-[#34D59A] block mb-2 font-semibold">04 / HANDOFF VIDEO &amp; 14-DAY SUPPORT</span>
            <h4 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Loom Walkthrough &amp; Direct Engineer Access
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              A 5-minute video demonstrating query execution, schema limits, and error handling. Plus 14 days of direct Slack/email support for troubleshooting.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTAKE & SCOPING FORM */}
      <section id="intake" className={`py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-[#242628]" : "border-slate-200/90"
      }`}>
        <div className={`rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? "border border-[#242628] bg-[#0C0D0E]"
            : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
        }`}>
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#34D59A]/10 blur-[80px] pointer-events-none rounded-full" />
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className={`text-2xl sm:text-3xl font-medium tracking-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}>
              Submit Your Integration Spec
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Tell us about the internal API, database, or tool you want to connect. We review your requirements and respond within 4 hours.
            </p>
          </div>

          {submitted ? (
            <div className={`p-8 rounded-2xl border text-center ${
              isDark ? "bg-[#34D59A]/10 border-[#34D59A]/30" : "bg-emerald-50 border-emerald-300"
            }`}>
              <CheckCircle2 className="size-10 text-[#34D59A] mx-auto mb-3" />
              <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-slate-950"}`}>
                Your Request Has Been Prepared!
              </h3>
              <p className={`text-xs mt-2 max-w-md mx-auto ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                If your email client did not automatically open, please send your spec directly to{" "}
                <a href="mailto:founder@sevlex.com" className="text-[#34D59A] underline font-semibold">
                  founder@sevlex.com
                </a>
                . We will review and provide a scoping estimate within 4 hours.
              </p>
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
                        ? "bg-[#131415] border border-[#242628] text-white placeholder:text-[#61646B]"
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
                        ? "bg-[#131415] border border-[#242628] text-white placeholder:text-[#61646B]"
                        : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs"
                    }`}
                  />
                </div>
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
                        ? "bg-[#131415] border border-[#242628] text-white"
                        : "bg-white border border-slate-300 text-slate-900 shadow-xs"
                    }`}
                  >
                    <option value="PostgreSQL Database">PostgreSQL Database</option>
                    <option value="MySQL / MariaDB">MySQL / MariaDB</option>
                    <option value="MongoDB / DocumentDB">MongoDB / DocumentDB</option>
                    <option value="Internal REST / GraphQL API">Internal REST / GraphQL API</option>
                    <option value="Salesforce / HubSpot CRM">Salesforce / HubSpot CRM</option>
                    <option value="Jira / Linear / Project Mgmt">Jira / Linear / Project Mgmt</option>
                    <option value="Custom Proprietary Stack">Custom Proprietary Stack</option>
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
                        ? "bg-[#131415] border border-[#242628] text-white"
                        : "bg-white border border-slate-300 text-slate-900 shadow-xs"
                    }`}
                  >
                    <option value="Claude Desktop & Cursor">Claude Desktop &amp; Cursor</option>
                    <option value="Cursor IDE Only">Cursor IDE Only</option>
                    <option value="Windsurf Cascade">Windsurf Cascade</option>
                    <option value="Custom Autonomous Agent / Python SDK">Custom Agent / Python SDK</option>
                    <option value="Devin / Cloud Agent">Devin / Cloud Agent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
                  Brief Description of Tools Needed
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. We want Cursor to query our Postgres read-replica for customer account status, but block all write operations."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:border-[#34D59A] transition ${
                    isDark
                      ? "bg-[#131415] border border-[#242628] text-white placeholder:text-[#61646B]"
                      : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs"
                  }`}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className={`text-[11px] ${isDark ? "text-[#797D86]" : "text-slate-500 font-medium"}`}>
                  ⚡ $800–$1,200 flat fee • 50% deposit • 48–72h turnaround
                </span>
                <button
                  type="submit"
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full text-xs font-medium transition duration-200 cursor-pointer shadow-lg ${
                    isDark
                      ? "bg-white text-black hover:bg-[#E4E5E7]"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  <Send className="size-3.5" />
                  <span>Submit Spec for Scoping</span>
                </button>
              </div>
            </form>
          )}

          <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isDark ? "border-[#1C1D1F] text-[#797D86]" : "border-slate-100 text-slate-500"
          }`}>
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
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark ? "border-[#242628] text-[#797D86]" : "border-slate-200/90 text-slate-500"
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
          <a href="/console" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Console</a>
          <a href="/llms.txt" target="_blank" className={`font-mono text-[11px] ${isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}`}>llms.txt</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

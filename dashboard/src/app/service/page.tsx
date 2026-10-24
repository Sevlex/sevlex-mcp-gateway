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
} from "lucide-react";

export default function ServicePage() {
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
    <main className="min-h-screen bg-[#000000] text-white selection:bg-[#34D59A]/20 selection:text-[#34D59A] font-sans antialiased">
      {/* 1. STICKY NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#000000]/85 backdrop-blur-md border-b border-[#242628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sevlex-brand-horizontal.png"
                alt="Sevlex"
                className="h-7 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
              />
            </a>
          </div>

          {/* Desktop Nav Items - Clean 3-Item Architecture */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#94979E]">
            <a href="/product" className="hover:text-white transition-colors">
              Product
            </a>
            <a href="/service" className="text-[#34D59A] font-semibold transition-colors">
              Service
            </a>
            <a href="/about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="/docs" className="hover:text-white transition-colors">
              Docs
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/Sevlex/sevlex-mcp-gateway"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-[#242628] bg-white/[0.02] text-xs font-medium text-[#C9CBCF] hover:border-white hover:text-white transition duration-200"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="/console"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200"
            >
              <span>SecOps Console</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* 2. SERVICE HERO */}
      <section className="pt-20 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] border border-[#242628] text-[#797D86] mb-6">
          <span className="text-[#34D59A] font-semibold">WHITE-GLOVE INTEGRATION</span>
          <span className="text-[#303236]">•</span>
          <span className="text-[#AFB1B6]">48–72 HOUR DELIVERY SLA</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight max-w-4xl mx-auto">
          Done-For-You Custom MCP Server &amp; Agent Integration
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#94979E] leading-relaxed max-w-2xl mx-auto">
          We take your company&apos;s internal database, private microservices, or custom SaaS tool and build a production-grade, zero-trust MCP server in 48 to 72 hours—so your engineering team can query, analyze, and automate directly inside Claude Desktop, Cursor, or autonomous AI agents.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#intake"
            className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200 shadow-lg"
          >
            <span>Request Custom Server Build</span>
            <ArrowRight className="size-3.5" />
          </a>
          <a
            href="https://calendly.com/meetpxnchl/meeting"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-[#242628] bg-[#18191B] hover:bg-[#242628] text-xs font-medium text-white transition duration-200"
          >
            <span>Book 15-Min Scoping Call</span>
          </a>
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Any Internal Source */}
          <div className="rounded-2xl border border-[#242628] bg-[#0E0E12] p-8 flex flex-col justify-between">
            <div>
              <div className="size-11 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A] mb-5">
                <Database className="size-5" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">1. Any Source Connected</h3>
              <p className="text-xs text-[#797D86] leading-relaxed mb-6">
                We design semantic Model Context Protocol schemas for whatever data layer runs your business:
              </p>
              <ul className="space-y-2.5 text-xs text-[#C9CBCF]">
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
            <div className="mt-8 pt-4 border-t border-[#1C1D1F] text-[11px] font-mono text-[#797D86]">
              Transport: Local Stdio or Secure Remote SSE
            </div>
          </div>

          {/* Card 2: Production Zero-Trust Hardening */}
          <div className="rounded-2xl border border-[#242628] bg-[#0E0E12] p-8 flex flex-col justify-between">
            <div>
              <div className="size-11 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-blue-400 mb-5">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">2. Hardened Zero-Trust</h3>
              <p className="text-xs text-[#797D86] leading-relaxed mb-6">
                We don&apos;t just write endpoints; we safeguard your database from hallucinated LLM commands:
              </p>
              <ul className="space-y-2.5 text-xs text-[#C9CBCF]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                  <span>Pre-configured with Sevlex ToolGuard™ AST validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                  <span>Strict read/write scopes &amp; human-in-the-loop gates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                  <span>In-flight DLP output secret &amp; credential redaction</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[#1C1D1F] text-[11px] font-mono text-[#797D86]">
              Governance: Destructive DDL / Injections Arrested
            </div>
          </div>

          {/* Card 3: Pricing & Turnaround */}
          <div className="rounded-2xl border border-[#34D59A]/30 bg-[#0E0E12] p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#34D59A]/10 border-b border-l border-[#34D59A]/20 px-3 py-1 rounded-bl-xl text-[10px] font-mono font-bold text-[#34D59A] uppercase">
              Transparent Flat Fee
            </div>
            <div>
              <div className="size-11 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A] mb-5">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">3. 48–72h Turnaround</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-medium text-white font-mono">$800 – $1,200</span>
                <span className="text-xs text-[#797D86]">/ custom server</span>
              </div>
              <p className="text-xs text-[#797D86] leading-relaxed mb-6">
                50% deposit upfront ($400–$600), balance upon live verification. No hourly overages or unexpected bills.
              </p>
              <ul className="space-y-2.5 text-xs text-[#C9CBCF]">
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
            <div className="mt-8 pt-4 border-t border-[#1C1D1F] text-[11px] font-mono text-[#34D59A]">
              SLA: 100% Money-Back Guarantee
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU RECEIVE */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Delivery Package
          </h2>
          <p className="mt-2 text-3xl font-normal text-white tracking-tight">
            What You Receive in 48–72 Hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <span className="text-xs font-mono text-[#34D59A] block mb-2">01 / PRODUCTION CODE REPOSITORY</span>
            <h4 className="text-base font-medium text-white mb-2">Clean, Documented TypeScript MCP Server</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Complete source code conforming to official Anthropic Model Context Protocol specifications. Includes unit tests, parameter schema definitions, and connection pooling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <span className="text-xs font-mono text-[#34D59A] block mb-2">02 / 1-CLICK CLIENT CONFIGURATIONS</span>
            <h4 className="text-base font-medium text-white mb-2">Pre-Wired Claude &amp; Cursor Configs</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Ready-to-use JSON configs for <code className="text-[#C9CBCF] font-mono">claude_desktop_config.json</code> and Cursor IDE settings. Simply paste and immediately query your data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <span className="text-xs font-mono text-[#34D59A] block mb-2">03 / SECURITY GATEWAY PRE-INTEGRATION</span>
            <h4 className="text-base font-medium text-white mb-2">Pre-Configured with Sevlex Gateway</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Your custom server is pre-shielded with Sevlex Layer 7 ToolGuard™ rules, output DLP secret scrubbing, and cryptographic SQLite WAL audit logging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <span className="text-xs font-mono text-[#34D59A] block mb-2">04 / HANDOFF VIDEO &amp; 14-DAY SUPPORT</span>
            <h4 className="text-base font-medium text-white mb-2">Loom Walkthrough &amp; Direct Engineer Access</h4>
            <p className="text-xs text-[#797D86] leading-relaxed">
              A 5-minute video demonstrating query execution, schema limits, and error handling. Plus 14 days of direct Slack/email support for troubleshooting.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTAKE & SCOPING FORM */}
      <section id="intake" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="rounded-3xl border border-[#242628] bg-[#0C0D0E] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#34D59A]/10 blur-[80px] pointer-events-none rounded-full" />
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
              Submit Your Integration Spec
            </h2>
            <p className="text-xs sm:text-sm text-[#797D86] mt-2">
              Tell us about the internal API, database, or tool you want to connect. We review your requirements and respond within 4 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#34D59A]/10 border border-[#34D59A]/30 text-center">
              <CheckCircle2 className="size-10 text-[#34D59A] mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">Your Request Has Been Prepared!</h3>
              <p className="text-xs text-[#C9CBCF] mt-2 max-w-md mx-auto">
                If your email client did not automatically open, please send your spec directly to{" "}
                <a href="mailto:founder@sevlex.com" className="text-[#34D59A] underline">
                  founder@sevlex.com
                </a>
                . We will review and provide a scoping estimate within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C9CBCF] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#131415] border border-[#242628] text-xs text-white placeholder:text-[#61646B] focus:outline-none focus:border-[#34D59A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C9CBCF] mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#131415] border border-[#242628] text-xs text-white placeholder:text-[#61646B] focus:outline-none focus:border-[#34D59A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C9CBCF] mb-1">Target Source System</label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#131415] border border-[#242628] text-xs text-white focus:outline-none focus:border-[#34D59A]"
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
                  <label className="block text-xs font-medium text-[#C9CBCF] mb-1">Primary AI Client</label>
                  <select
                    value={formData.aiClient}
                    onChange={(e) => setFormData({ ...formData, aiClient: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#131415] border border-[#242628] text-xs text-white focus:outline-none focus:border-[#34D59A]"
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
                <label className="block text-xs font-medium text-[#C9CBCF] mb-1">
                  Brief Description of Tools Needed
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. We want Cursor to query our Postgres read-replica for customer account status, but block all write operations."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#131415] border border-[#242628] text-xs text-white placeholder:text-[#61646B] focus:outline-none focus:border-[#34D59A]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-[#797D86]">
                  ⚡ $800–$1,200 flat fee • 50% deposit • 48–72h turnaround
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200 cursor-pointer shadow-lg"
                >
                  <Send className="size-3.5" />
                  <span>Submit Spec for Scoping</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#1C1D1F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#797D86]">
            <span>Prefer a direct conversation first?</span>
            <a
              href="https://calendly.com/meetpxnchl/meeting"
              target="_blank"
              rel="noreferrer"
              className="text-[#34D59A] underline hover:text-white flex items-center gap-1"
            >
              Book a 15-Minute Scoping Call <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#242628] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#797D86]">
        <div className="flex items-center gap-3 text-[#94979E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sevlex-brand-horizontal.png"
            alt="Sevlex"
            className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition"
          />
          <span>&copy; 2026 Sevlex Security Inc. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href="/product" className="hover:text-white transition">Product</a>
          <a href="/service" className="hover:text-white transition">Service</a>
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/console" className="hover:text-white transition">Console</a>
          <a href="/llms.txt" target="_blank" className="hover:text-white transition font-mono text-[11px]">llms.txt</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className="hover:text-white transition">Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

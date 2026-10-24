"use client";

import React from "react";
import { ShieldCheck, FileText, CheckCircle2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function TermsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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

      {/* Navigation Header */}
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

          <div className={`hidden md:flex items-center gap-8 text-xs font-medium ${
            isDark ? "text-[#94979E]" : "text-[#6B7280]"
          }`}>
            <a href="/product" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>Product</a>
            <a href="/service" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>Service</a>
            <a href="/about" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>About</a>
            <a href="/docs" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>Docs</a>
          </div>

          <div className="flex items-center gap-2.5">
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
              {isDark ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-slate-700" />}
            </button>
            <a
              href="/console"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 h-8 px-4 tracking-tight font-medium bg-[#34D59A] text-black hover:bg-[#2bc48b] text-xs font-mono font-bold"
            >
              Console
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="space-y-4 pb-12 border-b border-dashed border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#34D59A]/10 text-[#34D59A] border border-[#34D59A]/20">
            <FileText className="size-3.5" />
            Legal Agreement
          </div>
          <h1 className={`text-3xl sm:text-5xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Terms of Service
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#94979E]" : "text-slate-600"}`}>
            Effective Date: October 24, 2026 · Sevlex Terms of Service &amp; Customer Agreement
          </p>
        </div>

        <div className={`mt-12 space-y-12 text-sm sm:text-base leading-relaxed ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              1. Agreement &amp; Acceptance
            </h2>
            <p>
              By installing, running, downloading, or accessing the Sevlex CLI (`sevlex`), the Sevlex Gateway proxy, or the SecOps Console at `sevlex.com` and `app.sevlex.com`, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or legal entity, you represent that you have the authority to bind such entity.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              2. Intellectual Property &amp; Customer Ownership
            </h2>
            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-[#0E0E12] border-[#242628]" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A] mt-2 shrink-0" />
                  <span><strong>100% Customer Ownership:</strong> You retain complete ownership of all your code, schemas, agent instructions, custom MCP server source code, and cryptographic audit receipts generated through Sevlex.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A] mt-2 shrink-0" />
                  <span><strong>Open Source Gateway:</strong> The core Sevlex Gateway CLI engine is licensed under the Apache 2.0 license. You may inspect, modify, and audit the proxy source code directly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A] mt-2 shrink-0" />
                  <span><strong>No Reverse Engineering of Proprietary SaaS:</strong> You agree not to decompile, reverse engineer, or exploit the hosted SecOps multi-tenant console or API infrastructure without written authorization.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              3. Permitted Use &amp; Security Compliance
            </h2>
            <p>
              Sevlex is designed to secure, monitor, and quarantine MCP tool calls and autonomous AI coding agents. You agree to use Sevlex in compliance with all applicable local, national, and international cybersecurity laws. You may not use Sevlex to intentionally intercept network traffic of unauthorized third parties or inject malicious payloads into external systems.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              4. Service Availability &amp; SLAs
            </h2>
            <p>
              The Sevlex SecOps cloud console and Neon-backed database sync strive for 99.9% uptime. However, because the core gateway is local-first, failure or latency in external networks will not interrupt your local MCP agent executions unless explicitly configured to require cloud consensus.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              5. Disclaimer of Warranties
            </h2>
            <p className="text-xs sm:text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEVLEX PROVIDES ITS SERVICES AND SOFTWARE &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              6. Contact Information
            </h2>
            <div className={`p-4 rounded-xl border font-mono text-xs ${
              isDark ? "bg-[#0E0E12] border-[#242628] text-[#C9CBCF]" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}>
              <p>Sevlex Legal &amp; Compliance Team</p>
              <p>Email: legal@sevlex.com / founder@sevlex.com</p>
              <p>Website: https://sevlex.com</p>
            </div>
          </section>
        </div>
      </article>

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
          <a href="/docs" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Docs</a>
          <a href="/privacy" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Privacy</a>
          <a href="/terms" className="text-[#34D59A] font-medium">Terms</a>
        </div>
      </footer>
    </main>
  );
}

"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, Database, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function PrivacyPage() {
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
        isDark ? "bg-[#000000]/85 border-b border-white/[0.08]" : "bg-white/85 border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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
                  ? "border-white/[0.08] bg-[#141518] text-gray-300 hover:text-white hover:border-[#383A42]"
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
            <ShieldCheck className="size-3.5" />
            Enterprise Privacy Commitment
          </div>
          <h1 className={`text-3xl sm:text-5xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Privacy Policy
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-[#94979E]" : "text-slate-600"}`}>
            Effective Date: October 24, 2026 · Sevlex Zero-Trust Privacy Standard
          </p>
        </div>

        <div className={`mt-12 space-y-12 text-sm sm:text-base leading-relaxed ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              1. Our Zero-Trust Data Guarantee
            </h2>
            <p>
              Sevlex builds infrastructure for autonomous AI coding agents and the Model Context Protocol (MCP). Our architecture is founded on a strict, mathematical principle: <strong>your source code, tool arguments, database queries, and private payloads are your exclusive property</strong>.
            </p>
            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-[#0E1014] border-white/[0.08]" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A] mt-2 shrink-0" />
                  <span><strong>Zero AI Training:</strong> Sevlex never stores, harvests, or trains machine learning models on your tool payloads, prompts, or AST inspection traces.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A] mt-2 shrink-0" />
                  <span><strong>Local-First Wire Execution:</strong> When you run the Sevlex Gateway locally (`npx sevlex`), tool interception occurs entirely within your local machine boundary over stdio and local loopback transport.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#34D59A] mt-2 shrink-0" />
                  <span><strong>Cryptographic Merkle Proofs:</strong> Audit logs are hashed locally into SHA-256 Merkle receipts before optional cloud sync into customer-isolated Neon PostgreSQL databases.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              2. Information We Collect
            </h2>
            <p>We only collect information strictly necessary to provide the SecOps console and authentication services:</p>
            <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
              <li><strong>Account &amp; Identity Information:</strong> When you authenticate via Google OAuth or GitHub OAuth, we receive your email address, profile name, and profile avatar URL to identify your session.</li>
              <li><strong>SecOps Telemetry (Optional Cloud Sync):</strong> If you configure your gateway to sync audit receipts to the cloud console, we store masked tool names, timestamps, execution statuses (ALLOWED, BLOCKED, DLP_REDACTED), and Merkle hash chains. Sensitive tokens (AWS keys, OpenAI keys, PII) are redacted in-flight before persistence.</li>
              <li><strong>Operational Logs:</strong> Standard HTTP request metadata (IP address, user agent) used strictly for rate limiting, DDoS mitigation, and server health monitoring.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              3. Data Storage &amp; Encryption
            </h2>
            <p>
              All cloud data is hosted on serverless infrastructure backed by Neon Lakebase PostgreSQL in the US region. All data in transit is encrypted with TLS 1.3, and all data at rest is encrypted with AES-256. Multi-tenant customer data is logically isolated using tenant-scoped organization IDs.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              4. Data Deletion &amp; Rights
            </h2>
            <p>
              Under GDPR, CCPA, and global privacy standards, you maintain complete rights to request an export of your audit receipts (via CSV in the SecOps console) or complete deletion of your account and associated database records.
            </p>
            <p>
              To request full data erasure, email us directly at{" "}
              <a href="mailto:privacy@sevlex.com" className="text-[#34D59A] underline font-semibold">
                privacy@sevlex.com
              </a>
              . All requests are processed within 48 business hours.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or require an enterprise Data Processing Agreement (DPA), please reach out to:
            </p>
            <div className={`p-4 rounded-xl border font-mono text-xs ${
              isDark ? "bg-[#0E1014] border-white/[0.08] text-[#C9CBCF]" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}>
              <p>Sevlex Privacy &amp; Security Office</p>
              <p>Email: privacy@sevlex.com / founder@sevlex.com</p>
              <p>Website: https://sevlex.com</p>
            </div>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark ? "border-white/[0.08] text-[#797D86]" : "border-slate-200 text-slate-500"
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
          <a href="/privacy" className="text-[#34D59A] font-medium">Privacy</a>
          <a href="/terms" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Terms</a>
        </div>
      </footer>
    </main>
  );
}

"use client";

import React from "react";
import {
  Shield,
  ShieldCheck,
  Terminal,
  Zap,
  ArrowRight,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function AboutPage() {
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

      {/* Signature Sevlex Quantum Caustic Aurora */}
      <div 
        aria-hidden="true"
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] rounded-full pointer-events-none blur-3xl transition-opacity duration-300 ${
          isDark 
            ? "bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.12)_0%,rgba(52,213,154,0.09)_35%,rgba(99,102,241,0.05)_70%,transparent_85%)] opacity-80"
            : "bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.09)_0%,rgba(5,150,105,0.06)_40%,transparent_80%)] opacity-70"
        }`} 
      />

      {/* 1. STICKY MINIMAL NAVBAR */}
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
            <a href="/service" className={isDark ? "hover:text-white transition-colors" : "hover:text-black transition-colors"}>
              Service
            </a>
            <a href="/about" className="text-[#34D59A] font-semibold transition-colors">
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

      {/* 2. HERO STORY */}
      <section className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-6 ${
          isDark
            ? "bg-[#131415] border border-[#242628] text-[#797D86]"
            : "bg-slate-100 border border-slate-300 text-slate-700 shadow-xs"
        }`}>
          <span className="text-[#34D59A] font-semibold">ABOUT SEVLEX</span>
          <span className={isDark ? "text-[#303236]" : "text-slate-300"}>•</span>
          <span className={isDark ? "text-[#AFB1B6]" : "text-slate-600"}>OUR MISSION</span>
        </div>
        <h1 className={`text-4xl sm:text-6xl font-medium tracking-tight leading-tight max-w-3xl mx-auto ${
          isDark ? "text-white" : "text-slate-950"
        }`}>
          Securing the Autonomous Coding Agent Frontier
        </h1>
        <p className={`mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
          isDark ? "text-[#94979E]" : "text-slate-600"
        }`}>
          Autonomous AI agents powered by the Model Context Protocol are writing code, querying databases, and executing shell commands.
          Sevlex is the zero-latency, zero-trust security fabric that keeps engineering teams in control.
        </p>
      </section>

      {/* 3. THE PROBLEM & SOLUTION */}
      <section className={`py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-[#242628]" : "border-slate-200/90"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-semibold">The Danger</span>
            <h2 className={`text-2xl sm:text-3xl font-normal mt-2 mb-4 tracking-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}>
              Unrestricted Agent Access Is an Enterprise Liability
            </h2>
            <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              When developers plug Claude Desktop, Cursor, or autonomous agents directly into their internal databases and cloud APIs via MCP, there is no safety layer. A single hallucinated SQL query can delete production tables; a malicious prompt injection can exfiltrate AWS credentials in seconds.
            </p>
            <p className={`text-sm leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Traditional firewalls and proxies inspect HTTP at Layer 3/4. They cannot understand JSON-RPC stdio pipes or parse SQL AST parameters in-flight.
            </p>
          </div>

          <div className={`rounded-2xl p-8 transition-colors ${
            isDark
              ? "border border-[#242628] bg-[#0E0E12] shadow-xl"
              : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(15,23,42,0.08)]"
          }`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D59A] font-semibold">The Sevlex Solution</span>
            <h3 className={`text-xl font-medium mt-2 mb-4 ${isDark ? "text-white" : "text-slate-950"}`}>
              Layer 7 Deep Packet Inspection for MCP
            </h3>
            <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
              Sevlex transparently wraps downstream stdio and SSE connections with zero configuration. It intercepts every tool call, inspects parameters before downstream transmission, redacts sensitive output in microseconds, and cryptographically signs every audit receipt.
            </p>
            <div className={`p-4 rounded-xl font-mono text-xs flex items-center justify-between ${
              isDark ? "bg-[#000000] border border-[#242628] text-[#34D59A]" : "bg-slate-900 border border-slate-800 text-[#34D59A]"
            }`}>
              <span>Latency Overhead</span>
              <span className="font-bold">&lt;0.1ms wire delay</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE ENGINEERING PILLARS */}
      <section className={`py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? "border-[#242628]" : "border-slate-200/90"
      }`}>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Architectural Guarantees
          </h2>
          <p className={`mt-2 text-3xl font-normal tracking-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            How We Build for Mission-Critical Engineering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <div className={`size-10 rounded-full flex items-center justify-center text-[#34D59A] mb-4 ${
              isDark ? "bg-[#18191B] border border-[#242628]" : "bg-emerald-50 border border-emerald-200"
            }`}>
              <ShieldCheck className="size-5" />
            </div>
            <h3 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Zero-Trust Parameter Inspection
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Every tool call is validated against organization policies. Destructive SQL operations (DROP TABLE, TRUNCATE), dangerous shell executions (rm -rf /), and sensitive path traversals are arrested before execution.
            </p>
          </div>

          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <div className={`size-10 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4 ${
              isDark ? "bg-[#18191B] border border-[#242628]" : "bg-blue-50 border border-blue-200"
            }`}>
              <Terminal className="size-5" />
            </div>
            <h3 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Zero Developer Friction
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Run <code className={`font-mono ${isDark ? "text-[#C9CBCF]" : "text-slate-800 font-semibold"}`}>npx sevlex init</code> to shield your developer workstations in 10 seconds. No root privileges, no kernel drivers, no Docker requirements, and zero disruption to agent speed.
            </p>
          </div>

          <div className={`p-6 rounded-2xl transition-colors ${
            isDark
              ? "bg-[#0E0E12] border border-[#242628]"
              : "bg-white border border-slate-200/90 ring-1 ring-slate-900/[0.04] shadow-sm"
          }`}>
            <div className={`size-10 rounded-full flex items-center justify-center text-purple-500 dark:text-purple-400 mb-4 ${
              isDark ? "bg-[#18191B] border border-[#242628]" : "bg-purple-50 border border-purple-200"
            }`}>
              <FileCheck2 className="size-5" />
            </div>
            <h3 className={`text-base font-medium mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
              Cryptographic Audit Chains
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#797D86]" : "text-slate-600"}`}>
              Every event is mathematically sealed into an immutable SQLite WAL / PostgreSQL Merkle hash chain. Non-repudiation is guaranteed: any tampering or deletion breaks the hash root, built for rigorous enterprise security audits.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className={`py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t transition-colors ${
        isDark ? "border-[#242628]" : "border-slate-200/90"
      }`}>
        <div className={`rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? "border border-[#242628] bg-[#0C0D0E]"
            : "border border-slate-200/90 ring-1 ring-slate-900/[0.04] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#34D59A]/10 blur-[90px] pointer-events-none rounded-full" />
          <h2 className={`text-3xl sm:text-4xl font-medium tracking-tight relative z-10 ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            Empower Your Engineering Team with Safe AI Agents
          </h2>
          <p className={`mt-4 max-w-xl mx-auto text-sm relative z-10 ${
            isDark ? "text-[#797D86]" : "text-slate-600"
          }`}>
            Launch our Console to inspect your live agent fleet, or speak with our engineering team for custom MCP integration.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <a
              href="/service"
              className={`inline-flex items-center gap-2 h-11 px-6 rounded-full border text-xs font-medium transition duration-200 ${
                isDark
                  ? "border-[#242628] bg-[#18191B] hover:bg-[#242628] text-white"
                  : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs"
              }`}
            >
              <span>Explore Custom MCP Services</span>
            </a>
            <a
              href="/console"
              className={`inline-flex items-center gap-2 h-11 px-7 rounded-full text-xs font-medium transition duration-200 ${
                isDark
                  ? "bg-white text-black hover:bg-[#E4E5E7]"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              }`}
            >
              <span>Launch Console</span>
              <ArrowRight className="size-3.5" />
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
          <a href="/docs" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Docs</a>
          <a href="/privacy" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Privacy</a>
          <a href="/terms" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Terms</a>
          <a href="/console" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Console</a>
          <a href="/llms.txt" target="_blank" className={`font-mono text-[11px] ${isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}`}>llms.txt</a>
          <a href="https://github.com/Sevlex/sevlex-mcp-gateway" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>GitHub</a>
          <a href="https://calendly.com/meetpxnchl/meeting" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Book Enterprise Demo</a>
        </div>
      </footer>
    </main>
  );
}

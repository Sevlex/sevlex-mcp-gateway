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
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-white selection:bg-[#34D59A]/20 selection:text-[#34D59A] font-sans antialiased">
      {/* 1. STICKY MINIMAL NAVBAR */}
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
            <a href="/service" className="hover:text-white transition-colors">
              Service
            </a>
            <a href="/about" className="text-[#34D59A] font-semibold transition-colors">
              About
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

      {/* 2. HERO STORY */}
      <section className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] border border-[#242628] text-[#797D86] mb-6">
          <span className="text-[#34D59A] font-semibold">ABOUT SEVLEX</span>
          <span className="text-[#303236]">•</span>
          <span className="text-[#AFB1B6]">OUR MISSION</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight">
          Securing the Autonomous Coding Agent Frontier
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#94979E] leading-relaxed max-w-2xl mx-auto">
          Autonomous AI agents powered by the Model Context Protocol are writing code, querying databases, and executing shell commands.
          Sevlex is the zero-latency, zero-trust security fabric that keeps engineering teams in control.
        </p>
      </section>

      {/* 3. THE PROBLEM & SOLUTION */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-medium">The Danger</span>
            <h2 className="text-2xl sm:text-3xl font-normal text-white mt-2 mb-4">
              Unrestricted Agent Access Is an Enterprise Liability
            </h2>
            <p className="text-sm text-[#797D86] leading-relaxed mb-4">
              When developers plug Claude Desktop, Cursor, or autonomous agents directly into their internal databases and cloud APIs via MCP, there is no safety layer. A single hallucinated SQL query can delete production tables; a malicious prompt injection can exfiltrate AWS credentials in seconds.
            </p>
            <p className="text-sm text-[#797D86] leading-relaxed">
              Traditional firewalls and proxies inspect HTTP at Layer 3/4. They cannot understand JSON-RPC stdio pipes or parse SQL AST parameters in-flight.
            </p>
          </div>

          <div className="rounded-2xl border border-[#242628] bg-[#0E0E12] p-8 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D59A] font-medium">The Sevlex Solution</span>
            <h3 className="text-xl font-medium text-white mt-2 mb-4">
              Layer 7 Deep Packet Inspection for MCP
            </h3>
            <p className="text-sm text-[#C9CBCF] leading-relaxed mb-6">
              Sevlex transparently wraps downstream stdio and SSE connections with zero configuration. It intercepts every tool call, inspects parameters before downstream transmission, redacts sensitive output in microseconds, and cryptographically signs every audit receipt.
            </p>
            <div className="p-4 rounded-xl bg-[#000000] border border-[#242628] font-mono text-xs text-[#34D59A] flex items-center justify-between">
              <span>Latency Overhead</span>
              <span className="font-bold">&lt;0.1ms wire delay</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE ENGINEERING PILLARS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#242628]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#34D59A] font-mono font-medium">
            Architectural Guarantees
          </h2>
          <p className="mt-2 text-3xl font-normal text-white tracking-tight">
            How We Build for Mission-Critical Engineering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-[#34D59A] mb-4">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Zero-Trust Parameter Inspection</h3>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Every tool call is validated against organization policies. Destructive SQL operations (DROP TABLE, TRUNCATE), dangerous shell executions (rm -rf /), and sensitive path traversals are arrested before execution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-blue-400 mb-4">
              <Terminal className="size-5" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Zero Developer Friction</h3>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Run <code className="text-[#C9CBCF] font-mono">npx sevlex init</code> to shield your developer workstations in 10 seconds. No root privileges, no kernel drivers, no Docker requirements, and zero disruption to agent speed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E12] border border-[#242628]">
            <div className="size-10 rounded-full bg-[#18191B] border border-[#242628] flex items-center justify-center text-purple-400 mb-4">
              <FileCheck2 className="size-5" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Cryptographic Audit Chains</h3>
            <p className="text-xs text-[#797D86] leading-relaxed">
              Every event is mathematically sealed into an immutable SQLite WAL Merkle hash chain. Non-repudiation is guaranteed: any tampering or deletion breaks the hash root, satisfying SOC 2 and ISO 27001 requirements.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-[#242628]">
        <div className="rounded-3xl border border-[#242628] bg-[#0C0D0E] p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#34D59A]/10 blur-[90px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight relative z-10">
            Empower Your Engineering Team with Safe AI Agents
          </h2>
          <p className="mt-4 text-[#797D86] max-w-xl mx-auto text-sm relative z-10">
            Launch our SecOps Console to inspect your live agent fleet, or speak with our engineering team for custom MCP integration.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <a
              href="/#services"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-[#242628] bg-[#18191B] hover:bg-[#242628] text-xs font-medium text-white transition duration-200"
            >
              <span>Explore Custom MCP Services</span>
            </a>
            <a
              href="/console"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-white text-black hover:bg-[#E4E5E7] text-xs font-medium transition duration-200"
            >
              <span>Launch SecOps Console</span>
              <ArrowRight className="size-3.5" />
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

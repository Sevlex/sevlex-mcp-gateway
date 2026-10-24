"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Eye,
  FileCheck2,
  Lock,
  ArrowRight,
  Database,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Fingerprint,
} from "lucide-react";

export default function EngineBentoGrid() {
  const [activeTab, setActiveTab] = useState<"all" | "ast" | "circuit" | "dlp" | "merkle">("all");

  return (
    <section id="product" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-purple-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] text-[#34D59A] border border-[#242628] mb-4 shadow-sm">
          <ShieldCheck className="size-3.5 text-[#34D59A]" />
          <span>Core Security Engines</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          Four Layers of Zero-Trust Agent Defense
        </h2>
        <p className="mt-4 text-[#94979E] text-base sm:text-lg leading-relaxed">
          Engineered from the ground up for agentic AI. Intercept tool calls, prevent hallucination loops, scrub credentials, and seal cryptographic audit trails.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* BENTO GRID (4 CORE ENGINES WITH 3D MOTION GRAPHICS)                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* =======================================================================
            CARD 1: ToolGuard™ AST Deep Packet Inspection (Span 7)
            ======================================================================= */}
        <div className="lg:col-span-7 rounded-3xl border border-[#242628] bg-gradient-to-b from-[#12141A] to-[#0A0B0E] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-emerald-500/30 transition-all duration-300">
          {/* Subtle Ambient Radial Corner */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

          {/* Card Meta */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#34D59A] shadow-inner">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    ToolGuard™ Parameter AST DPI
                  </h3>
                  <p className="text-xs text-[#797D86] font-mono mt-0.5">
                    Microsecond In-Flight Syntax Parser
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#34D59A] border border-emerald-500/20">
                0.38ms Latency
              </span>
            </div>

            <p className="text-sm text-[#AFB1B6] leading-relaxed mb-6">
              Deconstructs tool payloads into abstract syntax trees before downstream execution. Arrests destructive commands like <code className="text-rose-400 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">DROP TABLE</code>, shell injections, and directory traversals in-flight.
            </p>
          </div>

          {/* 3D Motion Graphic: Live AST Syntax Radar Scanner */}
          <div className="relative z-10 rounded-2xl border border-[#222530] bg-[#07080B] p-4.5 font-mono text-xs overflow-hidden shadow-inner">
            {/* Top Scanning Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E212B] text-[11px]">
              <div className="flex items-center gap-2 text-[#797D86]">
                <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Active AST Interceptor Gate</span>
              </div>
              <span className="text-emerald-400 font-semibold text-[10px]">PARSED: OK</span>
            </div>

            {/* Tree Nodes Graphic */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-[#34D59A]">┌──</span>
                <span className="px-2 py-0.5 rounded bg-[#13151D] border border-[#272B38] text-gray-200">
                  Tool: <span className="text-white font-semibold">postgres:execute_query</span>
                </span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-gray-400">
                <span className="text-[#34D59A]">├──</span>
                <span className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 font-semibold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-rose-400 animate-pulse" />
                  AST Node: DropTableStatement [P0_CRITICAL]
                </span>
                <span className="text-[10px] text-gray-500">→ Quarantine Initiated</span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-gray-400">
                <span className="text-[#34D59A]">└──</span>
                <span className="px-2 py-0.5 rounded bg-[#101218] border border-[#20232E] text-emerald-400">
                  Target: <span className="text-white font-mono">&quot;production_users&quot;</span> [0 BYTES FORWARDED]
                </span>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="mt-3 pt-3 border-t border-[#1E212B] flex items-center justify-between text-[10px] text-[#61646B]">
              <span>Rule P-102 Enforced</span>
              <span className="text-emerald-400 font-mono">Zero Database Impact</span>
            </div>
          </div>
        </div>

        {/* =======================================================================
            CARD 2: AgentGuard™ Circuit Breaker (Span 5)
            ======================================================================= */}
        <div className="lg:col-span-5 rounded-3xl border border-[#242628] bg-gradient-to-b from-[#12141A] to-[#0A0B0E] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    AgentGuard™ Breaker
                  </h3>
                  <p className="text-xs text-[#797D86] font-mono mt-0.5">
                    Hallucination Loop Protector
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Rate Limit
              </span>
            </div>

            <p className="text-sm text-[#AFB1B6] leading-relaxed mb-6">
              Halts runaway agent retry loops when models enter infinite reasoning spirals or exceed strict velocity thresholds (e.g. 25 calls per 30s).
            </p>
          </div>

          {/* 3D Motion Graphic: Velocity Gauge & Circuit Waveform */}
          <div className="relative z-10 rounded-2xl border border-[#222530] bg-[#07080B] p-4.5 font-mono text-xs overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E212B] text-[11px]">
              <span className="text-[#797D86]">Loop Velocity Monitor</span>
              <span className="text-amber-400 font-semibold text-[10px]">SURGE DETECTED</span>
            </div>

            {/* Velocity Bar Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Agent Tool Calls:</span>
                <span className="text-amber-400 font-bold">28 / 25 limit</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#181A22] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-[92%] transition-all duration-500" />
              </div>
              <div className="flex justify-between text-[10px] text-[#61646B] pt-1">
                <span>0 calls</span>
                <span className="text-rose-400 font-semibold">Tripped (429 Cooldown)</span>
                <span>30 calls</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#1E212B] flex items-center justify-between text-[10px]">
              <span className="text-gray-500">API Cost Saved:</span>
              <span className="text-[#34D59A] font-semibold font-mono">~$18.40 / loop</span>
            </div>
          </div>
        </div>

        {/* =======================================================================
            CARD 3: In-Flight Output DLP (Span 5)
            ======================================================================= */}
        <div className="lg:col-span-5 rounded-3xl border border-[#242628] bg-gradient-to-b from-[#12141A] to-[#0A0B0E] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                  <Eye className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    In-Flight Output DLP
                  </h3>
                  <p className="text-xs text-[#797D86] font-mono mt-0.5">
                    Real-time Secret Redaction
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Zero Leaks
              </span>
            </div>

            <p className="text-sm text-[#AFB1B6] leading-relaxed mb-6">
              Scrubs high-entropy AWS keys, Stripe tokens, database credentials, and GitHub PATs from tool outputs before the LLM can absorb or echo them.
            </p>
          </div>

          {/* 3D Motion Graphic: Live Laser Redaction Scanner */}
          <div className="relative z-10 rounded-2xl border border-[#222530] bg-[#07080B] p-4.5 font-mono text-xs overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E212B] text-[11px]">
              <span className="text-[#797D86]">Entropy Redaction Stream</span>
              <span className="text-purple-400 font-semibold text-[10px]">MASK APPLIED</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#10121A] border border-[#202330] flex items-center justify-between">
                <span className="text-gray-500">Ingress String:</span>
                <span className="text-rose-400/90 font-mono">AKIAIOSFODNN7EXAMPLE</span>
              </div>
              <div className="flex justify-center text-purple-400 text-xs">▼ Redaction Laser ▼</div>
              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
                <span className="text-gray-400">LLM Receives:</span>
                <span className="text-purple-300 font-semibold font-mono flex items-center gap-1.5">
                  <Lock className="size-3 text-purple-400" />
                  [REDACTED_AWS_SECRET]
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#1E212B] flex items-center justify-between text-[10px] text-[#61646B]">
              <span>Regex + Shannon Entropy Analysis</span>
              <span className="text-purple-400">&lt;0.2ms overhead</span>
            </div>
          </div>
        </div>

        {/* =======================================================================
            CARD 4: SOC 2 Merkle Audit Ledger (Span 7)
            ======================================================================= */}
        <div className="lg:col-span-7 rounded-3xl border border-[#242628] bg-gradient-to-b from-[#12141A] to-[#0A0B0E] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                  <FileCheck2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    Cryptographic Merkle Audit Trail
                  </h3>
                  <p className="text-xs text-[#797D86] font-mono mt-0.5">
                    Immutable Compliance Records
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                SOC 2 Type II
              </span>
            </div>

            <p className="text-sm text-[#AFB1B6] leading-relaxed mb-6">
              Every tool execution receipt is mathematically linked via SHA-256 to its predecessor and synced with Neon PostgreSQL. Any tampering or deletion breaks the cryptographic chain instantly.
            </p>
          </div>

          {/* 3D Motion Graphic: Chained Merkle Hash Nodes */}
          <div className="relative z-10 rounded-2xl border border-[#222530] bg-[#07080B] p-4.5 font-mono text-xs overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E212B] text-[11px]">
              <span className="text-[#797D86]">Neon PostgreSQL Hash Chain</span>
              <span className="text-blue-400 font-semibold text-[10px]">VERIFIED SEALED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#101218] border border-[#20232E] text-center space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase">Block #142392</span>
                <span className="text-xs text-gray-300 font-mono block">a9f1...e402</span>
                <span className="text-[10px] text-emerald-400 font-semibold">✔ Validated</span>
              </div>
              <div className="p-3 rounded-xl bg-[#131622] border border-blue-500/40 text-center space-y-1 shadow-sm">
                <span className="text-[10px] text-blue-300 block uppercase font-bold">Block #142393</span>
                <span className="text-xs text-blue-200 font-mono block font-bold">7c8e...f5a6</span>
                <span className="text-[10px] text-blue-400 font-semibold">⚡ Current Sealed</span>
              </div>
              <div className="p-3 rounded-xl bg-[#101218] border border-[#20232E] text-center space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase">Block #142394</span>
                <span className="text-xs text-gray-300 font-mono block">e3b0...b855</span>
                <span className="text-[10px] text-emerald-400 font-semibold">✔ Next Seed</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#1E212B] flex items-center justify-between text-[10px] text-[#61646B]">
              <span>Formula: entry_hash = SHA256(prev_hash || receipt)</span>
              <span className="text-blue-400 font-semibold">Zero-Knowledge Integrity</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONNECTED 3-PILLAR DEPLOYMENT PIPELINE (UNIFIED DOCK)                     */}
      {/* ========================================================================= */}
      <div className="mt-12 p-2 rounded-3xl border border-[#242628] bg-[#0E0E12] shadow-xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-[#1E2028] hover:border-emerald-500/30 transition-all group">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#34D59A] font-semibold mb-2 flex items-center gap-2">
              <Terminal className="size-3.5" />
              <span>Where Developers Build</span>
            </div>
            <h4 className="text-base font-semibold text-white mb-2 group-hover:text-[#34D59A] transition-colors">
              Local Zero-Friction Shield
            </h4>
            <p className="text-xs text-[#94979E] leading-relaxed">
              Run <code className="text-[#C9CBCF] font-mono bg-[#1E212B] px-1 py-0.5 rounded">npx sevlex init</code> to instantly wrap Cursor and Claude Desktop in local stdio filters. Zero accounts required.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-[#1E2028] hover:border-blue-500/30 transition-all group">
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <Layers className="size-3.5" />
              <span>Where Teams Collaborate</span>
            </div>
            <h4 className="text-base font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Shared Policy Governance
            </h4>
            <p className="text-xs text-[#94979E] leading-relaxed">
              Sync global allowlists and rate limits across your team. Receive real-time Slack incident cards the instant an agent attempts a malicious call.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-[#1E2028] hover:border-purple-500/30 transition-all group">
            <div className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-semibold mb-2 flex items-center gap-2">
              <Fingerprint className="size-3.5" />
              <span>Where Enterprises Comply</span>
            </div>
            <h4 className="text-base font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
              SOC 2 Mathematical Proofs
            </h4>
            <p className="text-xs text-[#94979E] leading-relaxed">
              Cryptographically seal every autonomous action. Hand compliance auditors verified cryptographic proof that sensitive keys never touched an LLM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

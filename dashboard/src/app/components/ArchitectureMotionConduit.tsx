"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Zap,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Terminal,
  Database,
  Layers,
  ArrowRight,
  Cpu,
  Flame,
  Radio,
  Sparkles,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Scenario {
  id: "clean" | "ddl_attack" | "secret_dlp";
  name: string;
  badge: string;
  color: string;
  sourceAgent: "cursor" | "claude" | "windsurf" | "python";
  targetSystem: "postgres" | "github" | "aws" | "stripe";
  payloadTitle: string;
  payloadRpc: string;
  astAnalysis: string;
  outcome: "permitted" | "blocked" | "redacted";
  latency: string;
  merkleHash: string;
  description: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "clean",
    name: "01 / Valid Read Query",
    badge: "100% Non-Blocking",
    color: "#34D59A",
    sourceAgent: "cursor",
    targetSystem: "postgres",
    payloadTitle: 'tools/call: pg_query("SELECT id, email, team_id FROM users LIMIT 25")',
    payloadRpc: '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "pg_query", "arguments": {"sql": "SELECT id, email, team_id FROM users LIMIT 25"}}, "id": 1042}',
    astAnalysis: "AST DPI: Clean AST (SELECT stmt). Zero DDL mutations. Schema read-only token verified.",
    outcome: "permitted",
    latency: "0.38ms",
    merkleHash: "0x7f4a...8e91 (Merkle Root Stamped)",
    description: "Benign analytical query passes through ToolGuard AST DPI transparently in under 0.42ms.",
  },
  {
    id: "ddl_attack",
    name: "02 / DDL Drop Injection",
    badge: "P0 Threat Quarantined",
    color: "#EF4444",
    sourceAgent: "claude",
    targetSystem: "postgres",
    payloadTitle: 'tools/call: pg_query("DROP TABLE users CASCADE; --")',
    payloadRpc: '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "pg_query", "arguments": {"sql": "DROP TABLE users CASCADE; --"}}, "id": 1043}',
    astAnalysis: "AST VIOLATION DETECTED: Destructive DDL mutation node [DropTableStmt]. Policy rule: DENY_DESTRUCTIVE_DDL.",
    outcome: "blocked",
    latency: "0.29ms (Halted in-flight)",
    merkleHash: "0x9c21...3b04 (Quarantined Incident Stamped)",
    description: "Rogue hallucination or prompt injection attempting to drop production data is halted and diverted to quarantine.",
  },
  {
    id: "secret_dlp",
    name: "03 / Credential Leak Redaction",
    badge: "Secret Stripped",
    color: "#38BDF8",
    sourceAgent: "windsurf",
    targetSystem: "aws",
    payloadTitle: 'tools/call: s3_read_env("AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI...")',
    payloadRpc: '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "s3_read_env", "arguments": {"file": ".env.production"}}, "id": 1044}',
    astAnalysis: "OUTPUT DLP SCAN: High-entropy secret token identified (Shannon entropy: 4.82). AWS Secret Access Key masked.",
    outcome: "redacted",
    latency: "0.41ms",
    merkleHash: "0x1d58...ff29 (Sanitized Ledger Stamped)",
    description: "High-entropy API keys and passwords masked to [REDACTED_SEVLEX_DLP] before returning to agent context.",
  },
];

export default function ArchitectureMotionConduit() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [packetProgress, setPacketProgress] = useState<number>(0);
  const [quarantineCount, setQuarantineCount] = useState<number>(142);

  const scenario = SCENARIOS[activeScenarioIdx];

  // Auto-cycle through scenarios when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
      setPacketProgress(0);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth micro-animation loop for packet progress
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 2400; // 2.4s per pulse cycle

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setPacketProgress(progress);
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeScenarioIdx]);

  return (
    <div
      className={`relative rounded-3xl border transition-all overflow-hidden ${
        isDark
          ? "border-white/[0.08] bg-[#07080A] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          : "border-slate-200/90 bg-white ring-1 ring-slate-900/[0.04] shadow-xl"
      }`}
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none rounded-full blur-[120px] transition-all duration-700 opacity-20"
        style={{
          background:
            scenario.outcome === "blocked"
              ? "radial-gradient(circle, #EF4444 0%, transparent 70%)"
              : scenario.outcome === "redacted"
              ? "radial-gradient(circle, #38BDF8 0%, transparent 70%)"
              : "radial-gradient(circle, #34D59A 0%, transparent 70%)",
        }}
      />

      {/* Subtle coordinate dot matrix */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, #FFFFFF 1px, transparent 1px)"
            : "radial-gradient(circle, #0F172A 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header Bar: Scenario Selector & Live Controls */}
      <div
        className={`relative z-10 px-5 sm:px-8 py-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? "border-white/[0.06] bg-[#0A0C10]/80" : "border-slate-200/80 bg-slate-50/70"
        } backdrop-blur-md`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#34D59A] animate-ping" />
            <span className="text-[11px] font-mono font-semibold text-[#34D59A] uppercase tracking-wider">
              Layer 7 Kinetic Architecture
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isDark
                  ? "border-white/[0.08] bg-white/[0.03] text-[#797D86]"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              Zero-Trust Wire Conduit
            </span>
          </div>
          <h3
            className={`text-lg sm:text-xl font-semibold tracking-tight mt-1 ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}
          >
            In-Flight Tool Call Interception &amp; AST Enforcement
          </h3>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`flex items-center p-1 rounded-xl border ${
              isDark ? "border-white/[0.08] bg-[#0E1015]" : "border-slate-200 bg-slate-100"
            }`}
          >
            {SCENARIOS.map((s, idx) => {
              const isActive = activeScenarioIdx === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScenarioIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? isDark
                        ? "bg-[#181C24] text-white shadow-sm border border-white/[0.12]"
                        : "bg-white text-[#0F172A] shadow-xs border border-slate-200 font-medium"
                      : isDark
                      ? "text-[#797D86] hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span
                    className="size-1.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: isActive ? s.color : isDark ? "#4B5563" : "#94A3B8",
                    }}
                  />
                  <span>{s.name.split("/")[1]?.trim() || s.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause automated demo" : "Auto-play scenarios"}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "border-white/[0.08] bg-[#0E1015] hover:bg-[#151820] text-[#797D86] hover:text-white"
                : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Conduit Stage (Fluid SVG Canvas + Connected Nodes) */}
      <div className="relative p-6 sm:p-10 lg:py-14 overflow-hidden">
        {/* DESKTOP PIPELINE VIEW (lg and up) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center relative min-h-[460px]">
          {/* ========================================================= */}
          {/* LEFT: AUTONOMOUS AGENT FLEET (INGRESS)                    */}
          {/* ========================================================= */}
          <div className="col-span-3 space-y-3 relative z-10">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
                STAGE 1 / INGRESS
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>
                stdio &amp; SSE
              </span>
            </div>

            {/* Agent 1: Cursor */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.sourceAgent === "cursor"
                  ? isDark
                    ? "bg-[#141922] border-blue-500/40 ring-1 ring-blue-500/30 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    : "bg-blue-50/80 border-blue-300 ring-1 ring-blue-200 shadow-md"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/cursor-icon.svg" alt="Cursor" className="size-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    Cursor Composer
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Agent Mode • stdio
                  </div>
                </div>
              </div>
              {scenario.sourceAgent === "cursor" && (
                <span className="size-2 rounded-full bg-blue-400 animate-ping shrink-0" />
              )}
            </div>

            {/* Agent 2: Claude Desktop */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.sourceAgent === "claude"
                  ? isDark
                    ? "bg-[#181315] border-red-500/40 ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                    : "bg-red-50/80 border-red-300 ring-1 ring-red-200 shadow-md"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/claude-icon.svg" alt="Claude" className="size-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    Claude Desktop &amp; CLI
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Anthropic MCP • pipes
                  </div>
                </div>
              </div>
              {scenario.sourceAgent === "claude" && (
                <span className="size-2 rounded-full bg-red-400 animate-ping shrink-0" />
              )}
            </div>

            {/* Agent 3: Windsurf Cascade */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.sourceAgent === "windsurf"
                  ? isDark
                    ? "bg-[#101920] border-cyan-500/40 ring-1 ring-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-cyan-50/80 border-cyan-300 ring-1 ring-cyan-200 shadow-md"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/windsurf-icon.svg" alt="Windsurf" className="size-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    Windsurf Cascade
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Codeium Daemon • stdio
                  </div>
                </div>
              </div>
              {scenario.sourceAgent === "windsurf" && (
                <span className="size-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              )}
            </div>

            {/* Agent 4: Python Daemon */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.sourceAgent === "python"
                  ? isDark
                    ? "bg-[#141922] border-blue-500/40 ring-1 ring-blue-500/30 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    : "bg-blue-50/80 border-blue-300 ring-1 ring-blue-200 shadow-md"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.logo.dev/python.org?token=pk_fdAoKVsxTvadheeQhynG5A&size=64&format=png"
                    alt="Python"
                    className="size-5 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    LangChain / CrewAI
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Autonomous Fleet • SSE
                  </div>
                </div>
              </div>
              {scenario.sourceAgent === "python" && (
                <span className="size-2 rounded-full bg-blue-400 animate-ping shrink-0" />
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER: SEVLEX ZERO-TRUST REACTOR HUB (THE CORE)          */}
          {/* ========================================================= */}
          <div className="col-span-6 relative z-10 flex flex-col items-center justify-center px-4">
            {/* The Outer Orbital Hologram Ring */}
            <div className="relative size-64 sm:size-72 flex items-center justify-center">
              {/* Outer Dashed Rotating Cryptographic Ring */}
              <svg
                className="absolute inset-0 size-full animate-[spin_40s_linear_infinite] pointer-events-none opacity-40"
                viewBox="0 0 280 280"
              >
                <circle
                  cx="140"
                  cy="140"
                  r="132"
                  fill="none"
                  stroke={scenario.outcome === "blocked" ? "#EF4444" : "#34D59A"}
                  strokeWidth="1.5"
                  strokeDasharray="4 8 16 8"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="115"
                  fill="none"
                  stroke={scenario.outcome === "blocked" ? "#EF4444" : "#38BDF8"}
                  strokeWidth="1"
                  strokeDasharray="2 12"
                  opacity="0.5"
                />
              </svg>

              {/* Pulsing Sonar Ring */}
              <div
                className={`absolute inset-6 rounded-full border animate-ping pointer-events-none opacity-20 ${
                  scenario.outcome === "blocked" ? "border-red-500" : "border-[#34D59A]"
                }`}
                style={{ animationDuration: "3s" }}
              />

              {/* The Central Reactor Core Box */}
              <div
                className={`relative z-20 w-52 rounded-2xl border p-4 flex flex-col items-center text-center transition-all duration-300 backdrop-blur-xl ${
                  scenario.outcome === "blocked"
                    ? isDark
                      ? "bg-[#180E10]/90 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30"
                      : "bg-red-50 border-red-400 shadow-xl ring-1 ring-red-300"
                    : isDark
                    ? "bg-[#0A120E]/90 border-[#34D59A]/40 shadow-[0_0_40px_rgba(52,213,154,0.18)] ring-1 ring-[#34D59A]/30"
                    : "bg-emerald-50/90 border-emerald-400 shadow-xl ring-1 ring-emerald-300"
                }`}
              >
                {/* Sevlex Core Brand Shield */}
                <div className="relative mb-2">
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center p-2 border transition-all ${
                      scenario.outcome === "blocked"
                        ? "bg-red-500/20 border-red-500/40 text-red-400"
                        : "bg-[#34D59A]/20 border-[#34D59A]/40 text-[#34D59A]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/sevlex-icon.png" alt="Sevlex" className="size-8 object-contain" />
                  </div>
                  <span
                    className={`absolute -top-1 -right-1 size-3 rounded-full border-2 ${
                      isDark ? "border-[#0A120E]" : "border-white"
                    } ${
                      scenario.outcome === "blocked"
                        ? "bg-red-500 animate-pulse"
                        : "bg-[#34D59A] animate-ping"
                    }`}
                  />
                </div>

                <div className={`text-xs font-mono font-bold tracking-tight uppercase ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                  Sevlex Gateway Reactor
                </div>
                <div className="text-[10px] font-mono text-[#34D59A] mt-0.5 font-medium flex items-center gap-1">
                  <span>AST DPI ENGINE</span>
                  <span>•</span>
                  <span>{scenario.latency}</span>
                </div>

                {/* In-Flight Status Ticker */}
                <div
                  className={`mt-2.5 w-full py-1.5 px-2 rounded-lg border text-[10px] font-mono font-semibold transition-all ${
                    scenario.outcome === "blocked"
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : scenario.outcome === "redacted"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-[#34D59A]/10 border-[#34D59A]/30 text-[#34D59A]"
                  }`}
                >
                  {scenario.outcome === "blocked" && (
                    <span className="flex items-center justify-center gap-1">
                      <ShieldAlert className="size-3 shrink-0" />
                      DDL MUTATION HALTED
                    </span>
                  )}
                  {scenario.outcome === "redacted" && (
                    <span className="flex items-center justify-center gap-1">
                      <Lock className="size-3 shrink-0" />
                      SECRET STRIPPED IN-LINE
                    </span>
                  )}
                  {scenario.outcome === "permitted" && (
                    <span className="flex items-center justify-center gap-1">
                      <ShieldCheck className="size-3 shrink-0" />
                      NON-BLOCKING PASSTHROUGH
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QUARANTINE CHAMBER (When DDL attack is blocked) */}
            <div
              className={`mt-3 w-full max-w-sm rounded-xl border p-2.5 transition-all duration-300 flex items-center justify-between ${
                scenario.outcome === "blocked"
                  ? isDark
                    ? "bg-[#1E0F11] border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2)] animate-pulse"
                    : "bg-red-50 border-red-300 shadow-md"
                  : isDark
                  ? "bg-[#0E1014]/60 border-white/[0.04] text-[#61646B]"
                  : "bg-slate-50/60 border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`size-6 rounded-lg flex items-center justify-center border ${
                    scenario.outcome === "blocked"
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : isDark
                      ? "bg-white/[0.04] border-white/[0.08]"
                      : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <Flame className="size-3.5" />
                </div>
                <div>
                  <div
                    className={`text-[11px] font-mono font-semibold ${
                      scenario.outcome === "blocked"
                        ? "text-red-400"
                        : isDark
                        ? "text-[#AFB1B6]"
                        : "text-slate-600"
                    }`}
                  >
                    Isolation Vault / Quarantine
                  </div>
                  <div className="text-[9px] font-mono opacity-80">
                    {scenario.outcome === "blocked"
                      ? "Arrested 1 payload (0 bytes sent to DB)"
                      : "Zero untracked breaches"}
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  scenario.outcome === "blocked"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : isDark
                    ? "bg-white/[0.04] text-[#797D86]"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                Code -32000
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PROTECTED ENTERPRISE SURFACES (EGRESS)             */}
          {/* ========================================================= */}
          <div className="col-span-3 space-y-3 relative z-10">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-semibold flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-purple-400" />
                STAGE 3 / EGRESS
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>
                Zero DDL Exposure
              </span>
            </div>

            {/* Target 1: PostgreSQL */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.targetSystem === "postgres"
                  ? scenario.outcome === "blocked"
                    ? isDark
                      ? "bg-[#10141A] border-emerald-500/30 ring-1 ring-emerald-500/20"
                      : "bg-emerald-50/70 border-emerald-200"
                    : isDark
                    ? "bg-[#101F18] border-emerald-500/50 ring-1 ring-emerald-500/40 shadow-[0_0_20px_rgba(52,213,154,0.15)]"
                    : "bg-emerald-50 border-emerald-300 shadow-md"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-[#336791]/10 border border-[#336791]/20 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/postgres-icon.png" alt="PostgreSQL" className="size-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    PostgreSQL Production
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Port 5432 • Shielded
                  </div>
                </div>
              </div>

              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ml-1 ${
                  scenario.outcome === "blocked" && scenario.targetSystem === "postgres"
                    ? "bg-emerald-500/10 text-[#34D59A] border border-emerald-500/20"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                }`}
              >
                {scenario.outcome === "blocked" && scenario.targetSystem === "postgres"
                  ? "UNTOUCHED"
                  : "ACTIVE"}
              </span>
            </div>

            {/* Target 2: GitHub */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.targetSystem === "github"
                  ? isDark
                    ? "bg-[#141922] border-blue-500/40 ring-1 ring-blue-500/30"
                    : "bg-blue-50 border-blue-300"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.logo.dev/github.com?token=pk_fdAoKVsxTvadheeQhynG5A&size=64&format=png"
                    alt="GitHub"
                    className="size-5 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    GitHub &amp; CI/CD
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Scoped Branch Access
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 ml-1">
                PROTECTED
              </span>
            </div>

            {/* Target 3: AWS */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.targetSystem === "aws"
                  ? isDark
                    ? "bg-[#17141E] border-cyan-500/40 ring-1 ring-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-cyan-50 border-cyan-300"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-[#FF9900]/10 border border-[#FF9900]/20 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/aws-icon.png" alt="AWS" className="size-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    AWS Infrastructure
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    S3, IAM &amp; Secrets
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 ml-1">
                DLP REDACTED
              </span>
            </div>

            {/* Target 4: Stripe */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                scenario.targetSystem === "stripe"
                  ? isDark
                    ? "bg-[#14121E] border-purple-500/40 ring-1 ring-purple-500/30"
                    : "bg-purple-50 border-purple-300"
                  : isDark
                  ? "bg-[#0E1014]/80 border-white/[0.06] hover:border-white/[0.12] opacity-60"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/20 flex items-center justify-center p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.logo.dev/stripe.com?token=pk_fdAoKVsxTvadheeQhynG5A&size=64&format=png"
                    alt="Stripe"
                    className="size-5 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                    Stripe &amp; Financials
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                    Webhook Token Vault
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 ml-1">
                RATE LIMITED
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* THE SVG INTERACTIVE CONDUIT BEAMS (Connecting Paths)      */}
          {/* ========================================================= */}
          <svg
            className="absolute inset-0 size-full pointer-events-none z-0"
            viewBox="0 0 1000 460"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradient for clean emerald packets */}
              <linearGradient id="beamEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#34D59A" stopOpacity="1" />
                <stop offset="100%" stopColor="#34D59A" stopOpacity="0.2" />
              </linearGradient>

              {/* Gradient for blocked red attack packets */}
              <linearGradient id="beamRed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                <stop offset="60%" stopColor="#EF4444" stopOpacity="1" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0.2" />
              </linearGradient>

              {/* Gradient for DLP cyan packets */}
              <linearGradient id="beamCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="conduitGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Wire Tracks (Subtle ambient conduits) */}
            {/* Left to Center Conduits */}
            <path d="M 240 85 C 380 85, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
            <path d="M 240 165 C 380 165, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
            <path d="M 240 245 C 380 245, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
            <path d="M 240 325 C 380 325, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />

            {/* Center to Right Conduits */}
            <path d="M 500 210 C 640 210, 620 85, 760 85" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
            <path d="M 500 210 C 640 210, 620 165, 760 165" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
            <path d="M 500 210 C 640 210, 620 245, 760 245" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
            <path d="M 500 210 C 640 210, 620 325, 760 325" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />

            {/* Center to Quarantine Conduit (Downwards) */}
            <path d="M 500 280 L 500 375" fill="none" stroke={scenario.outcome === "blocked" ? "rgba(239,68,68,0.4)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" strokeDasharray={scenario.outcome === "blocked" ? "4 4" : undefined} />

            {/* ACTIVE ANIMATED BEAMS BASED ON SCENARIO */}
            {/* Scenario 1: Clean SQL Query (Cursor -> Core -> PostgreSQL) */}
            {scenario.id === "clean" && (
              <>
                {/* Active Ingress Conduit */}
                <path
                  d="M 240 85 C 380 85, 360 210, 500 210"
                  fill="none"
                  stroke="url(#beamEmerald)"
                  strokeWidth="2.5"
                  strokeDasharray="16 280"
                  strokeDashoffset={-packetProgress * 300}
                  filter="url(#conduitGlow)"
                />
                {/* Active Egress Conduit */}
                <path
                  d="M 500 210 C 640 210, 620 85, 760 85"
                  fill="none"
                  stroke="url(#beamEmerald)"
                  strokeWidth="2.5"
                  strokeDasharray="16 280"
                  strokeDashoffset={-packetProgress * 300}
                  filter="url(#conduitGlow)"
                />
              </>
            )}

            {/* Scenario 2: DDL Attack (Claude -> Core -> Diverted to Quarantine, Right side locked!) */}
            {scenario.id === "ddl_attack" && (
              <>
                {/* Dangerous Red Ingress Conduit */}
                <path
                  d="M 240 165 C 380 165, 360 210, 500 210"
                  fill="none"
                  stroke="url(#beamRed)"
                  strokeWidth="3"
                  strokeDasharray="24 280"
                  strokeDashoffset={-packetProgress * 300}
                  filter="url(#conduitGlow)"
                />
                {/* Diverted Beam into Quarantine Vault */}
                <path
                  d="M 500 230 L 500 380"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray="12 12"
                  strokeDashoffset={-packetProgress * 200}
                  filter="url(#conduitGlow)"
                />
              </>
            )}

            {/* Scenario 3: Secret DLP (Windsurf -> Core -> AWS with sanitized output) */}
            {scenario.id === "secret_dlp" && (
              <>
                {/* Ingress with secret */}
                <path
                  d="M 240 245 C 380 245, 360 210, 500 210"
                  fill="none"
                  stroke="url(#beamCyan)"
                  strokeWidth="2.5"
                  strokeDasharray="18 280"
                  strokeDashoffset={-packetProgress * 300}
                  filter="url(#conduitGlow)"
                />
                {/* Egress sanitized to AWS */}
                <path
                  d="M 500 210 C 640 210, 620 245, 760 245"
                  fill="none"
                  stroke="url(#beamCyan)"
                  strokeWidth="2.5"
                  strokeDasharray="18 280"
                  strokeDashoffset={-packetProgress * 300}
                  filter="url(#conduitGlow)"
                />
              </>
            )}
          </svg>
        </div>

        {/* MOBILE & TABLET PIPELINE VIEW (< lg) */}
        <div className="lg:hidden space-y-6">
          {/* Active Ingress Node */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? "bg-[#0E1014] border-white/[0.08]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                STAGE 1 / AGENT INGRESS
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                stdio JSON-RPC
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-2 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    scenario.sourceAgent === "cursor"
                      ? "/cursor-icon.svg"
                      : scenario.sourceAgent === "claude"
                      ? "/claude-icon.svg"
                      : "/windsurf-icon.svg"
                  }
                  alt={scenario.sourceAgent}
                  className="size-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                  {scenario.sourceAgent === "cursor"
                    ? "Cursor Composer"
                    : scenario.sourceAgent === "claude"
                    ? "Claude Desktop & CLI"
                    : "Windsurf Cascade"}
                </div>
                <div className="text-xs font-mono text-emerald-400 truncate">
                  {scenario.payloadTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Animated Connecting Down-Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex flex-col items-center gap-1 text-[#34D59A]">
              <span className="size-1 rounded-full bg-[#34D59A] animate-ping" />
              <div className="w-0.5 h-6 bg-gradient-to-b from-[#34D59A] to-blue-500" />
            </div>
          </div>

          {/* Center Sevlex Reactor Mobile */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              scenario.outcome === "blocked"
                ? isDark
                  ? "bg-[#180E10] border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  : "bg-red-50 border-red-300"
                : isDark
                ? "bg-[#0A120E] border-[#34D59A]/40 shadow-[0_0_30px_rgba(52,213,154,0.15)]"
                : "bg-emerald-50 border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sevlex-icon.png" alt="Sevlex" className="size-5 object-contain" />
                <span className={`text-xs font-mono font-bold ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                  STAGE 2 / SEVLEX AST GATEWAY
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#34D59A] font-semibold">{scenario.latency}</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono mb-3 ${
                scenario.outcome === "blocked"
                  ? "bg-red-500/10 border-red-500/30 text-red-400 font-semibold"
                  : "bg-[#34D59A]/10 border-[#34D59A]/30 text-[#34D59A]"
              }`}
            >
              {scenario.astAnalysis}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className={isDark ? "text-[#797D86]" : "text-slate-500"}>Merkle WAL Seal:</span>
              <span className="text-purple-400 font-semibold truncate max-w-[180px]">{scenario.merkleHash}</span>
            </div>
          </div>

          {/* Animated Connecting Down-Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex flex-col items-center gap-1 text-purple-400">
              <span className="size-1 rounded-full bg-purple-400 animate-ping" />
              <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500" />
            </div>
          </div>

          {/* Active Egress Node */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? "bg-[#0E1014] border-white/[0.08]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                STAGE 3 / PROTECTED EGRESS
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  scenario.outcome === "blocked"
                    ? "bg-emerald-500/10 text-[#34D59A] border border-emerald-500/20"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                }`}
              >
                {scenario.outcome === "blocked" ? "ZERO DDL MUTATION" : "VERIFIED EXECUTED"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#336791]/10 border border-[#336791]/20 flex items-center justify-center p-2 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    scenario.targetSystem === "postgres"
                      ? "/postgres-icon.png"
                      : scenario.targetSystem === "aws"
                      ? "/aws-icon.png"
                      : "https://img.logo.dev/github.com?token=pk_fdAoKVsxTvadheeQhynG5A&size=64&format=png"
                  }
                  alt={scenario.targetSystem}
                  className="size-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                  {scenario.targetSystem === "postgres"
                    ? "PostgreSQL Cluster"
                    : scenario.targetSystem === "aws"
                    ? "AWS Infrastructure & S3"
                    : "GitHub Enterprise"}
                </div>
                <div className={`text-xs font-mono truncate ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                  {scenario.outcome === "blocked"
                    ? "Protected by Sevlex Quarantine Gate"
                    : "Sanitized RPC payload received safely"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM TELEMETRY DOCK: LIVE JSON-RPC INSPECTOR & CRYPTO LEDGER             */}
      {/* ========================================================================= */}
      <div
        className={`px-5 sm:px-8 py-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${
          isDark ? "border-white/[0.06] bg-[#0A0C10]" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 text-[#34D59A] font-semibold shrink-0">
            <Terminal className="size-3.5" />
            <span className="text-[11px] uppercase tracking-wider">In-Flight Inspector:</span>
          </div>
          <div className={`truncate text-[11px] ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
            {scenario.payloadRpc}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className={isDark ? "text-[#797D86]" : "text-slate-400"}>Merkle WAL:</span>
            <span className="text-purple-400 font-semibold">{scenario.merkleHash.split(" ")[0]}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border ${
              scenario.outcome === "blocked"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-[#34D59A]"
            }`}
          >
            <span className="size-1.5 rounded-full bg-current animate-pulse" />
            <span className="font-semibold">{scenario.badge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

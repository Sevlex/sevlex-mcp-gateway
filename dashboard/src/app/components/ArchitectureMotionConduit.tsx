"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Play,
  Pause,
  Terminal,
  Flame,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Scenario {
  id: "clean" | "ddl_attack" | "secret_dlp";
  stepNumber: string;
  name: string;
  badge: string;
  color: string;
  sourceAgent: "cursor" | "claude" | "windsurf" | "python";
  sourceName: string;
  sourceTransport: string;
  targetSystem: "postgres" | "github" | "aws" | "stripe";
  targetName: string;
  payloadTitle: string;
  payloadRpc: string;
  astAnalysis: string;
  outcome: "permitted" | "blocked" | "redacted";
  latency: string;
  merkleHash: string;
  leadHeading: string;
  leadDescription: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "clean",
    stepNumber: "01 / 03",
    name: "Valid Analytical Query",
    badge: "100% Non-Blocking",
    color: "#34D59A",
    sourceAgent: "cursor",
    sourceName: "Cursor Composer",
    sourceTransport: "stdio pipes • JSON-RPC 2.0",
    targetSystem: "postgres",
    targetName: "PostgreSQL Production",
    payloadTitle: 'tools/call: pg_query("SELECT id, email, team_id FROM users LIMIT 25")',
    payloadRpc: '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "pg_query", "arguments": {"sql": "SELECT id, email, team_id FROM users LIMIT 25"}}, "id": 1042}',
    astAnalysis: "AST DPI: Clean AST (SelectStmt). Zero DDL mutations. Schema read-only token verified.",
    outcome: "permitted",
    latency: "0.38ms Wire Time",
    merkleHash: "0x7f4a...8e91",
    leadHeading: "Deterministic in-flight protection, at wire speed.",
    leadDescription: "Transparent stdio & SSE transport wrapping with <0.42ms overhead. Zero proxy daemons or container spinups. Every agent tool call is deconstructed into abstract syntax trees in-flight.",
  },
  {
    id: "ddl_attack",
    stepNumber: "02 / 03",
    name: "DDL Drop Attack Arrested",
    badge: "P0 Mutation Quarantined",
    color: "#EF4444",
    sourceAgent: "claude",
    sourceName: "Claude Desktop & CLI",
    sourceTransport: "Anthropic MCP pipes • JSON-RPC",
    targetSystem: "postgres",
    targetName: "PostgreSQL Production",
    payloadTitle: 'tools/call: pg_query("DROP TABLE users CASCADE; --")',
    payloadRpc: '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "pg_query", "arguments": {"sql": "DROP TABLE users CASCADE; --"}}, "id": 1043}',
    astAnalysis: "AST VIOLATION DETECTED: Destructive DDL node [DropTableStmt]. Policy: DENY_DESTRUCTIVE_DDL.",
    outcome: "blocked",
    latency: "0.29ms (Halted in-flight)",
    merkleHash: "0x9c21...3b04",
    leadHeading: "Rogue mutations arrested before reaching infrastructure.",
    leadDescription: "When an agent hallucinates or suffers prompt injection (DROP TABLE, ALTER, TRUNCATE), Sevlex arrests the payload in-flight and diverts it into quarantine. Zero bytes reach production.",
  },
  {
    id: "secret_dlp",
    stepNumber: "03 / 03",
    name: "Credential Leak Redaction",
    badge: "Secret Stripped In-Line",
    color: "#38BDF8",
    sourceAgent: "windsurf",
    sourceName: "Windsurf Cascade",
    sourceTransport: "Codeium Agent • stdio stream",
    targetSystem: "aws",
    targetName: "AWS Infrastructure & S3",
    payloadTitle: 'tools/call: s3_read_env("AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI...")',
    payloadRpc: '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "s3_read_env", "arguments": {"file": ".env.production"}}, "id": 1044}',
    astAnalysis: "OUTPUT DLP SCAN: High-entropy secret token identified (Shannon entropy: 4.82). AWS Secret Access Key masked.",
    outcome: "redacted",
    latency: "0.41ms Wire Time",
    merkleHash: "0x1d58...ff29",
    leadHeading: "Context isolation without compromising developer velocity.",
    leadDescription: "High-entropy API keys, passwords, and private tokens are dynamically masked to [REDACTED_SEVLEX_DLP] before returning to the model's context window.",
  },
];

export default function ArchitectureMotionConduit() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [packetProgress, setPacketProgress] = useState<number>(0);

  const scenario = SCENARIOS[activeScenarioIdx];

  // Auto-cycle through scenarios when isPlaying is true (6s cycle)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
      setPacketProgress(0);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth micro-animation loop for packet progress (2.4s pulse cycle)
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 2400;

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
    <div className="w-full space-y-6">
      {/* ========================================================================= */}
      {/* CHAPTER HEADER (Styled exactly after contexthint.si frames 4, 6, 8, 10)   */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono font-semibold tracking-widest uppercase transition-colors"
              style={{ color: scenario.color }}
            >
              {scenario.stepNumber}
            </span>
            <span className={`text-xs font-mono ${isDark ? "text-[#61646B]" : "text-slate-400"}`}>
              / Layer 7 Zero-Trust Conduit
            </span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-medium tracking-tight ${
              isDark ? "text-white" : "text-[#0F172A]"
            }`}
          >
            {scenario.leadHeading}
          </h2>
        </div>

        <div className="max-w-md flex flex-col md:items-end gap-3">
          {/* 3-Segment Dash Progress Indicator (Exact contexthint.si signature) */}
          <div className="flex items-center gap-2">
            {SCENARIOS.map((s, idx) => {
              const isActive = activeScenarioIdx === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScenarioIdx(idx);
                    setIsPlaying(false);
                  }}
                  title={s.name}
                  className="group py-1 cursor-pointer"
                >
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-10 sm:w-14"
                        : "w-6 sm:w-8"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? scenario.color
                        : isDark
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(0,0,0,0.12)",
                    }}
                  />
                </button>
              );
            })}

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause automated demo" : "Auto-play scenarios"}
              className={`ml-2 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? "border-white/[0.08] bg-[#0E1015] hover:bg-[#151820] text-[#797D86] hover:text-white"
                  : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
            </button>
          </div>

          <p className={`text-xs sm:text-[13px] leading-relaxed md:text-right ${isDark ? "text-[#797D86]" : "text-[#475569]"}`}>
            {scenario.leadDescription}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE KINETIC CONDUIT STAGE CANVAS (Large Rounded Stage)                     */}
      {/* ========================================================================= */}
      <div
        className={`relative rounded-3xl border transition-all overflow-hidden ${
          isDark
            ? "border-white/[0.08] bg-[#07080A] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            : "border-slate-200/90 bg-white ring-1 ring-slate-900/[0.04] shadow-xl"
        }`}
      >
        {/* Dynamic ambient radial backdrop */}
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

        {/* Subtle coordinate dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: isDark
              ? "radial-gradient(circle, #FFFFFF 1px, transparent 1px)"
              : "radial-gradient(circle, #0F172A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Interior Stage Sub-Bar (Modeled after contexthint Frame 6) */}
        <div
          className={`relative z-10 px-5 sm:px-8 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono ${
            isDark ? "border-white/[0.06] bg-[#0A0C10]/80" : "border-slate-200/80 bg-slate-50/70"
          } backdrop-blur-md`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#38BDF8] font-semibold">STAGE 1: AGENT INGRESS</span>
            <span className={isDark ? "text-[#61646B]" : "text-slate-400"}>(stdio &amp; SSE)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#34D59A] font-semibold">
            <span className="size-1.5 rounded-full bg-[#34D59A] animate-ping" />
            <span>STAGE 2: ZERO-TRUST PROXY REACTOR</span>
            <span className="text-[10px] font-normal opacity-70">&lt; 0.42ms Wire Time</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-semibold">STAGE 3: EGRESS</span>
            <span className={isDark ? "text-[#61646B]" : "text-slate-400"}>(SCOPED TOOLS)</span>
          </div>
        </div>

        {/* Main Pipeline Stage */}
        <div className="relative p-6 sm:p-10 lg:py-14 overflow-hidden">
          {/* DESKTOP VIEW (lg and up) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 items-center relative min-h-[480px]">
            {/* ========================================================= */}
            {/* LEFT WING: COMMAND CARD (Inspired by Frame 6)             */}
            {/* ========================================================= */}
            <div className="col-span-3 space-y-3 relative z-10">
              {/* Primary Active Agent Command Box */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isDark
                    ? "bg-[#0E1015] border-white/[0.12] shadow-lg"
                    : "bg-slate-900 text-white border-slate-800 shadow-xl"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                    Active Client Wire
                  </span>
                  <span className="size-2 rounded-full bg-blue-400 animate-ping" />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center p-2 shrink-0">
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
                    <div className="text-sm font-semibold truncate text-white">
                      {scenario.sourceName}
                    </div>
                    <div className="text-[10px] font-mono truncate text-[#797D86]">
                      {scenario.sourceTransport}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] text-[10px] font-mono space-y-1 text-[#AFB1B6]">
                  <div className="flex justify-between">
                    <span className="text-[#61646B]">Wire Protocol:</span>
                    <span className="text-blue-400 font-semibold">JSON-RPC 2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#61646B]">Security State:</span>
                    <span className="text-[#34D59A] font-semibold">Shielded In-Flight</span>
                  </div>
                </div>
              </div>

              {/* 3 Selectable Agent Node Chips */}
              <div className="space-y-2">
                <div
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    scenario.sourceAgent === "cursor"
                      ? isDark
                        ? "bg-[#141922] border-blue-500/40 text-white"
                        : "bg-blue-50 border-blue-300 text-blue-900"
                      : isDark
                      ? "bg-[#0E1014]/60 border-white/[0.04] opacity-50 hover:opacity-80"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                  onClick={() => {
                    setActiveScenarioIdx(0);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cursor-icon.svg" alt="Cursor" className="size-4 object-contain" />
                    <span className="text-xs font-medium">Cursor Composer</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#34D59A]">stdio</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    scenario.sourceAgent === "claude"
                      ? isDark
                        ? "bg-[#181315] border-red-500/40 text-white"
                        : "bg-red-50 border-red-300 text-red-900"
                      : isDark
                      ? "bg-[#0E1014]/60 border-white/[0.04] opacity-50 hover:opacity-80"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                  onClick={() => {
                    setActiveScenarioIdx(1);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/claude-icon.svg" alt="Claude" className="size-4 object-contain" />
                    <span className="text-xs font-medium">Claude Desktop &amp; CLI</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-400">pipes</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    scenario.sourceAgent === "windsurf"
                      ? isDark
                        ? "bg-[#101920] border-cyan-500/40 text-white"
                        : "bg-cyan-50 border-cyan-300 text-cyan-900"
                      : isDark
                      ? "bg-[#0E1014]/60 border-white/[0.04] opacity-50 hover:opacity-80"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                  onClick={() => {
                    setActiveScenarioIdx(2);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/windsurf-icon.svg" alt="Windsurf" className="size-4 object-contain" />
                    <span className="text-xs font-medium">Windsurf Cascade</span>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400">daemon</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* CENTER WING: ORBITAL REACTOR + RADAR (From Frame 4)       */}
            {/* ========================================================= */}
            <div className="col-span-6 relative z-10 flex flex-col items-center justify-center px-4">
              {/* Orbital Radar System */}
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
                  <circle
                    cx="140"
                    cy="140"
                    r="95"
                    fill="none"
                    stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                    strokeWidth="1"
                  />
                </svg>

                {/* Pulsing Sonar Ring */}
                <div
                  className={`absolute inset-8 rounded-full border animate-ping pointer-events-none opacity-20 ${
                    scenario.outcome === "blocked" ? "border-red-500" : "border-[#34D59A]"
                  }`}
                  style={{ animationDuration: "3s" }}
                />

                {/* Central Reactor Core Box */}
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
                    Sevlex Gateway Core
                  </div>
                  <div className="text-[10px] font-mono text-[#34D59A] mt-0.5 font-medium flex items-center gap-1">
                    <span>AST DPI INSPECTOR</span>
                    <span>•</span>
                    <span>{scenario.latency}</span>
                  </div>

                  {/* Status Ticker Badge */}
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
                        DDL ATTACK ARRESTED
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
                        NON-BLOCKING WIRE PASS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Isolation Vault / Quarantine Chamber (Bottom Cell) */}
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
                        ? "Arrested 1 payload (0 bytes forwarded to DB)"
                        : "Zero untracked mutations"}
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
            {/* RIGHT WING: FLOATING DESTINATION CARDS (From Frame 6)     */}
            {/* ========================================================= */}
            <div className="col-span-3 space-y-2.5 relative z-10">
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

              {/* Target 2: GitHub Enterprise */}
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

              {/* Target 3: AWS Infrastructure */}
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
                      AWS Cloud Infrastructure
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
                  <div className="size-8 rounded-lg bg-[#635BFF]/10 border border-[#635BFF]/20 flex items-center justify-center p-1.5 shrink-0">
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
            {/* SVG TREE BRANCHING BEAMS (Tree Splines like Frame 6)      */}
            {/* ========================================================= */}
            <svg
              className="absolute inset-0 size-full pointer-events-none z-0"
              viewBox="0 0 1000 480"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="treeEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#34D59A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#34D59A" stopOpacity="0.2" />
                </linearGradient>

                <linearGradient id="treeRed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="#EF4444" stopOpacity="1" />
                  <stop offset="100%" stopColor="#991B1B" stopOpacity="0.2" />
                </linearGradient>

                <linearGradient id="treeCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                </linearGradient>

                <filter id="treeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Ambient Branch Splines (Tree Splines) */}
              <path d="M 240 100 C 360 100, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
              <path d="M 240 230 C 360 230, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
              <path d="M 240 280 C 360 280, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
              <path d="M 240 330 C 360 330, 360 210, 500 210" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />

              <path d="M 500 210 C 640 210, 620 95, 760 95" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
              <path d="M 500 210 C 640 210, 620 160, 760 160" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
              <path d="M 500 210 C 640 210, 620 230, 760 230" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />
              <path d="M 500 210 C 640 210, 620 300, 760 300" fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1.5" />

              {/* Vertical branch to quarantine */}
              <path d="M 500 280 L 500 395" fill="none" stroke={scenario.outcome === "blocked" ? "rgba(239,68,68,0.4)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" strokeDasharray={scenario.outcome === "blocked" ? "4 4" : undefined} />

              {/* ACTIVE ANIMATED BEAMS BASED ON SCENARIO */}
              {scenario.id === "clean" && (
                <>
                  <path
                    d="M 240 100 C 360 100, 360 210, 500 210"
                    fill="none"
                    stroke="url(#treeEmerald)"
                    strokeWidth="2.5"
                    strokeDasharray="16 280"
                    strokeDashoffset={-packetProgress * 300}
                    filter="url(#treeGlow)"
                  />
                  <path
                    d="M 500 210 C 640 210, 620 95, 760 95"
                    fill="none"
                    stroke="url(#treeEmerald)"
                    strokeWidth="2.5"
                    strokeDasharray="16 280"
                    strokeDashoffset={-packetProgress * 300}
                    filter="url(#treeGlow)"
                  />
                </>
              )}

              {scenario.id === "ddl_attack" && (
                <>
                  <path
                    d="M 240 280 C 360 280, 360 210, 500 210"
                    fill="none"
                    stroke="url(#treeRed)"
                    strokeWidth="3"
                    strokeDasharray="24 280"
                    strokeDashoffset={-packetProgress * 300}
                    filter="url(#treeGlow)"
                  />
                  <path
                    d="M 500 230 L 500 400"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray="12 12"
                    strokeDashoffset={-packetProgress * 200}
                    filter="url(#treeGlow)"
                  />
                </>
              )}

              {scenario.id === "secret_dlp" && (
                <>
                  <path
                    d="M 240 330 C 360 330, 360 210, 500 210"
                    fill="none"
                    stroke="url(#treeCyan)"
                    strokeWidth="2.5"
                    strokeDasharray="18 280"
                    strokeDashoffset={-packetProgress * 300}
                    filter="url(#treeGlow)"
                  />
                  <path
                    d="M 500 210 C 640 210, 620 230, 760 230"
                    fill="none"
                    stroke="url(#treeCyan)"
                    strokeWidth="2.5"
                    strokeDasharray="18 280"
                    strokeDashoffset={-packetProgress * 300}
                    filter="url(#treeGlow)"
                  />
                </>
              )}
            </svg>
          </div>

          {/* MOBILE PIPELINE VIEW (< lg) */}
          <div className="lg:hidden space-y-6">
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
                  {scenario.sourceTransport}
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
                    {scenario.sourceName}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 truncate">
                    {scenario.payloadTitle}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2">
              <div className="flex flex-col items-center gap-1 text-[#34D59A]">
                <span className="size-1 rounded-full bg-[#34D59A] animate-ping" />
                <div className="w-0.5 h-6 bg-gradient-to-b from-[#34D59A] to-blue-500" />
              </div>
            </div>

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
                <span className="text-purple-400 font-semibold">{scenario.merkleHash}</span>
              </div>
            </div>

            <div className="flex justify-center -my-2">
              <div className="flex flex-col items-center gap-1 text-purple-400">
                <span className="size-1 rounded-full bg-purple-400 animate-ping" />
                <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500" />
              </div>
            </div>

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
                    {scenario.targetName}
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
        {/* BOTTOM TELEMETRY DOCK: LIVE JSON-RPC INSPECTOR                             */}
        {/* ========================================================================= */}
        <div
          className={`px-5 sm:px-8 py-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${
            isDark ? "border-white/[0.06] bg-[#0A0C10]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 text-[#34D59A] font-semibold shrink-0">
              <Terminal className="size-3.5" />
              <span className="text-[11px] uppercase tracking-wider">In-Flight Wire Inspector:</span>
            </div>
            <div className={`truncate text-[11px] ${isDark ? "text-[#C9CBCF]" : "text-slate-700"}`}>
              {scenario.payloadRpc}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={isDark ? "text-[#797D86]" : "text-slate-400"}>Merkle WAL:</span>
              <span className="text-purple-400 font-semibold">{scenario.merkleHash}</span>
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
    </div>
  );
}

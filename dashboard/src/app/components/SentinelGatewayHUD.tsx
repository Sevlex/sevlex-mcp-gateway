"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Shield, ShieldCheck, ShieldAlert, Cpu, Terminal, Database, Server, Zap, CheckCircle2, AlertTriangle, ArrowRight, Activity, Radio, Lock } from "lucide-react";
import ClientBrandIcon from "./ClientBrandIcon";

type SimulationMode = "safe" | "sql_attack" | "credential_leak";

export function SentinelGatewayHUD() {
  const { isDark: ctxDark, theme } = useTheme();
  const isDark = ctxDark ?? (theme === "dark");

  const [mode, setMode] = useState<SimulationMode>("safe");
  const [pulseKey, setPulseKey] = useState(0);
  const [metrics, setMetrics] = useState({
    packetsScanned: 1428940,
    threatsQuarantined: 1842,
    avgLatency: "0.14ms",
    merkleHeight: 894120,
  });

  // Ticking metrics simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        packetsScanned: prev.packetsScanned + Math.floor(Math.random() * 5 + 1),
        threatsQuarantined: mode !== "safe" ? prev.threatsQuarantined + 1 : prev.threatsQuarantined,
        avgLatency: "0.1" + (Math.floor(Math.random() * 4) + 2) + "ms",
        merkleHeight: prev.merkleHeight + 1,
      }));
    }, 2400);
    return () => clearInterval(timer);
  }, [mode]);

  const triggerMode = (newMode: SimulationMode) => {
    setMode(newMode);
    setPulseKey((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      {/* HUD Chassis */}
      <div className={`relative rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-300 shadow-2xl ${
        isDark 
          ? "border-[#20242C] bg-[#0A0C10]/90 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(0,240,255,0.04)]" 
          : "border-slate-300/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
      }`}>
        {/* Top Glowing Laser Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-80" />

        {/* HUD Top Bar / Telemetry Strip */}
        <div className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 text-xs font-mono transition-colors ${
          isDark ? "border-[#1B1E26] bg-[#07090D]/80 text-[#8B909D]" : "border-slate-200 bg-slate-50/90 text-slate-600"
        }`}>
          {/* Status & Core Indicator */}
          <div className="flex items-center gap-3">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-[#00F0FF]" />
            </span>
            <span className={`font-semibold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
              SEVLEX L7 SENTINEL CORE
            </span>
            <span className={isDark ? "text-[#343842]" : "text-slate-300"}>|</span>
            <span className="text-[#34D59A] flex items-center gap-1">
              <Lock className="size-3" />
              ZERO-TRUST ACTIVE
            </span>
          </div>

          {/* Interactive Scenario Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-inherit bg-black/10 dark:bg-black/40">
            <button
              onClick={() => triggerMode("safe")}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mode === "safe"
                  ? isDark 
                    ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]" 
                    : "bg-sky-100 text-sky-800 border border-sky-300 font-semibold"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              ● Safe MCP Read
            </button>
            <button
              onClick={() => triggerMode("sql_attack")}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mode === "sql_attack"
                  ? isDark
                    ? "bg-red-500/15 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "bg-red-100 text-red-800 border border-red-300 font-semibold"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              ▲ Malicious DROP TABLE
            </button>
            <button
              onClick={() => triggerMode("credential_leak")}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mode === "credential_leak"
                  ? isDark
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "bg-amber-100 text-amber-800 border border-amber-300 font-semibold"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              ◆ .env Exfiltration
            </button>
          </div>

          {/* Live Telemetry Readout */}
          <div className="hidden lg:flex items-center gap-5 text-[11px]">
            <div>
              <span className="text-slate-500 mr-1.5">LATENCY:</span>
              <span className="text-[#34D59A] font-bold">{metrics.avgLatency}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5">MERKLE BLOCK:</span>
              <span className={isDark ? "text-white" : "text-slate-800"}>#{metrics.merkleHeight}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5">SCANNED:</span>
              <span className={isDark ? "text-cyan-400" : "text-sky-700"}>{metrics.packetsScanned.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* HUD Interactive Visual Stage (The 3-Zone Flow) */}
        <div className="relative p-6 sm:p-10 min-h-[380px] flex flex-col justify-center">
          {/* Subtle Grid Background inside HUD */}
          <div className={`absolute inset-0 pointer-events-none opacity-20 ${
            isDark
              ? "bg-[linear-gradient(to_right,#20242C_1px,transparent_1px),linear-gradient(to_bottom,#20242C_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
              : "bg-[linear-gradient(to_right,#CBD5E1_1px,transparent_1px),linear-gradient(to_bottom,#CBD5E1_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
          }`} />

          {/* 3-Zone Architecture Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* ZONE 1: AI Coding Agents Influx (Columns 1-3) */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Terminal className="size-3 text-[#00F0FF]" />
                <span>Client MCP Runtimes</span>
              </div>

              {[
                { name: "Cursor IDE", brand: "cursor", desc: "Agent stdio pipe", active: true },
                { name: "Claude Desktop", brand: "claude", desc: "Local JSON-RPC", active: mode === "safe" },
                { name: "Windsurf Cascade", brand: "windsurf", desc: "SSE Transport", active: mode !== "safe" },
              ].map((agent, i) => (
                <div
                  key={agent.name}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    agent.active
                      ? isDark
                        ? "bg-[#10141D] border-[#2C3442] shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                        : "bg-white border-sky-300 shadow-sm"
                      : isDark
                        ? "bg-[#0A0C10]/60 border-[#1B1E26] opacity-60"
                        : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-lg bg-black/40 flex items-center justify-center p-1 border border-white/5">
                      <ClientBrandIcon name={agent.brand} size="xs" className="size-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{agent.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{agent.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`size-1.5 rounded-full ${
                      agent.active ? "bg-[#00F0FF] animate-pulse" : "bg-slate-600"
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* PIPELINE CONNECTOR 1: Streaming packets from Agents to Sentinel */}
            <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center relative h-32">
              <div className="w-full h-[2px] bg-gradient-to-r from-[#00F0FF]/30 to-[#00F0FF] relative overflow-hidden">
                <div className="absolute inset-0 w-8 bg-white blur-[2px] animate-pulse" style={{ animationDuration: "1.2s" }} />
              </div>
              <span className="text-[9px] font-mono text-cyan-400 mt-2 whitespace-nowrap">tools/call</span>
            </div>

            {/* ZONE 2: The Sevlex L7 Sentinel Deep Inspection Core (Columns 5-8) */}
            <div className="md:col-span-4">
              <div className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                mode === "safe"
                  ? isDark 
                    ? "bg-[#0B121A] border-[#1C3647] shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                    : "bg-sky-50/70 border-sky-300 shadow-md"
                  : mode === "sql_attack"
                    ? isDark
                      ? "bg-[#180D10] border-[#4A1E24] shadow-[0_0_30px_rgba(239,68,68,0.18)]"
                      : "bg-red-50/70 border-red-300 shadow-md"
                    : isDark
                      ? "bg-[#19130B] border-[#4A3219] shadow-[0_0_30px_rgba(245,158,11,0.18)]"
                      : "bg-amber-50/70 border-amber-300 shadow-md"
              }`}>
                {/* Holographic Radar Ring in background */}
                <div className="absolute -top-10 -right-10 size-40 rounded-full border border-dashed border-[#00F0FF]/20 animate-spin" style={{ animationDuration: "24s" }} />
                
                {/* Core Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`size-6 rounded-lg flex items-center justify-center ${
                      mode === "safe" 
                        ? "bg-[#34D59A]/20 text-[#34D59A]" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      <Shield className="size-3.5" />
                    </div>
                    <span className={`text-xs font-mono font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                      L7 In-Flight Interceptor
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                    mode === "safe"
                      ? "bg-[#34D59A]/10 text-[#34D59A] border-[#34D59A]/25"
                      : "bg-red-500/10 text-red-400 border-red-500/25"
                  }`}>
                    {mode === "safe" ? "PASSED (200 OK)" : "BLOCKED (403)"}
                  </span>
                </div>

                {/* Packet Payload Inspect Terminal */}
                <div className={`p-3 rounded-xl border font-mono text-[11px] mb-3 transition-colors ${
                  isDark ? "bg-[#06080C] border-[#181C24] text-slate-300" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 border-b border-inherit pb-1">
                    <span>AST SYNTAX TREE INSPECT</span>
                    <span className="text-[#00F0FF]">0.12ms</span>
                  </div>
                  {mode === "safe" && (
                    <div className="space-y-0.5 text-xs text-[#34D59A]">
                      <div>{`> query: "SELECT id, email FROM users LIMIT 10;"`}</div>
                      <div className="text-[10px] text-slate-500">AST: StatementType.SELECT [Read-Only]</div>
                    </div>
                  )}
                  {mode === "sql_attack" && (
                    <div className="space-y-0.5 text-xs text-red-400">
                      <div>{`> query: "DROP TABLE production_users CASCADE;"`}</div>
                      <div className="text-[10px] text-red-500 font-semibold">RULE VIOLATION: BlockDestructiveDDL</div>
                    </div>
                  )}
                  {mode === "credential_leak" && (
                    <div className="space-y-0.5 text-xs text-amber-400">
                      <div>{`> file: "/etc/secrets/.env.production"`}</div>
                      <div className="text-[10px] text-amber-500 font-semibold">DLP QUARANTINE: SecretKeyMatch</div>
                    </div>
                  )}
                </div>

                {/* Merkle Cryptographic Receipt */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-[10px] ${
                  isDark ? "bg-[#070A0F] border-[#192230] text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#00F0FF]" />
                    <span>Merkle Hash:</span>
                  </div>
                  <span className="font-semibold text-cyan-400">
                    {mode === "safe" ? "0x7a8f...94e2" : "0xDEAD...C0DE"}
                  </span>
                </div>
              </div>
            </div>

            {/* PIPELINE CONNECTOR 2: Streaming from Sentinel to Destination */}
            <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center relative h-32">
              <div className={`w-full h-[2px] relative overflow-hidden ${
                mode === "safe" 
                  ? "bg-gradient-to-r from-[#00F0FF] to-[#34D59A]" 
                  : "bg-gradient-to-r from-red-500/80 to-red-500"
              }`}>
                <div className="absolute inset-0 w-8 bg-white blur-[2px] animate-pulse" style={{ animationDuration: "0.9s" }} />
              </div>
              <span className={`text-[9px] font-mono mt-2 whitespace-nowrap font-bold ${
                mode === "safe" ? "text-[#34D59A]" : "text-red-400"
              }`}>
                {mode === "safe" ? "FORWARD" : "DIVERT"}
              </span>
            </div>

            {/* ZONE 3: Destination Infrastructure & Quarantine Vault (Columns 10-12) */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Database className="size-3 text-[#34D59A]" />
                <span>Enterprise Targets</span>
              </div>

              {/* Target 1: Safe Backend */}
              <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                mode === "safe"
                  ? isDark
                    ? "bg-[#0C1510] border-[#1F4A2C] shadow-[0_0_15px_rgba(52,213,154,0.12)] text-white"
                    : "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm"
                  : isDark
                    ? "bg-[#0A0C10]/60 border-[#1B1E26] opacity-50"
                    : "bg-slate-50 border-slate-200 opacity-50"
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20">
                    <Database className="size-4 text-[#34D59A]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Neon Postgres</div>
                    <div className="text-[10px] font-mono text-emerald-500">Live DB Execution</div>
                  </div>
                </div>
                {mode === "safe" && <CheckCircle2 className="size-4 text-[#34D59A]" />}
              </div>

              {/* Target 2: Quarantine Isolation Cell */}
              <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                mode !== "safe"
                  ? isDark
                    ? "bg-[#180B0D] border-[#5E1E26] shadow-[0_0_20px_rgba(239,68,68,0.2)] text-white"
                    : "bg-red-50 border-red-300 text-red-950 shadow-sm"
                  : isDark
                    ? "bg-[#0A0C10]/60 border-[#1B1E26] opacity-40"
                    : "bg-slate-50 border-slate-200 opacity-40"
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-red-500/10 flex items-center justify-center p-1 border border-red-500/20">
                    <ShieldAlert className="size-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Quarantine Vault</div>
                    <div className="text-[10px] font-mono text-red-400">Zero Execution Allowed</div>
                  </div>
                </div>
                {mode !== "safe" && <AlertTriangle className="size-4 text-red-400 animate-pulse" />}
              </div>
            </div>

          </div>
        </div>

        {/* HUD Footer Status Ticker */}
        <div className={`px-6 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
          isDark ? "border-[#1B1E26] bg-[#07090D]/90 text-[#8B909D]" : "border-slate-200 bg-slate-50 text-slate-600"
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#00F0FF] font-semibold">● SEC_AUDIT_LOG:</span>
            <span className="font-mono text-[11px]">
              {mode === "safe" 
                ? "Transaction verified by SHA-256 Merkle block #894120. Zero latency penalty."
                : "Destructive operation intercepted in 0.12ms. Security incident dispatched to SIEM & Slack."}
            </span>
          </div>
          <a
            href="/console"
            className="inline-flex items-center gap-1.5 font-medium text-xs text-[#00F0FF] hover:underline"
          >
            <span>Open Real-Time SecOps Console</span>
            <ArrowRight className="size-3" />
          </a>
        </div>

      </div>
    </div>
  );
}

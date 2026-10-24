"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Radio,
  Code2,
  SlidersHorizontal,
  Box,
  Maximize2,
  ChevronDown,
  Check,
} from "lucide-react";

// The 4 Layers Configuration
type LayerId = "ast" | "circuit" | "dlp" | "merkle";

interface LayerMeta {
  id: LayerId;
  index: string;
  name: string;
  badge: string;
  engine: string;
  latency: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  description: string;
  summary: string;
}

const LAYERS: LayerMeta[] = [
  {
    id: "ast",
    index: "01",
    name: "Parameter AST Syntax DPI",
    badge: "Ingress Perimeter",
    engine: "ToolGuard™ AST DPI",
    latency: "0.38ms",
    accentColor: "#34D59A",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    glowColor: "rgba(52, 213, 154, 0.25)",
    description: "Deep packet inspection for AI tool calls. Parses raw JSON payloads into abstract syntax trees before downstream execution.",
    summary: "Blocks destructive SQL DDL (DROP TABLE), shell escapes, and path traversal in-flight.",
  },
  {
    id: "circuit",
    index: "02",
    name: "Execution Velocity & Circuit Breaker",
    badge: "State & Rate Control",
    engine: "AgentGuard™ Circuit Breaker",
    latency: "0.15ms",
    accentColor: "#F59E0B",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.25)",
    description: "Sliding-window rate limiter & loop terminator. Detects runaway agent spirals and hallucination loops in real-time.",
    summary: "Trips a 429 cooldown if an autonomous agent loops or exceeds 25 tool calls per 30 seconds.",
  },
  {
    id: "dlp",
    index: "03",
    name: "In-Flight Egress Output DLP",
    badge: "Egress Perimeter",
    engine: "Entropy Redaction Laser",
    latency: "0.22ms",
    accentColor: "#A855F7",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
    glowColor: "rgba(168, 85, 247, 0.25)",
    description: "Real-time high-entropy secret scanner. Scrubs sensitive tokens from tool outputs before the LLM can absorb or echo them.",
    summary: "Laser-redacts AWS keys, Stripe secret tokens, database credentials, and GitHub PATs.",
  },
  {
    id: "merkle",
    index: "04",
    name: "Cryptographic Merkle Audit Ledger",
    badge: "Compliance Foundation",
    engine: "Neon PostgreSQL Ledger",
    latency: "0.45ms",
    accentColor: "#38BDF8",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
    glowColor: "rgba(56, 189, 248, 0.25)",
    description: "Immutable compliance foundation. Cryptographically chains every execution receipt mathematically to its predecessor.",
    summary: "Synced directly to Neon PostgreSQL. Mathematical proof for SOC 2 Type II audit readiness.",
  },
];

export default function EngineBentoGrid() {
  const [activeLayer, setActiveLayer] = useState<LayerId>("ast");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"3d" | "flat">("3d");
  const [tilt, setTilt] = useState({ x: 12, y: -6 });

  // Interactive Layer 1 Simulator State
  const [astScenario, setAstScenario] = useState<"safe" | "attack">("attack");

  // Interactive Layer 2 Simulator State
  const [velocity, setVelocity] = useState<number>(14);
  const [isTripped, setIsTripped] = useState<boolean>(false);

  // Interactive Layer 3 Simulator State
  const [dlpSecretType, setDlpSecretType] = useState<"aws" | "stripe" | "github">("aws");
  const [isRedacting, setIsRedacting] = useState<boolean>(true);

  // Interactive Layer 4 Simulator State
  const [isProofVerified, setIsProofVerified] = useState<boolean>(false);
  const [proofLoading, setProofLoading] = useState<boolean>(false);

  // Auto-cycle through layers when autoPlay is enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveLayer((current) => {
        const currentIndex = LAYERS.findIndex((l) => l.id === current);
        const nextIndex = (currentIndex + 1) % LAYERS.length;
        return LAYERS[nextIndex].id;
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle subtle 3D tilt tracking on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== "3d") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12 + 10;
    setTilt({ x: Math.max(0, Math.min(22, rotateX)), y: Math.max(-16, Math.min(16, rotateY)) });
  };

  const handleMouseLeave = () => {
    if (viewMode === "3d") {
      setTilt({ x: 12, y: -6 });
    }
  };

  // Helper to trigger Layer 2 Loop Surge
  const triggerLoopSurge = () => {
    setVelocity(29);
    setIsTripped(true);
  };

  const resetCircuit = () => {
    setVelocity(12);
    setIsTripped(false);
  };

  // Helper to verify Layer 4 Proof
  const handleVerifyProof = () => {
    setProofLoading(true);
    setTimeout(() => {
      setProofLoading(false);
      setIsProofVerified(true);
    }, 600);
  };

  const currentLayerMeta = LAYERS.find((l) => l.id === activeLayer)!;

  return (
    <section id="product" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-purple-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* =======================================================================
          1. HEADER & 5-SECOND CLARITY COPY
          ======================================================================= */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] text-[#34D59A] border border-[#242628] mb-4 shadow-sm">
          <Layers className="size-3.5 text-[#34D59A]" />
          <span>Zero-Trust Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          Four Layers of Zero-Trust Agent Defense
        </h2>
        <p className="mt-4 text-[#94979E] text-base sm:text-lg leading-relaxed">
          Every autonomous tool call traverses four sequential security strata before touching your infrastructure.
          Inspect syntax, halt runaway loops, scrub credentials, and seal immutable cryptographic proofs.
        </p>

        {/* View Controls & Auto-Tour Bar */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-[#0E0E12] border border-[#242628] shadow-lg">
          {/* 3D vs Flat View Toggle */}
          <div className="flex items-center bg-[#14161C] p-0.5 rounded-xl border border-[#1E212B]">
            <button
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "3d"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#94979E] hover:text-white"
              }`}
            >
              <Box className="size-3.5" />
              <span>3D Strata Stack</span>
            </button>
            <button
              onClick={() => setViewMode("flat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "flat"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#94979E] hover:text-white"
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Linear Pipeline</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[#242628]" />

          {/* Auto-Play Tour Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              isAutoPlaying
                ? "bg-emerald-500/10 text-[#34D59A] border-emerald-500/30"
                : "bg-[#14161C] text-[#94979E] border-[#1E212B] hover:text-white"
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="size-3.5 fill-current" />
                <span>Auto-Tour: Active</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>Auto-Tour: Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =======================================================================
          2. THE 4-STRATA EXPERIENCE (3D LAYER STACK + HOLOGRAPHIC TELEMETRY HUD)
          ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* =====================================================================
            LEFT COLUMN: THE 4-LAYER PHYSICAL STRATA STACK (Span 6)
            ===================================================================== */}
        <div
          className="lg:col-span-6 relative perspective-1200"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Packet Flow Banner at Top of Stack */}
          <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0E0F14] border border-[#222530] text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-semibold">Incoming AI Tool Call</span>
            </div>
            <span className="text-[#34D59A] text-[11px] font-semibold">
              Traversing 4 Defense Strata ↓
            </span>
          </div>

          {/* 3D Stack Container */}
          <div
            style={
              viewMode === "3d"
                ? {
                    transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: "preserve-3d",
                    transition: "transform 0.15s ease-out",
                  }
                : undefined
            }
            className="space-y-4 relative"
          >
            {/* Vertical Animated Laser Conduit connecting the layers */}
            <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-400 to-sky-500 opacity-40 pointer-events-none hidden sm:block z-0" />

            {/* Traveling Laser Pulse Node */}
            <div
              className="absolute left-[23px] sm:left-[31px] size-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff] pointer-events-none hidden sm:block z-20 transition-all duration-700 ease-in-out"
              style={{
                top:
                  activeLayer === "ast"
                    ? "14%"
                    : activeLayer === "circuit"
                    ? "38%"
                    : activeLayer === "dlp"
                    ? "62%"
                    : "86%",
                backgroundColor: currentLayerMeta.accentColor,
                boxShadow: `0 0 16px ${currentLayerMeta.accentColor}`,
              }}
            />

            {/* Render 4 Physical Layers */}
            {LAYERS.map((layer, index) => {
              const isActive = activeLayer === layer.id;

              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    setActiveLayer(layer.id);
                    setIsAutoPlaying(false);
                  }}
                  style={{
                    transform:
                      viewMode === "3d"
                        ? isActive
                          ? "translateZ(30px) scale(1.02)"
                          : `translateZ(${index * -8}px)`
                        : undefined,
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border backdrop-blur-xl ${
                    isActive
                      ? `bg-gradient-to-r from-[#141720] via-[#10121A] to-[#0D0E13] ${layer.accentBorder} shadow-[0_20px_50px_rgba(0,0,0,0.8)]`
                      : "bg-[#0C0D12]/90 border-[#1E2028] hover:border-[#2C303E] opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Subtle Accent Glow for Active Layer */}
                  {isActive && (
                    <div
                      className="absolute -inset-px rounded-2xl pointer-events-none opacity-40 blur-sm"
                      style={{ background: layer.glowColor }}
                    />
                  )}

                  <div className="relative z-10 flex items-start gap-4 sm:gap-5">
                    {/* Stratum Index Aperture Ring */}
                    <div
                      className={`size-11 sm:size-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-all ${
                        isActive
                          ? `${layer.accentBg} ${layer.accentBorder} text-white shadow-inner border`
                          : "bg-[#14161F] text-gray-400 border border-[#202330]"
                      }`}
                      style={isActive ? { color: layer.accentColor } : {}}
                    >
                      {layer.index}
                    </div>

                    {/* Stratum Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                            style={{
                              color: layer.accentColor,
                              backgroundColor: `${layer.accentColor}15`,
                              borderColor: `${layer.accentColor}30`,
                            }}
                          >
                            {layer.badge}
                          </span>
                          <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                            {layer.latency}
                          </span>
                        </div>

                        {isActive && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold animate-pulse">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            <span>INSPECTING</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center justify-between">
                        <span>{layer.name}</span>
                        {isActive && (
                          <ArrowRight
                            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                            style={{ color: layer.accentColor }}
                          />
                        )}
                      </h3>

                      <p className="mt-1.5 text-xs text-[#94979E] leading-relaxed line-clamp-2">
                        {layer.summary}
                      </p>

                      {/* Active Stratum Progress Bar (for Auto-Tour) */}
                      {isActive && isAutoPlaying && (
                        <div className="mt-3 h-1 w-full rounded-full bg-[#1A1D27] overflow-hidden">
                          <div
                            className="h-full rounded-full animate-laser-sweep"
                            style={{ backgroundColor: layer.accentColor }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Defense Guarantee Footer */}
          <div className="mt-4 px-4 py-3 rounded-xl bg-[#090A0E] border border-[#1E212B] flex items-center justify-between text-xs text-[#797D86] font-mono">
            <span>Pipeline Throughput: 10,000+ rps</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              100% Ingress Audited
            </span>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: HOLOGRAPHIC SECURITY COCKPIT HUD (Span 6)
            ===================================================================== */}
        <div className="lg:col-span-6 relative">
          <div
            className={`rounded-3xl border bg-[#08090D] p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300 ${currentLayerMeta.accentBorder}`}
          >
            {/* Top Atmospheric Corner Radial */}
            <div
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
              style={{ background: currentLayerMeta.accentColor }}
            />

            {/* Terminal Window Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 mb-6 border-b border-[#1E212B]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-rose-500/80" />
                  <div className="size-2.5 rounded-full bg-amber-500/80" />
                  <div className="size-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-[#202330]" />
                <span className="text-xs font-mono font-medium text-white flex items-center gap-1.5">
                  <Terminal className="size-3.5 text-gray-400" />
                  <span>Telemetry HUD · Layer {currentLayerMeta.index}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#13151D] text-gray-400 border border-[#242838]">
                  {currentLayerMeta.engine}
                </span>
                <span
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border"
                  style={{
                    color: currentLayerMeta.accentColor,
                    backgroundColor: `${currentLayerMeta.accentColor}15`,
                    borderColor: `${currentLayerMeta.accentColor}30`,
                  }}
                >
                  {currentLayerMeta.latency}
                </span>
              </div>
            </div>

            {/* ===================================================================
                HUD CONTENT FOR LAYER 01: AST SYNTAX INTERCEPTOR
                =================================================================== */}
            {activeLayer === "ast" && (
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Live Parameter AST Deconstructor
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Syntactic validation before downstream execution
                    </p>
                  </div>

                  {/* Interactive Attack Simulator Toggle */}
                  <div className="flex items-center bg-[#11131A] p-0.5 rounded-lg border border-[#20232E] text-xs">
                    <button
                      onClick={() => setAstScenario("safe")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                        astScenario === "safe"
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Safe Query
                    </button>
                    <button
                      onClick={() => setAstScenario("attack")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                        astScenario === "attack"
                          ? "bg-rose-500 text-white font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Attack: DROP TABLE
                    </button>
                  </div>
                </div>

                {/* Simulated Payload Inspector */}
                <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E2028] font-mono text-xs">
                  <div className="text-[11px] text-gray-500 mb-1 flex items-center justify-between">
                    <span>Tool Ingress Payload:</span>
                    <span className="text-[#34D59A]">postgres:execute_query</span>
                  </div>
                  <div className="text-gray-200 bg-[#12141C] p-2.5 rounded-lg border border-[#232634]">
                    {astScenario === "safe" ? (
                      <code>{`{"sql": "SELECT id, name FROM production_users LIMIT 5;"}`}</code>
                    ) : (
                      <code>
                        {`{"sql": "`}<span className="text-rose-400 font-bold bg-rose-950/60 px-1 rounded">DROP TABLE production_users;--</span>{`"}`}
                      </code>
                    )}
                  </div>
                </div>

                {/* AST Visual Parse Tree */}
                <div className="p-4 rounded-xl bg-[#08090C] border border-[#1D202A] font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pb-2 border-b border-[#1A1D27]">
                    <span>Abstract Syntax Tree Hierarchy</span>
                    <span className="text-emerald-400 font-semibold">PARSED IN 0.38ms</span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    <div className="text-gray-400 flex items-center gap-2">
                      <span className="text-[#34D59A]">┌──</span>
                      <span className="px-2 py-0.5 rounded bg-[#13151D] text-gray-300">
                        Root: <span className="text-white">ProgramStatement</span>
                      </span>
                    </div>

                    {astScenario === "safe" ? (
                      <>
                        <div className="text-gray-400 flex items-center gap-2 pl-4">
                          <span className="text-[#34D59A]">├──</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                            Node: SelectStatement [READ_ONLY_SAFE]
                          </span>
                        </div>
                        <div className="text-gray-400 flex items-center gap-2 pl-4">
                          <span className="text-[#34D59A]">└──</span>
                          <span className="px-2 py-0.5 rounded bg-[#101218] text-gray-300">
                            TableTarget: &quot;production_users&quot; [FORWARDED]
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-400 flex items-center gap-2 pl-4">
                          <span className="text-rose-400">├──</span>
                          <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-500/50 text-rose-300 font-bold flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-rose-400 animate-pulse" />
                            Node: DropTableStatement [P0_CRITICAL_VIOLATION]
                          </span>
                        </div>
                        <div className="text-gray-400 flex items-center gap-2 pl-4">
                          <span className="text-rose-400">└──</span>
                          <span className="px-2 py-0.5 rounded bg-[#131015] border border-rose-500/30 text-rose-300">
                            Action: <span className="font-bold underline">QUARANTINE_HALT</span> (0 Bytes Forwarded)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Result Bar */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    astScenario === "safe"
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>
                      {astScenario === "safe"
                        ? "Rule P-102 Passed · Executed Safely"
                        : "Rule P-102 Enforced · Malicious Query Arrested"}
                    </span>
                  </div>
                  <span className="font-bold">
                    {astScenario === "safe" ? "STATUS: ALLOWED" : "STATUS: BLOCKED"}
                  </span>
                </div>
              </div>
            )}

            {/* ===================================================================
                HUD CONTENT FOR LAYER 02: VELOCITY & CIRCUIT BREAKER
                =================================================================== */}
            {activeLayer === "circuit" && (
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Agent Loop Velocity & Cooldown Gauge
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Halts autonomous infinite retries & token burn
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isTripped ? (
                      <button
                        onClick={triggerLoopSurge}
                        className="px-2.5 py-1 rounded bg-amber-500 text-black font-mono font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5"
                      >
                        <Zap className="size-3.5 fill-current" />
                        <span>Simulate Loop Surge</span>
                      </button>
                    ) : (
                      <button
                        onClick={resetCircuit}
                        className="px-2.5 py-1 rounded bg-[#181A22] border border-[#2B2F3D] text-gray-300 font-mono text-xs hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Reset Breaker</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Velocity Meter Gauge */}
                <div className="p-4 rounded-xl bg-[#090A0E] border border-[#1E2028] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Sliding Window Rate (30s):</span>
                    <span
                      className={`font-bold text-sm ${
                        isTripped ? "text-rose-400 animate-pulse" : "text-amber-400"
                      }`}
                    >
                      {velocity} / 25 calls max
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full rounded-full bg-[#14161F] p-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTripped
                          ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                          : "bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, (velocity / 25) * 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>0 calls (Idle)</span>
                    <span className="text-amber-400 font-semibold">25 Threshold</span>
                    <span>35 calls (Severe)</span>
                  </div>
                </div>

                {/* Circuit Breaker Status Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${
                    isTripped
                      ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                      : "bg-amber-950/20 border-amber-500/30 text-amber-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      {isTripped ? (
                        <>
                          <AlertTriangle className="size-4 text-rose-400" />
                          <span>CIRCUIT_TRIPPED (429 COOLDOWN)</span>
                        </>
                      ) : (
                        <>
                          <Zap className="size-4 text-amber-400" />
                          <span>CIRCUIT CLOSED (MONITORING VELOCITY)</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {isTripped
                        ? "Runaway agent retry loop arrested before API billing drain."
                        : "Autonomous tool execution rate within safe operating envelope."}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">API Cost Preserved:</span>
                    <span className="text-[#34D59A] font-bold text-sm">
                      {isTripped ? "~$24.80" : "$0.00"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================
                HUD CONTENT FOR LAYER 03: OUTPUT DLP SECRET REDACTION
                =================================================================== */}
            {activeLayer === "dlp" && (
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      In-Flight Secret Redaction Scanner
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Shannon entropy scanner prevents model credential absorption
                    </p>
                  </div>

                  {/* Secret Selector */}
                  <div className="flex items-center bg-[#11131A] p-0.5 rounded-lg border border-[#20232E] text-xs">
                    <button
                      onClick={() => setDlpSecretType("aws")}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                        dlpSecretType === "aws"
                          ? "bg-purple-600 text-white font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      AWS Key
                    </button>
                    <button
                      onClick={() => setDlpSecretType("stripe")}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                        dlpSecretType === "stripe"
                          ? "bg-purple-600 text-white font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Stripe
                    </button>
                    <button
                      onClick={() => setDlpSecretType("github")}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                        dlpSecretType === "github"
                          ? "bg-purple-600 text-white font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      GitHub PAT
                    </button>
                  </div>
                </div>

                {/* Laser Redaction Flow */}
                <div className="space-y-3 font-mono text-xs">
                  {/* Tool Output Ingress (Contains Secret) */}
                  <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#1E2028]">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                      <span>Tool Output Stream (Ingress):</span>
                      <span className="text-rose-400 font-semibold">High Entropy Detected</span>
                    </div>
                    <div className="bg-[#12141C] p-2.5 rounded-lg border border-[#202330] text-gray-300">
                      {dlpSecretType === "aws" && (
                        <span>
                          auth_token: &quot;<span className="text-rose-400 bg-rose-950/50 px-1 rounded">AKIAIOSFODNN7EXAMPLE981</span>&quot;
                        </span>
                      )}
                      {dlpSecretType === "stripe" && (
                        <span>
                          gateway_key: &quot;<span className="text-rose-400 bg-rose-950/50 px-1 rounded">sk_live_51M08f2390a8f82194</span>&quot;
                        </span>
                      )}
                      {dlpSecretType === "github" && (
                        <span>
                          token: &quot;<span className="text-rose-400 bg-rose-950/50 px-1 rounded">ghp_9841fa7812903ab9f012</span>&quot;
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Redaction Laser Beam */}
                  <div className="flex items-center justify-center gap-2 text-purple-400 text-xs py-1">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500" />
                    <Eye className="size-3.5" />
                    <span>Entropy Laser Scanner (Shannon: 4.89 &gt; 3.5)</span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
                  </div>

                  {/* LLM Egress (Redacted) */}
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/40">
                    <div className="flex justify-between text-[11px] text-purple-300 mb-1">
                      <span>LLM Context Window Receives:</span>
                      <span className="text-emerald-400 font-semibold">Clean / Sanitized</span>
                    </div>
                    <div className="bg-[#0C0D14] p-2.5 rounded-lg border border-purple-500/30 text-purple-200 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Lock className="size-3.5 text-purple-400" />
                        <code>[REDACTED_HIGH_ENTROPY_CREDENTIAL]</code>
                      </span>
                      <span className="text-[10px] text-[#34D59A] font-semibold">
                        0 BYTES LEAKED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================
                HUD CONTENT FOR LAYER 04: CRYPTOGRAPHIC MERKLE COMPLIANCE LEDGER
                =================================================================== */}
            {activeLayer === "merkle" && (
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Cryptographic Merkle Hash Chain
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Mathematical proof synced live with Neon PostgreSQL
                    </p>
                  </div>

                  <button
                    onClick={handleVerifyProof}
                    disabled={proofLoading}
                    className="px-2.5 py-1 rounded bg-[#38BDF8] text-black font-mono font-bold text-xs hover:bg-[#7dd3fc] transition-all flex items-center gap-1.5"
                  >
                    {proofLoading ? (
                      <RotateCcw className="size-3.5 animate-spin" />
                    ) : (
                      <FileCheck2 className="size-3.5" />
                    )}
                    <span>{isProofVerified ? "Proof Validated" : "Verify Proof"}</span>
                  </button>
                </div>

                {/* Chained Blocks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  {/* Block 1 */}
                  <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#1E2028] text-center space-y-1">
                    <span className="text-[10px] text-gray-500 block uppercase">Block #142392</span>
                    <span className="text-xs text-gray-300 font-mono block">a9f1...e402</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">✔ Validated</span>
                  </div>

                  {/* Block 2 (Current Sealed) */}
                  <div className="p-3 rounded-xl bg-[#0D131F] border border-[#38BDF8]/50 text-center space-y-1 shadow-md">
                    <span className="text-[10px] text-sky-300 block uppercase font-bold">
                      Block #142393
                    </span>
                    <span className="text-xs text-sky-200 font-mono block font-bold">7c8e...f5a6</span>
                    <span className="text-[10px] text-[#38BDF8] font-semibold">⚡ Current Sealed</span>
                  </div>

                  {/* Block 3 */}
                  <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#1E2028] text-center space-y-1">
                    <span className="text-[10px] text-gray-500 block uppercase">Block #142394</span>
                    <span className="text-xs text-gray-300 font-mono block">e3b0...b855</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">✔ Next Seed</span>
                  </div>
                </div>

                {/* Mathematical Integrity Formula */}
                <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#1E2028] font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Cryptographic Link Formula:</span>
                    <span className="text-sky-400 font-semibold">SHA-256 Chain</span>
                  </div>
                  <div className="bg-[#10121A] p-2.5 rounded-lg border border-[#202330] text-gray-300 text-[11px]">
                    <code>entry_hash = SHA256(prev_hash || agent_id || payload_signature)</code>
                  </div>
                </div>

                {/* Neon DB Proof Banner */}
                <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between text-xs font-mono text-sky-300">
                  <div className="flex items-center gap-2">
                    <Database className="size-4 text-sky-400" />
                    <span>Neon PostgreSQL Lakebase: Synced</span>
                  </div>
                  <span className="font-bold text-white">SOC 2 Type II Certified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =======================================================================
          3. UNIFIED 3-PILLAR DEPLOYMENT DOCK
          ======================================================================= */}
      <div className="mt-14 p-2 rounded-3xl border border-[#242628] bg-[#0E0E12] shadow-xl relative z-10">
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
              Run <code className="text-[#C9CBCF] font-mono bg-[#1E212B] px-1 py-0.5 rounded">npx sevlex init</code> to wrap Cursor, Claude Desktop, and VS Code in local stdio gates. Zero account required.
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
              Sync global allowlists and velocity limits across your organization. Receive instant Slack incident notifications when an agent attempts a malicious action.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-[#1E2028] hover:border-purple-500/30 transition-all group">
            <div className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-semibold mb-2 flex items-center gap-2">
              <Fingerprint className="size-3.5" />
              <span>Where Enterprises Comply</span>
            </div>
            <h4 className="text-base font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
              Mathematical Audit Proofs
            </h4>
            <p className="text-xs text-[#94979E] leading-relaxed">
              Every action is cryptographically sealed into Neon PostgreSQL. Hand auditors mathematical proof that dangerous DDL and raw keys never reached downstream models.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

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
  actionSummary: string;
  tag: string;
}

const LAYERS: LayerMeta[] = [
  {
    id: "ast",
    index: "01",
    name: "Parameter AST Syntax DPI",
    badge: "Ingress Perimeter",
    engine: "ToolGuard™ AST DPI",
    latency: "0.38ms Latency",
    accentColor: "#34D59A",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/40",
    glowColor: "rgba(52, 213, 154, 0.35)",
    description: "Deep packet inspection for AI tool calls. Deconstructs JSON payloads into abstract syntax trees in-flight.",
    actionSummary: "Quarantines DROP TABLE, shell escapes, and path traversal before downstream DB execution.",
    tag: "Rule P-102 Enforced",
  },
  {
    id: "circuit",
    index: "02",
    name: "Execution Velocity & Circuit Breaker",
    badge: "State & Rate Control",
    engine: "AgentGuard™ Breaker",
    latency: "0.15ms Latency",
    accentColor: "#F59E0B",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/40",
    glowColor: "rgba(245, 158, 11, 0.35)",
    description: "Sliding-window velocity limiter & loop terminator. Halts runaway retry spirals and hallucination loops.",
    actionSummary: "Trips a 429 cooldown if an autonomous agent loops or exceeds 25 tool calls per 30 seconds.",
    tag: "Rate Limit 25/30s",
  },
  {
    id: "dlp",
    index: "03",
    name: "In-Flight Egress Output DLP",
    badge: "Egress Perimeter",
    engine: "Entropy Redaction Laser",
    latency: "0.22ms Latency",
    accentColor: "#A855F7",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/40",
    glowColor: "rgba(168, 85, 247, 0.35)",
    description: "Real-time high-entropy secret scanner. Scrubs sensitive tokens from tool outputs before LLM absorption.",
    actionSummary: "Laser-redacts AWS keys, Stripe secret tokens, DB passwords, and GitHub PATs.",
    tag: "Zero Secret Leaks",
  },
  {
    id: "merkle",
    index: "04",
    name: "Cryptographic Merkle Audit Ledger",
    badge: "Compliance Foundation",
    engine: "Neon PostgreSQL Ledger",
    latency: "0.45ms Latency",
    accentColor: "#38BDF8",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/40",
    glowColor: "rgba(56, 189, 248, 0.35)",
    description: "Immutable compliance foundation. Cryptographically chains every execution receipt mathematically to its predecessor.",
    actionSummary: "Synced directly to Neon PostgreSQL. Mathematical proof for SOC 2 Type II audit readiness.",
    tag: "SHA-256 Chained",
  },
];

export default function EngineBentoGrid() {
  const [activeLayer, setActiveLayer] = useState<LayerId>("ast");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [explosion, setExplosion] = useState<number>(75); // Explosion depth in px (30 to 120)
  const [angleMode, setAngleMode] = useState<"iso" | "frontal">("iso");
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // Interactive Layer 1 Simulator
  const [astScenario, setAstScenario] = useState<"safe" | "attack">("attack");

  // Interactive Layer 2 Simulator
  const [velocity, setVelocity] = useState<number>(14);
  const [isTripped, setIsTripped] = useState<boolean>(false);

  // Interactive Layer 3 Simulator
  const [dlpSecretType, setDlpSecretType] = useState<"aws" | "stripe" | "github">("aws");

  // Interactive Layer 4 Simulator
  const [isProofVerified, setIsProofVerified] = useState<boolean>(false);
  const [proofLoading, setProofLoading] = useState<boolean>(false);

  // Auto-cycle through the 4 layers
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveLayer((current) => {
        const idx = LAYERS.findIndex((l) => l.id === current);
        return LAYERS[(idx + 1) % LAYERS.length].id;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Interactive Mouse Tilt over the 3D Stage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseTilt({
      x: -(y / (rect.height / 2)) * 6,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const currentLayer = LAYERS.find((l) => l.id === activeLayer)!;

  // Layer 2 triggers
  const triggerLoopSurge = () => {
    setVelocity(29);
    setIsTripped(true);
  };
  const resetCircuit = () => {
    setVelocity(14);
    setIsTripped(false);
  };

  // Layer 4 proof trigger
  const handleVerifyProof = () => {
    setProofLoading(true);
    setTimeout(() => {
      setProofLoading(false);
      setIsProofVerified(true);
    }, 500);
  };

  return (
    <section id="product" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-purple-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* =======================================================================
          1. HEADER & 5-SECOND CLARITY DIRECTIVE
          ======================================================================= */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#131415] text-[#34D59A] border border-[#242628] mb-4 shadow-sm">
          <Layers className="size-3.5 text-[#34D59A]" />
          <span>Exploded 3D Defense Assembly</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          Four Layers of Zero-Trust Agent Defense
        </h2>
        <p className="mt-4 text-[#94979E] text-base sm:text-lg leading-relaxed">
          Every autonomous tool call traverses four sequential physical security strata before touching your database or APIs.
          Inspect syntax, halt runaway loops, scrub credentials, and seal cryptographic proofs.
        </p>

        {/* 3D Exploded Controls Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 p-2 rounded-2xl bg-[#0E0E12]/90 border border-[#242628] backdrop-blur-md shadow-2xl">
          {/* Explosion Depth Presets */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14161F] border border-[#1E212B] text-xs font-mono text-gray-300">
            <span className="text-gray-500 mr-1 hidden sm:inline">Explode:</span>
            <button
              onClick={() => setExplosion(40)}
              className={`px-2 py-0.5 rounded transition-all ${
                explosion === 40 ? "bg-[#2563EB] text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setExplosion(75)}
              className={`px-2 py-0.5 rounded transition-all ${
                explosion === 75 ? "bg-[#2563EB] text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Optimal (75px)
            </button>
            <button
              onClick={() => setExplosion(110)}
              className={`px-2 py-0.5 rounded transition-all ${
                explosion === 110 ? "bg-[#2563EB] text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Full Blueprint
            </button>
          </div>

          {/* Perspective Angle Switch */}
          <div className="flex items-center gap-1 bg-[#14161F] p-1 rounded-xl border border-[#1E212B] text-xs font-mono">
            <button
              onClick={() => setAngleMode("iso")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                angleMode === "iso" ? "bg-[#2563EB] text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              <Box className="size-3.5" />
              <span>Isometric 3D</span>
            </button>
            <button
              onClick={() => setAngleMode("frontal")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                angleMode === "frontal" ? "bg-[#2563EB] text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Frontal Strata</span>
            </button>
          </div>

          {/* Auto-Cycle Tour Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              isAutoPlaying
                ? "bg-emerald-500/10 text-[#34D59A] border-emerald-500/30"
                : "bg-[#14161F] text-gray-400 border-[#1E212B] hover:text-white"
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="size-3.5 fill-current" />
                <span>Auto-Tour: On</span>
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
          2. CENTER-STAGE EXPLODED 3D GLASS STACK APPARATUS
          ======================================================================= */}
      <div
        className="relative w-full rounded-3xl border border-[#222530] bg-gradient-to-b from-[#0A0B10] via-[#08090D] to-[#050608] shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Ingress Packet Flow Banner */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#1A1D27] bg-[#0A0C12]/80 backdrop-blur-md text-xs font-mono text-gray-400 z-20 relative">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
            </span>
            <span className="text-white font-semibold">Incoming AI Tool Call Packet</span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="text-emerald-400 hidden sm:inline">postgres:execute_query</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#34D59A] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Traversing 4 Strata ↓
            </span>
            <span className="text-gray-500 text-[11px] hidden md:inline">
              Click any stratum to isolate & test
            </span>
          </div>
        </div>

        {/* 3D Isometric Viewport Canvas */}
        <div className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center py-16 px-4 perspective-1400 overflow-hidden">
          {/* Subtle Grid Plane at Foundation */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #242938 1px, transparent 1px), linear-gradient(to bottom, #242938 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              transform:
                angleMode === "iso"
                  ? "perspective(1000px) rotateX(60deg) translateY(240px)"
                  : "perspective(1000px) rotateX(40deg) translateY(240px)",
            }}
          />

          {/* Central Vertical Pulsing Laser Beam / Conduit */}
          <div
            className="absolute w-1 top-8 bottom-12 rounded-full pointer-events-none z-10 animate-central-beam"
            style={{
              background: `linear-gradient(to bottom, #34D59A 0%, #F59E0B 35%, #A855F7 65%, #38BDF8 100%)`,
              boxShadow: `0 0 24px rgba(52, 213, 154, 0.4), 0 0 40px rgba(56, 189, 248, 0.3)`,
            }}
          />

          {/* Traveling Glowing Packet Node dropping through the central laser */}
          <div
            className="absolute size-4 rounded-full bg-white shadow-[0_0_20px_#ffffff] z-30 pointer-events-none transition-all duration-700 ease-in-out hidden sm:block"
            style={{
              top:
                activeLayer === "ast"
                  ? "18%"
                  : activeLayer === "circuit"
                  ? "40%"
                  : activeLayer === "dlp"
                  ? "62%"
                  : "84%",
              backgroundColor: currentLayer.accentColor,
              boxShadow: `0 0 28px ${currentLayer.accentColor}, 0 0 10px #ffffff`,
            }}
          />

          {/* Left Side Floating HUD Callout Cards (Hairline Telemetry Pins) */}
          <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 space-y-6 z-20 hidden lg:block max-w-[240px] pointer-events-none">
            {/* Callout 1 (AST) */}
            <div
              className={`p-3.5 rounded-2xl bg-[#0D0F16]/90 border backdrop-blur-xl transition-all duration-300 shadow-xl pointer-events-auto ${
                activeLayer === "ast"
                  ? "border-emerald-500/60 shadow-[0_0_25px_rgba(52,213,154,0.2)] translate-x-2"
                  : "border-[#1F222E] opacity-60 hover:opacity-100"
              }`}
              onClick={() => {
                setActiveLayer("ast");
                setIsAutoPlaying(false);
              }}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold mb-1">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span>STRATUM 01 · INGRESS</span>
              </div>
              <h4 className="text-xs font-semibold text-white">AST Syntax DPI</h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Deconstructs SQL & shell calls into syntax trees before execution.
              </p>
            </div>

            {/* Callout 2 (Circuit Breaker) */}
            <div
              className={`p-3.5 rounded-2xl bg-[#0D0F16]/90 border backdrop-blur-xl transition-all duration-300 shadow-xl pointer-events-auto ${
                activeLayer === "circuit"
                  ? "border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.2)] translate-x-2"
                  : "border-[#1F222E] opacity-60 hover:opacity-100"
              }`}
              onClick={() => {
                setActiveLayer("circuit");
                setIsAutoPlaying(false);
              }}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 font-bold mb-1">
                <span className="size-2 rounded-full bg-amber-400" />
                <span>STRATUM 02 · VELOCITY</span>
              </div>
              <h4 className="text-xs font-semibold text-white">AgentGuard™ Breaker</h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Trips 429 cooldowns when models spiral into infinite loop retries.
              </p>
            </div>
          </div>

          {/* Right Side Floating HUD Callout Cards (Hairline Telemetry Pins) */}
          <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 space-y-6 z-20 hidden lg:block max-w-[240px] pointer-events-none text-right">
            {/* Callout 3 (DLP) */}
            <div
              className={`p-3.5 rounded-2xl bg-[#0D0F16]/90 border backdrop-blur-xl transition-all duration-300 shadow-xl pointer-events-auto text-left ${
                activeLayer === "dlp"
                  ? "border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.2)] -translate-x-2"
                  : "border-[#1F222E] opacity-60 hover:opacity-100"
              }`}
              onClick={() => {
                setActiveLayer("dlp");
                setIsAutoPlaying(false);
              }}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400 font-bold mb-1">
                <span className="size-2 rounded-full bg-purple-400" />
                <span>STRATUM 03 · EGRESS</span>
              </div>
              <h4 className="text-xs font-semibold text-white">Output Secret DLP</h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Laser-redacts AWS & Stripe tokens before LLM context absorption.
              </p>
            </div>

            {/* Callout 4 (Merkle Ledger) */}
            <div
              className={`p-3.5 rounded-2xl bg-[#0D0F16]/90 border backdrop-blur-xl transition-all duration-300 shadow-xl pointer-events-auto text-left ${
                activeLayer === "merkle"
                  ? "border-sky-500/60 shadow-[0_0_25px_rgba(56,189,248,0.2)] -translate-x-2"
                  : "border-[#1F222E] opacity-60 hover:opacity-100"
              }`}
              onClick={() => {
                setActiveLayer("merkle");
                setIsAutoPlaying(false);
              }}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-sky-400 font-bold mb-1">
                <span className="size-2 rounded-full bg-sky-400" />
                <span>STRATUM 04 · FOUNDATION</span>
              </div>
              <h4 className="text-xs font-semibold text-white">Merkle Audit Ledger</h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Cryptographically seals receipts with SHA-256 into Neon PostgreSQL.
              </p>
            </div>
          </div>

          {/* THE 4 ISOMETRIC FLOATING GLASS PLATES (CENTER ASSEMBLY) */}
          <div
            className="transform-style-3d relative flex flex-col items-center justify-center transition-transform duration-300"
            style={{
              transform:
                angleMode === "iso"
                  ? `perspective(1400px) rotateX(${52 + mouseTilt.x}deg) rotateZ(${-30 + mouseTilt.y}deg)`
                  : `perspective(1400px) rotateX(${22 + mouseTilt.x}deg) rotateZ(${-8 + mouseTilt.y}deg)`,
            }}
          >
            {LAYERS.map((layer, index) => {
              const isActive = activeLayer === layer.id;
              // Stacking offsets along Z and Y axes based on explosion factor
              const zOffset = (3 - index) * explosion;
              const yOffset = (index - 1.5) * (explosion * 0.45);

              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    setActiveLayer(layer.id);
                    setIsAutoPlaying(false);
                  }}
                  style={{
                    transform: `translate3d(0px, ${yOffset}px, ${zOffset + (isActive ? 32 : 0)}px)`,
                    transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
                  }}
                  className={`group relative cursor-pointer w-[340px] sm:w-[540px] md:w-[640px] h-[105px] sm:h-[125px] rounded-2xl p-4 sm:p-5 backdrop-blur-xl border transition-all select-none ${
                    isActive
                      ? `bg-[#0F121C]/95 ${layer.accentBorder} shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_25px_60px_rgba(0,0,0,0.95)]`
                      : "bg-[#090A10]/85 border-white/10 hover:border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.8)] opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Active Layer Glowing Halo Rim */}
                  {isActive && (
                    <div
                      className="absolute -inset-1 rounded-2xl pointer-events-none opacity-40 blur-md"
                      style={{ background: layer.glowColor }}
                    />
                  )}

                  {/* Glass Specular Top Highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                  {/* Stratum Content Grid */}
                  <div className="relative z-10 flex items-center justify-between h-full">
                    {/* Left Details */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Stratum Index Disc */}
                      <div
                        className={`size-10 sm:size-11 rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm border shadow-inner transition-all ${
                          isActive
                            ? `${layer.accentBg} ${layer.accentBorder} text-white`
                            : "bg-[#13151D] border-[#202330] text-gray-400"
                        }`}
                        style={isActive ? { color: layer.accentColor } : {}}
                      >
                        {layer.index}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
                            style={{
                              color: layer.accentColor,
                              backgroundColor: `${layer.accentColor}15`,
                              borderColor: `${layer.accentColor}30`,
                            }}
                          >
                            {layer.badge}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
                            {layer.latency}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                          {layer.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {layer.actionSummary}
                        </p>
                      </div>
                    </div>

                    {/* Central Aperture Ring Cutout on the Plate */}
                    <div className="relative flex items-center justify-center size-10 sm:size-12 shrink-0">
                      <div
                        className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin transition-all ${
                          isActive ? "border-current opacity-80" : "border-gray-600 opacity-30"
                        }`}
                        style={{
                          animationDuration: "12s",
                          color: layer.accentColor,
                        }}
                      />
                      <div
                        className="size-3 rounded-full shadow-inner"
                        style={{
                          backgroundColor: isActive ? layer.accentColor : "#252836",
                          boxShadow: isActive ? `0 0 10px ${layer.accentColor}` : "none",
                        }}
                      />
                    </div>

                    {/* Right Live Status Badge */}
                    <div className="text-right hidden sm:block shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
                          isActive
                            ? "bg-white/10 text-white border-white/20"
                            : "bg-[#10121A] text-gray-500 border-[#1E202C]"
                        }`}
                      >
                        {isActive && <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        <span>{layer.tag}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            3. INTERACTIVE COCKPIT TELEMETRY BAR (SYNCED WITH ACTIVE STRATUM)
            ===================================================================== */}
        <div className="border-t border-[#1E212B] bg-[#07080C] p-6 sm:p-7 relative z-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Active Stratum Information */}
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                  Active Stratum {currentLayer.index}:
                </span>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
                  style={{
                    color: currentLayer.accentColor,
                    backgroundColor: `${currentLayer.accentColor}15`,
                    borderColor: `${currentLayer.accentColor}30`,
                  }}
                >
                  {currentLayer.engine}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white tracking-tight">
                {currentLayer.name}
              </h4>
              <p className="text-xs text-[#94979E] mt-1 leading-relaxed">
                {currentLayer.description}
              </p>
            </div>

            {/* Live Interactive Simulator Controls for the Selected Stratum */}
            <div className="flex-1 max-w-xl bg-[#0C0E14] border border-[#1E202B] rounded-2xl p-4 font-mono text-xs shadow-inner">
              {/* LAYER 01 SIMULATOR */}
              {activeLayer === "ast" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Terminal className="size-3.5 text-emerald-400" />
                      <span>AST Syntax Parser Test:</span>
                    </span>
                    <div className="flex items-center bg-[#14161F] p-0.5 rounded-lg border border-[#232736]">
                      <button
                        onClick={() => setAstScenario("safe")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                          astScenario === "safe"
                            ? "bg-emerald-500 text-black font-bold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Safe SELECT
                      </button>
                      <button
                        onClick={() => setAstScenario("attack")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                          astScenario === "attack"
                            ? "bg-rose-500 text-white font-bold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Attack: DROP TABLE
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#11131C] border border-[#202330] text-gray-300 text-[11px] flex items-center justify-between">
                    {astScenario === "safe" ? (
                      <code>SELECT id, email FROM users WHERE active = true;</code>
                    ) : (
                      <code>
                        <span className="text-rose-400 font-bold">DROP TABLE production_users;--</span>
                      </code>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        astScenario === "safe"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {astScenario === "safe" ? "ALLOWED (0.38ms)" : "QUARANTINED (0 BYTES FORWARDED)"}
                    </span>
                  </div>
                </div>
              )}

              {/* LAYER 02 SIMULATOR */}
              {activeLayer === "circuit" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Zap className="size-3.5 text-amber-400" />
                      <span>Velocity Limiter (30s Window):</span>
                    </span>
                    {!isTripped ? (
                      <button
                        onClick={triggerLoopSurge}
                        className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-all flex items-center gap-1"
                      >
                        <Zap className="size-3 fill-current" />
                        <span>Simulate Loop Surge</span>
                      </button>
                    ) : (
                      <button
                        onClick={resetCircuit}
                        className="px-2.5 py-1 rounded bg-[#181A22] border border-[#2B2F3D] text-gray-300 text-[11px] hover:text-white transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="size-3" />
                        <span>Reset Breaker</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Velocity: {velocity} / 25 calls</span>
                      <span className={isTripped ? "text-rose-400 font-bold" : "text-amber-400 font-semibold"}>
                        {isTripped ? "CIRCUIT_TRIPPED (429 COOLDOWN)" : "NOMINAL VELOCITY"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#181B26] overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTripped
                            ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                            : "bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500"
                        }`}
                        style={{ width: `${Math.min(100, (velocity / 25) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* LAYER 03 SIMULATOR */}
              {activeLayer === "dlp" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Eye className="size-3.5 text-purple-400" />
                      <span>Output Secret Redactor:</span>
                    </span>
                    <div className="flex items-center bg-[#14161F] p-0.5 rounded-lg border border-[#232736]">
                      <button
                        onClick={() => setDlpSecretType("aws")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                          dlpSecretType === "aws" ? "bg-purple-600 text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        AWS Key
                      </button>
                      <button
                        onClick={() => setDlpSecretType("stripe")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                          dlpSecretType === "stripe" ? "bg-purple-600 text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Stripe
                      </button>
                      <button
                        onClick={() => setDlpSecretType("github")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                          dlpSecretType === "github" ? "bg-purple-600 text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        GitHub PAT
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#11131C] border border-[#202330] text-[11px] flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Lock className="size-3 text-purple-400" />
                      <code className="text-purple-300 font-semibold">[REDACTED_HIGH_ENTROPY_KEY]</code>
                    </span>
                    <span className="text-emerald-400 font-semibold text-[10px]">
                      SHANNON: 4.89 (0 LEAKS)
                    </span>
                  </div>
                </div>
              )}

              {/* LAYER 04 SIMULATOR */}
              {activeLayer === "merkle" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Database className="size-3.5 text-sky-400" />
                      <span>Neon PostgreSQL Merkle Root:</span>
                    </span>
                    <button
                      onClick={handleVerifyProof}
                      disabled={proofLoading}
                      className="px-2.5 py-1 rounded bg-[#38BDF8] text-black font-bold text-[11px] hover:bg-[#7dd3fc] transition-all flex items-center gap-1"
                    >
                      {proofLoading ? <RotateCcw className="size-3 animate-spin" /> : <FileCheck2 className="size-3" />}
                      <span>{isProofVerified ? "Proof Verified" : "Verify Proof"}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#11131C] border border-[#202330] text-[11px] flex items-center justify-between">
                    <span className="text-gray-300 font-mono">
                      Block #142393: <code className="text-sky-300">7c8e...f5a6</code>
                    </span>
                    <span className="text-emerald-400 font-semibold text-[10px]">
                      ✔ SHA-256 PROOF VALIDATED
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================================
          4. UNIFIED 3-PILLAR DEPLOYMENT DOCK
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
              Sync global allowlists and velocity limits across your organization. Receive instant Slack incident alerts the second an agent attempts an unauthorized action.
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

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
  Layers,
  CheckCircle2,
  Fingerprint,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface LayerItem {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  badge: string;
  latency: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  icon: React.ElementType;
  whatItDoes: string;
  exampleIn: string;
  exampleOut: string;
  outcomeBadge: string;
}

const LAYERS: LayerItem[] = [
  {
    id: "ast",
    step: "01",
    title: "Parameter AST Syntax Inspection",
    subtitle: "ToolGuard™ DPI Engine",
    badge: "Ingress Gate",
    latency: "0.38ms",
    accentColor: "#34D59A",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    icon: ShieldCheck,
    whatItDoes: "Deconstructs tool call arguments into abstract syntax trees before downstream execution. Stops SQL DDL drops, shell escapes, and path traversal in-flight.",
    exampleIn: `postgres:execute_query({"sql": "DROP TABLE production_users;--"})`,
    exampleOut: `[P0_CRITICAL_QUARANTINE] DDL modification arrested. 0 bytes forwarded to DB.`,
    outcomeBadge: "BLOCKED & QUARANTINED",
  },
  {
    id: "circuit",
    step: "02",
    title: "Execution Velocity & Circuit Breaker",
    subtitle: "AgentGuard™ Loop Terminator",
    badge: "State & Rate Control",
    latency: "0.15ms",
    accentColor: "#F59E0B",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    icon: Zap,
    whatItDoes: "Monitors tool call frequency across sliding windows. Trips an immediate 429 cooldown if an autonomous agent enters an infinite retry loop or exceeds 25 calls / 30s.",
    exampleIn: `Autonomous Agent: 28 calls / 30 seconds (Exceeded 25-call ceiling)`,
    exampleOut: `[CIRCUIT_TRIPPED] 429 Cooldown enforced. Runaway billing halted. Saved ~$18.40.`,
    outcomeBadge: "LOOP TERMINATED",
  },
  {
    id: "dlp",
    step: "03",
    title: "In-Flight Output Secret DLP",
    subtitle: "Entropy Redaction Laser",
    badge: "Egress Perimeter",
    latency: "0.22ms",
    accentColor: "#A855F7",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
    icon: Eye,
    whatItDoes: "Scans all tool output streams with real-time Shannon entropy analysis. Scrubs AWS keys, Stripe tokens, database passwords, and GitHub PATs before the LLM can absorb them.",
    exampleIn: `Tool Output: auth_token="AKIAIOSFODNN7EXAMPLE981"`,
    exampleOut: `LLM Receives: auth_token="[REDACTED_AWS_SECRET_KEY]" (0 secrets leaked)`,
    outcomeBadge: "CREDENTIAL REDACTED",
  },
  {
    id: "merkle",
    step: "04",
    title: "Cryptographic Merkle Audit Ledger",
    subtitle: "Neon PostgreSQL Ledger",
    badge: "Compliance Foundation",
    latency: "0.45ms",
    accentColor: "#38BDF8",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
    icon: Database,
    whatItDoes: "Cryptographically links every execution receipt via SHA-256 to its predecessor and commits it to Neon PostgreSQL. Provides mathematical proof for security and compliance audits.",
    exampleIn: `entry_hash = SHA256(prev_hash || block_payload || signature)`,
    exampleOut: `Block #142393 sealed. Neon PostgreSQL synced. Tampering mathematically impossible.`,
    outcomeBadge: "SEALED & IMMUTABLE",
  },
];

export default function EngineBentoGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedLayer, setExpandedLayer] = useState<string>("ast");

  return (
    <section id="product" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Background Ambient Radial */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-purple-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* =======================================================================
          1. HEADER (SIMPLE, DIRECT, NO JARGON)
          ======================================================================= */}
      <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4 shadow-sm ${
          isDark
            ? "bg-[#131415] text-[#34D59A] border border-[#242628]"
            : "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
        }`}>
          <Layers className="size-3.5 text-[#34D59A]" />
          <span>Four Layers of Defense</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-semibold tracking-tight ${
          isDark ? "text-white" : "text-[#0F172A]"
        }`}>
          How Sevlex Protects Your Infrastructure
        </h2>
        <p className={`mt-3 text-base leading-relaxed ${
          isDark ? "text-[#94979E]" : "text-[#475569]"
        }`}>
          Every autonomous tool call passes through four sequential security layers before touching your database or external APIs.
        </p>
      </div>

      {/* =======================================================================
          2. THE 4 LAYERS (CLEAN, BEAUTIFUL, VERTICAL STACK)
          ======================================================================= */}
      <div className="relative z-10 space-y-3">
        {/* Top Ingress Banner */}
        <div className={`flex items-center justify-between px-5 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
          isDark
            ? "bg-[#0F1015] border-[#20222B] text-gray-400"
            : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] text-slate-600 shadow-xs"
        }`}>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`font-medium ${isDark ? "text-white" : "text-[#0F172A]"}`}>Incoming AI Tool Call</span>
            <span className="text-gray-400 hidden sm:inline">→</span>
            <span className="hidden sm:inline">Cursor / Claude / LangChain</span>
          </div>
          <span className="text-[#34D59A] text-[11px] font-semibold">
            Passes Layer 01 to 04 ↓
          </span>
        </div>

        {/* 4 Sequential Layers */}
        <div className="space-y-3">
          {LAYERS.map((layer) => {
            const isExpanded = expandedLayer === layer.id;
            const Icon = layer.icon;

            return (
              <div
                key={layer.id}
                onClick={() => setExpandedLayer(isExpanded ? "" : layer.id)}
                className={`cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? isDark
                      ? `bg-[#0E1017] ${layer.accentBorder} shadow-lg shadow-black/40`
                      : `bg-white border-slate-300/90 ring-1 ring-slate-900/[0.08] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)]`
                    : isDark
                    ? "bg-[#0B0C10] border-[#1C1E26] hover:border-[#2C2E3B] hover:bg-[#0D0E13]"
                    : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] hover:shadow-md transition-all shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
                }`}
              >
                {/* Main Layer Header Row */}
                <div className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Step Number Disc */}
                    <div
                      className={`size-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border transition-colors ${
                        isExpanded
                          ? `${layer.accentBg} ${layer.accentBorder} text-white`
                          : isDark
                          ? "bg-[#14151D] border-[#222430] text-gray-400"
                          : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                      style={isExpanded ? { color: layer.accentColor } : {}}
                    >
                      {layer.step}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
                          style={{
                            color: layer.accentColor,
                            backgroundColor: `${layer.accentColor}15`,
                            borderColor: `${layer.accentColor}30`,
                          }}
                        >
                          {layer.badge}
                        </span>
                        <span className={`text-xs font-mono ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          {layer.latency}
                        </span>
                      </div>

                      <h3 className={`text-base sm:text-lg font-semibold tracking-tight ${
                        isDark ? "text-white" : "text-[#0F172A]"
                      }`}>
                        {layer.title}
                      </h3>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${
                        isDark ? "text-[#94979E]" : "text-[#475569]"
                      }`}>
                        {layer.whatItDoes}
                      </p>
                    </div>
                  </div>

                  {/* Right Status Badge & Accordion Toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-[11px] font-mono px-2.5 py-1 rounded-full border hidden md:inline-flex items-center gap-1.5"
                      style={{
                        color: layer.accentColor,
                        backgroundColor: `${layer.accentColor}10`,
                        borderColor: `${layer.accentColor}25`,
                      }}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: layer.accentColor }}
                      />
                      <span>{layer.subtitle}</span>
                    </span>

                    <div
                      className={`size-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-white" : ""
                      }`}
                    >
                      <ChevronDown className="size-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Live Example */}
                {isExpanded && (
                  <div className={`px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t mt-2 transition-colors ${
                    isDark ? "border-[#181A22]" : "border-slate-100"
                  }`}>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                      {/* What It Intercepts */}
                      <div className={`p-3.5 rounded-xl border space-y-1.5 transition-colors ${
                        isDark ? "bg-[#08090D] border-[#1A1C24]" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className={`text-[11px] font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                          What Enters Layer {layer.step}:
                        </div>
                        <div className={`p-2.5 rounded-lg border break-all leading-relaxed transition-colors ${
                          isDark ? "text-gray-300 bg-[#0F1118] border-[#1E202B]" : "text-slate-800 bg-white border-slate-200"
                        }`}>
                          {layer.exampleIn}
                        </div>
                      </div>

                      {/* What Sevlex Enforces */}
                      <div className={`p-3.5 rounded-xl border space-y-1.5 transition-colors ${
                        isDark ? "bg-[#08090D] border-[#1A1C24]" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>What Sevlex Enforces:</span>
                          <span
                            className="font-bold text-[10px] px-1.5 py-0.2 rounded"
                            style={{ color: layer.accentColor }}
                          >
                            {layer.outcomeBadge}
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-lg border break-all leading-relaxed transition-colors ${
                          isDark ? "text-gray-200 bg-[#0F1118] border-[#1E202B]" : "text-slate-800 bg-white border-slate-200"
                        }`}>
                          {layer.exampleOut}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Egress Safe Execution Confirmation */}
        <div className={`flex items-center justify-between px-5 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
          isDark
            ? "bg-[#0F1015] border-[#20222B] text-gray-400"
            : "bg-white border-slate-200/90 ring-1 ring-slate-900/[0.03] text-slate-600 shadow-xs"
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span className={`font-medium ${isDark ? "text-white" : "text-[#0F172A]"}`}>Safe Execution Permitted</span>
            <span className="text-gray-400 hidden sm:inline">→</span>
            <span className="hidden sm:inline">Downstream DB / API Execution</span>
          </div>
          <span className="text-emerald-400 text-[11px] font-semibold">
            Zero Malicious Impact
          </span>
        </div>
      </div>

      {/* =======================================================================
          3. CONNECTED 3-PILLAR DEPLOYMENT DOCK
          ======================================================================= */}
      <div className={`mt-12 p-2.5 rounded-3xl border shadow-xl relative z-10 transition-colors ${
        isDark
          ? "border-[#242628] bg-[#0E0E12]"
          : "border-slate-200/90 bg-slate-100/80 ring-1 ring-slate-900/[0.03] shadow-md shadow-slate-200/40"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Pillar 1 */}
          <div className={`p-5 rounded-2xl border transition-all group ${
            isDark
              ? "bg-[#12141A] border-[#1E2028] hover:border-emerald-500/30"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#34D59A] font-semibold mb-1.5 flex items-center gap-2">
              <Terminal className="size-3.5" />
              <span>Where Developers Build</span>
            </div>
            <h4 className={`text-sm font-semibold mb-1.5 transition-colors ${
              isDark ? "text-white group-hover:text-[#34D59A]" : "text-[#0F172A] group-hover:text-emerald-700"
            }`}>
              Local Zero-Friction Shield
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94979E]" : "text-[#475569]"}`}>
              Run <code className={`font-mono px-1 py-0.5 rounded ${isDark ? "text-[#C9CBCF] bg-[#1E212B]" : "text-slate-800 bg-slate-100"}`}>npx sevlex init</code> to wrap Cursor, Claude Desktop, and VS Code in local stdio gates. Zero accounts required.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark
              ? "bg-[#12141A] border-[#1E2028] hover:border-blue-500/30"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5 flex items-center gap-2">
              <Layers className="size-3.5" />
              <span>Where Teams Collaborate</span>
            </div>
            <h4 className={`text-sm font-semibold mb-1.5 transition-colors ${
              isDark ? "text-white group-hover:text-blue-400" : "text-[#0F172A] group-hover:text-blue-700"
            }`}>
              Shared Policy Governance
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94979E]" : "text-[#475569]"}`}>
              Sync global allowlists and velocity limits across your organization. Receive instant Slack alerts when an agent attempts an unauthorized action.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark
              ? "bg-[#12141A] border-[#1E2028] hover:border-purple-500/30"
              : "bg-white border-slate-200/90 hover:border-slate-300 ring-1 ring-slate-900/[0.03] shadow-xs"
          }`}>
            <div className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-semibold mb-1.5 flex items-center gap-2">
              <Fingerprint className="size-3.5" />
              <span>Where Enterprises Comply</span>
            </div>
            <h4 className={`text-sm font-semibold mb-1.5 transition-colors ${
              isDark ? "text-white group-hover:text-purple-400" : "text-[#0F172A] group-hover:text-purple-700"
            }`}>
              Mathematical Audit Proofs
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94979E]" : "text-[#475569]"}`}>
              Every action is cryptographically sealed into Neon PostgreSQL. Hand auditors mathematical proof that dangerous DDL and raw keys never reached downstream models.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

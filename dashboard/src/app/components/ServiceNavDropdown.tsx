"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";

interface ServiceNavDropdownProps {
  isDark: boolean;
  isActive?: boolean;
}

export default function ServiceNavDropdown({ isDark, isActive = false }: ServiceNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 160);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleItemClick = (anchorId: string) => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 transition-colors duration-150 py-1 text-xs font-medium cursor-pointer ${
          isActive
            ? "text-[#34D59A] font-semibold"
            : isOpen
            ? isDark
              ? "text-white"
              : "text-slate-950"
            : isDark
            ? "text-[#94979E] hover:text-white"
            : "text-[#6B7280] hover:text-black"
        }`}
      >
        <a href="/service">Service</a>
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#34D59A]" : "opacity-60"
          }`}
        />
      </button>

      {/* Invisible bridge to prevent pointer gap closing */}
      {isOpen && <div className="absolute top-full left-0 right-0 h-3 z-50" />}

      {/* Neon-Style Luminous Mega Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-[840px] max-w-[95vw] rounded-2xl p-6 shadow-2xl z-50 border backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-[#090C12]/98 border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(52,213,154,0.06)]"
              : "bg-white/98 border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          }`}
        >
          {/* Subtle Top Edge Luminous Highlight */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#34D59A]/30 to-transparent pointer-events-none" />

          {/* 3-Column Category Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            
            {/* COLUMN 1: CATEGORY A - INTERNAL INFRA (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94979E] block">
                  Category A: Internal Infra
                </span>
                <span className="text-[12px] text-[#61646B] block mt-0.5">
                  For your internal engineering teams
                </span>
              </div>

              <div className="space-y-1">
                <a
                  href="/service#internal-infra"
                  onClick={() => handleItemClick("internal-infra")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Database &amp; Data Warehouse MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Safe read-only access for Postgres, Snowflake &amp; Mongo
                  </p>
                </a>

                <a
                  href="/service#internal-infra"
                  onClick={() => handleItemClick("internal-infra")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Private APIs &amp; Microservices
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Convert internal Swagger &amp; REST into typed AI tools
                  </p>
                </a>

                <a
                  href="/service#internal-infra"
                  onClick={() => handleItemClick("internal-infra")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    DevOps &amp; Observability Logs
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    CloudWatch, Sentry &amp; Datadog triage in Cursor/Claude
                  </p>
                </a>

                <a
                  href="/service#internal-infra"
                  onClick={() => handleItemClick("internal-infra")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Zero-Trust Security &amp; SOC 2
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    ToolGuard™ AST firewall, in-flight DLP &amp; Merkle ledger
                  </p>
                </a>

                <a
                  href="/service#internal-infra"
                  onClick={() => handleItemClick("internal-infra")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Fleet-Wide MDM Rollout
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Jamf &amp; Intune provisioning across 20–100+ laptops
                  </p>
                </a>
              </div>
            </div>

            {/* COLUMN 2: CATEGORY B - COMMERCIAL SAAS (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94979E] block">
                  Category B: SaaS Connectors
                </span>
                <span className="text-[12px] text-[#61646B] block mt-0.5">
                  For your outside paying customers
                </span>
              </div>

              <div className="space-y-1">
                <a
                  href="/service#commercial-saas"
                  onClick={() => handleItemClick("commercial-saas")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Multi-Tenant Remote SSE
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    24/7 cloud server with OAuth 2.0 PKCE user delegation
                  </p>
                </a>

                <a
                  href="/service#commercial-saas"
                  onClick={() => handleItemClick("commercial-saas")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Marketplace Distribution
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Publishing on Smithery.ai, mcp.so &amp; @company npm
                  </p>
                </a>

                <a
                  href="/service#commercial-saas"
                  onClick={() => handleItemClick("commercial-saas")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Slack &amp; Teams Approval Gates
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Human-in-the-loop authorization before sensitive actions
                  </p>
                </a>

                <a
                  href="/service#commercial-saas"
                  onClick={() => handleItemClick("commercial-saas")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    24/7 Managed Cloud Infrastructure
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    99.9% uptime SLA, auto-SSL &amp; zero DevOps overhead
                  </p>
                </a>

                <a
                  href="/service#commercial-saas"
                  onClick={() => handleItemClick("commercial-saas")}
                  className={`group block p-2 -mx-2 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Continuous Model Evolution
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Prompt &amp; schema tuning for Claude 3.7, GPT-5 &amp; Gemini
                  </p>
                </a>
              </div>
            </div>

            {/* COLUMN 3: VIBRANT SPOTLIGHT CARD (4 cols) */}
            <div className="md:col-span-4 flex flex-col">
              <div
                className={`flex-1 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border ${
                  isDark
                    ? "bg-[#0D111A] border-emerald-500/20 shadow-[0_0_25px_rgba(52,213,154,0.06)]"
                    : "bg-slate-900 text-white border-slate-800"
                }`}
              >
                {/* Neon High-Voltage Dot Matrix & Ambient Glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(52, 213, 154, 0.5) 1.2px, transparent 1.2px)",
                    backgroundSize: "13px 13px",
                    maskImage: "radial-gradient(ellipse at 85% 15%, black 45%, transparent 85%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 85% 15%, black 45%, transparent 85%)",
                  }}
                />
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#34D59A]/20 blur-3xl pointer-events-none rounded-full" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34D59A]/15 border border-[#34D59A]/30 text-[#34D59A] text-[11px] font-semibold mb-3">
                    <span className="size-1.5 rounded-full bg-[#34D59A] animate-pulse shadow-[0_0_8px_#34D59A]" />
                    <span>Tailored Architecture</span>
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-tight leading-snug">
                    Architected to Your Exact Stack
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Every organization has a different stack. We tailor, harden, and ship custom MCP servers in 48–72 hours under guaranteed SLAs.
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <a
                    href="/service#intake"
                    onClick={() => handleItemClick("intake")}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#34D59A] text-black hover:bg-[#34D59A]/90 transition shadow-[0_0_15px_rgba(52,213,154,0.25)] cursor-pointer"
                  >
                    <span>Request Scope</span>
                    <ArrowRight className="size-3" />
                  </a>
                  <a
                    href="https://calendly.com/meetpxnchl/meeting"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-[#C9CBCF] hover:text-white transition inline-flex items-center gap-1"
                  >
                    <span>Book Call</span>
                    <span className="text-[#34D59A]">→</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

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
      className="relative inline-block"
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

      {/* Neon-Style Mega Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-[820px] max-w-[95vw] rounded-2xl p-6 shadow-2xl z-50 border backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-[#07080B]/98 border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.9)]"
              : "bg-white/98 border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          }`}
        >
          {/* 3-Column Layout: Type A | Type B | Featured Spotlight Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* COLUMN 1: TYPE A - INTERNAL (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#797D86] font-semibold block">
                  TYPE A: INTERNAL
                </span>
                <span className="text-[11px] text-[#4E5158] block mt-0.5">For your own team</span>
              </div>

              <div className="space-y-3.5">
                <a
                  href="/service#safe-db"
                  onClick={() => handleItemClick("safe-db")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Safe Database Bridge
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    Read-only Postgres, MySQL, Mongo &amp; Snowflake
                  </p>
                </a>

                <a
                  href="/service#openapi-porting"
                  onClick={() => handleItemClick("openapi-porting")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    OpenAPI &amp; Microservices
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    Convert private Swagger &amp; APIs to MCP tools
                  </p>
                </a>

                <a
                  href="/service#devops-logs"
                  onClick={() => handleItemClick("devops-logs")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    DevOps &amp; Incident Logs
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    CloudWatch, Sentry &amp; Datadog triage in IDE
                  </p>
                </a>

                <a
                  href="/service#security-hardening"
                  onClick={() => handleItemClick("security-hardening")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Zero-Trust Hardening
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    ToolGuard™ AST firewall &amp; Merkle audit ledger
                  </p>
                </a>

                <a
                  href="/service#fleet-rollout"
                  onClick={() => handleItemClick("fleet-rollout")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Fleet-Wide IDE Rollout
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    Jamf &amp; Intune rollout for 20–100+ devs
                  </p>
                </a>
              </div>
            </div>

            {/* COLUMN 2: TYPE B - COMMERCIAL (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#797D86] font-semibold block">
                  TYPE B: COMMERCIAL
                </span>
                <span className="text-[11px] text-[#4E5158] block mt-0.5">For your customers</span>
              </div>

              <div className="space-y-3.5">
                <a
                  href="/service#saas-flagship"
                  onClick={() => handleItemClick("saas-flagship")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Official SaaS Connector
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    24/7 Remote SSE + OAuth 2.0 PKCE user login
                  </p>
                </a>

                <a
                  href="/service#marketplace-distribution"
                  onClick={() => handleItemClick("marketplace-distribution")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Marketplace Distribution
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    Smithery.ai, mcp.so &amp; @company npm listing
                  </p>
                </a>

                <a
                  href="/service#slack-hitl"
                  onClick={() => handleItemClick("slack-hitl")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Slack HITL Approval Gates
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    Interactive manager sign-off for critical actions
                  </p>
                </a>

                <a
                  href="/service#managed-cloud"
                  onClick={() => handleItemClick("managed-cloud")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    24/7 Managed Cloud Hosting
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    99.9% uptime SLA, auto-SSL &amp; zero DevOps
                  </p>
                </a>

                <a
                  href="/service#schema-evolution"
                  onClick={() => handleItemClick("schema-evolution")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-medium leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Schema &amp; Model Evolution
                  </h4>
                  <p className={`text-[12px] leading-tight mt-1 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>
                    Monthly updates for Claude 3.7 &amp; GPT-5
                  </p>
                </a>
              </div>
            </div>

            {/* COLUMN 3: FEATURED SPOTLIGHT CARD (4 cols) - Identical to Neon's 'What is Neon' */}
            <div className="md:col-span-4 flex flex-col">
              <div
                className={`flex-1 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden border ${
                  isDark
                    ? "bg-[#0B0D11] border-white/[0.08]"
                    : "bg-slate-900 text-white border-slate-800"
                }`}
              >
                {/* Neon-Style Dot Matrix Glow Background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(52, 213, 154, 0.4) 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                    maskImage: "radial-gradient(ellipse at 80% 20%, black 40%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 80% 20%, black 40%, transparent 80%)",
                  }}
                />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#34D59A]/10 border border-[#34D59A]/20 text-[#34D59A] text-[10px] font-mono font-medium mb-4">
                    <Sparkles className="size-3" />
                    <span>WHITE-GLOVE</span>
                  </div>
                  <h3 className="text-base font-medium text-white leading-snug">
                    Turnaround in 48 to 72 Hours
                  </h3>
                  <p className="text-xs text-[#94979E] mt-2 leading-relaxed">
                    Zero hourly bills. Fixed-scope delivery with full TypeScript code ownership and 100% money-back guarantee.
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <a
                    href="/service#intake"
                    onClick={() => handleItemClick("intake")}
                    className="text-xs font-medium text-[#34D59A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Spec</span>
                    <ArrowRight className="size-3" />
                  </a>
                  <a
                    href="https://calendly.com/meetpxnchl/meeting"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#AFB1B6] hover:text-white transition"
                  >
                    Book Call →
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

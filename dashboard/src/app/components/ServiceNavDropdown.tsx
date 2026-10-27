"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Database,
  Layers,
  Terminal,
  Lock,
  FileCode,
  Sparkles,
  Globe2,
  ShieldCheck,
  Server,
  RefreshCw,
  ArrowRight,
  Zap,
} from "lucide-react";

interface ServiceNavDropdownProps {
  isDark: boolean;
  isActive?: boolean;
}

export default function ServiceNavDropdown({ isDark, isActive = false }: ServiceNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Close when clicking outside
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
        <a href="/service">
          Service
        </a>
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#34D59A]" : "opacity-60"
          }`}
        />
      </button>

      {/* Invisible bridge to prevent pointer gap closing */}
      {isOpen && <div className="absolute top-full left-0 right-0 h-3 z-50" />}

      {/* Dropdown Mega Menu Panel */}
      {isOpen && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-[780px] max-w-[94vw] rounded-2xl p-6 shadow-2xl z-50 border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-[#0E1014]/95 border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
              : "bg-white/98 border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          }`}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06] dark:border-white/[0.06] border-slate-100">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#34D59A]">
                Model Context Protocol Services
              </span>
              <p className={`text-xs mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                Zero-trust MCP servers &amp; connectors delivered under guaranteed 48h–72h SLAs
              </p>
            </div>
            <a
              href="/service#catalogue"
              onClick={() => handleItemClick("catalogue")}
              className={`inline-flex items-center gap-1 text-[11px] font-medium transition ${
                isDark ? "text-[#AFB1B6] hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>View All 10 Solutions</span>
              <ArrowRight className="size-3" />
            </a>
          </div>

          {/* Two-Column Categorical Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* COLUMN 1: TYPE A - INTERNAL ENTERPRISE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#34D59A]" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#34D59A]">
                    Type A: Internal Enterprise
                  </span>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                  48h–72h SLA
                </span>
              </div>

              <div className="space-y-1">
                {/* 1. Safe DB */}
                <a
                  href="/service#safe-db"
                  onClick={() => handleItemClick("safe-db")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#34D59A]" : "bg-emerald-50 text-emerald-600"}`}>
                    <Database className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        Safe Database Bridge
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#34D59A] font-semibold">
                        48H
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Postgres, MySQL, Mongo &amp; Snowflake AST firewall kills destructive queries.
                    </p>
                  </div>
                </a>

                {/* 2. OpenAPI */}
                <a
                  href="/service#openapi-porting"
                  onClick={() => handleItemClick("openapi-porting")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#34D59A]" : "bg-emerald-50 text-emerald-600"}`}>
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        OpenAPI &amp; Microservice Porting
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#34D59A] font-semibold">
                        72H
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Convert Swagger &amp; private REST into 15–30 typed natural language tools.
                    </p>
                  </div>
                </a>

                {/* 3. DevOps Logs */}
                <a
                  href="/service#devops-logs"
                  onClick={() => handleItemClick("devops-logs")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#34D59A]" : "bg-emerald-50 text-emerald-600"}`}>
                    <Terminal className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        DevOps &amp; Incident Logs MCP
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#34D59A] font-semibold">
                        72H
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      CloudWatch, Sentry &amp; Datadog crash triage directly in developer IDEs.
                    </p>
                  </div>
                </a>

                {/* 4. Security Hardening */}
                <a
                  href="/service#security-hardening"
                  onClick={() => handleItemClick("security-hardening")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-purple-400" : "bg-purple-50 text-purple-600"}`}>
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-purple-400 transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        SOC 2 &amp; Zero-Trust Hardening
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 font-semibold">
                        AUDIT
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Wrap existing MCPs with ToolGuard™ AST firewalls and Merkle ledgers.
                    </p>
                  </div>
                </a>

                {/* 5. Fleet Rollout */}
                <a
                  href="/service#fleet-rollout"
                  onClick={() => handleItemClick("fleet-rollout")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#34D59A]" : "bg-emerald-50 text-emerald-600"}`}>
                    <FileCode className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        Fleet-Wide IDE Rollout
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#34D59A] font-semibold">
                        MDM
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Jamf &amp; Intune automated provisioning for 20–100+ developer laptops.
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* COLUMN 2: TYPE B - COMMERCIAL SAAS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#38BDF8]" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                    Type B: Commercial SaaS
                  </span>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? "text-[#797D86]" : "text-slate-400"}`}>
                  Public AI Connectors
                </span>
              </div>

              <div className="space-y-1">
                {/* 1. Official SaaS Connector */}
                <a
                  href="/service#saas-flagship"
                  onClick={() => handleItemClick("saas-flagship")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#38BDF8]" : "bg-sky-50 text-sky-600"}`}>
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        Official Multi-Tenant Connector
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-[#38BDF8] font-semibold">
                        FLAGSHIP
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      24/7 Remote SSE + OAuth 2.0 PKCE so paying customers use your app in Claude.
                    </p>
                  </div>
                </a>

                {/* 2. Marketplace Distribution */}
                <a
                  href="/service#marketplace-distribution"
                  onClick={() => handleItemClick("marketplace-distribution")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#38BDF8]" : "bg-sky-50 text-sky-600"}`}>
                    <Globe2 className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        AI Marketplace Distribution
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-[#38BDF8] font-semibold">
                        GROWTH
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Publish to Smithery.ai, mcp.so &amp; @company/mcp-server npm registry.
                    </p>
                  </div>
                </a>

                {/* 3. Slack HITL Gate */}
                <a
                  href="/service#slack-hitl"
                  onClick={() => handleItemClick("slack-hitl")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#38BDF8]" : "bg-sky-50 text-sky-600"}`}>
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        Slack HITL Approval Gates
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-[#38BDF8] font-semibold">
                        SAFETY
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Interactive Slack card with Approve/Deny buttons before high-risk agent actions.
                    </p>
                  </div>
                </a>

                {/* 4. Managed Cloud */}
                <a
                  href="/service#managed-cloud"
                  onClick={() => handleItemClick("managed-cloud")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#38BDF8]" : "bg-sky-50 text-sky-600"}`}>
                    <Server className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        24/7 Managed Cloud Hosting
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-[#38BDF8] font-semibold">
                        SLA 99.9%
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Zero dev overhead: auto-scaling, auto-SSL, DDoS defense and error monitoring.
                    </p>
                  </div>
                </a>

                {/* 5. Schema Evolution */}
                <a
                  href="/service#schema-evolution"
                  onClick={() => handleItemClick("schema-evolution")}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-[#14161C] text-[#38BDF8]" : "bg-sky-50 text-sky-600"}`}>
                    <RefreshCw className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-medium group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        Schema &amp; Model Evolution
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-[#38BDF8] font-semibold">
                        RETAINER
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? "text-[#797D86]" : "text-slate-500"}`}>
                      Monthly updates &amp; prompt alignment for Claude 3.7, GPT-5 &amp; Gemini 2.0.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div
            className={`mt-4 pt-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono ${
              isDark ? "border-white/[0.06] text-[#797D86]" : "border-slate-100 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="size-3.5 text-[#34D59A]" />
              <span>Guaranteed Delivery SLAs • Zero Hourly Overages • 100% Code Ownership</span>
            </div>
            <a
              href="/service#intake"
              onClick={() => handleItemClick("intake")}
              className="text-[#34D59A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Request Scoping Spec</span>
              <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

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

      {/* Luminous Mega Dropdown Panel: Mapped Exactly to Type A & Type B Screenshots */}
      {isOpen && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-[860px] max-w-[96vw] rounded-2xl p-6 shadow-2xl z-50 border backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-[#090C12]/98 border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(52,213,154,0.06)]"
              : "bg-white/98 border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          }`}
        >
          {/* Subtle Top Edge Luminous Highlight */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#34D59A]/30 to-transparent pointer-events-none" />

          {/* 3-Column Layout: Type A (Internal) | Type B (Commercial) | Spotlight Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            
            {/* COLUMN 1: TYPE A - INTERNAL MCPS (4 cols) */}
            <div className="md:col-span-4 space-y-3.5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94979E] block">
                  Type A: Internal MCPs
                </span>
                <span className="text-[12px] text-[#61646B] block mt-0.5">
                  For your internal engineering teams
                </span>
              </div>

              <div className="space-y-1">
                <a
                  href="/service#type-a-internal"
                  onClick={() => handleItemClick("type-a-internal")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    1. The Database MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Postgres, MySQL, Snowflake &amp; Mongo (Storage Room)
                  </p>
                </a>

                <a
                  href="/service#type-a-internal"
                  onClick={() => handleItemClick("type-a-internal")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    2. The Internal API MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Swagger, private REST &amp; microservices (Private Engine)
                  </p>
                </a>

                <a
                  href="/service#type-a-internal"
                  onClick={() => handleItemClick("type-a-internal")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    3. The Cloud &amp; Server MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    CloudWatch, Datadog &amp; Sentry (DevOps Engine Room)
                  </p>
                </a>

                <a
                  href="/service#type-a-internal"
                  onClick={() => handleItemClick("type-a-internal")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    4. The Project &amp; Code MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Linear, Jira, Git &amp; CI/CD (The Daily Workflow)
                  </p>
                </a>

                <a
                  href="/service#type-a-internal"
                  onClick={() => handleItemClick("type-a-internal")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    5. The Company Knowledge MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Notion, Confluence &amp; wikis (The Company Library)
                  </p>
                </a>

                <a
                  href="/service#type-a-internal"
                  onClick={() => handleItemClick("type-a-internal")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    6. The Customer Support MCP
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Zendesk, Intercom &amp; CRM (The Operations Desk)
                  </p>
                </a>
              </div>
            </div>

            {/* COLUMN 2: TYPE B - COMMERCIAL SAAS MCPS (4 cols) */}
            <div className="md:col-span-4 space-y-3.5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94979E] block">
                  Type B: Commercial / Public
                </span>
                <span className="text-[12px] text-[#61646B] block mt-0.5">
                  For your outside paying customers
                </span>
              </div>

              <div className="space-y-1">
                <a
                  href="/service#type-b-commercial"
                  onClick={() => handleItemClick("type-b-commercial")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    1. Developer Tools &amp; Cloud SaaS
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    e.g. Neon, Supabase, Vercel (Remote SSE)
                  </p>
                </a>

                <a
                  href="/service#type-b-commercial"
                  onClick={() => handleItemClick("type-b-commercial")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    2. Project &amp; Productivity SaaS
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    e.g. Linear, Notion, Jira (Workflow Connectors)
                  </p>
                </a>

                <a
                  href="/service#type-b-commercial"
                  onClick={() => handleItemClick("type-b-commercial")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    3. Fintech &amp; Payment SaaS
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    e.g. Stripe, QuickBooks (HITL Slack Approval Gates)
                  </p>
                </a>

                <a
                  href="/service#type-b-commercial"
                  onClick={() => handleItemClick("type-b-commercial")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    4. Sales &amp; CRM SaaS
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    e.g. HubSpot, Salesforce (Customer Data Agents)
                  </p>
                </a>

                <a
                  href="/service#type-b-commercial"
                  onClick={() => handleItemClick("type-b-commercial")}
                  className={`group block p-1.5 -mx-1.5 rounded-xl transition duration-150 ${
                    isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    5. E-Commerce &amp; Store SaaS
                  </h4>
                  <p className={`text-[12px] leading-snug mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    e.g. Shopify, WooCommerce (Catalog &amp; Order Tools)
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

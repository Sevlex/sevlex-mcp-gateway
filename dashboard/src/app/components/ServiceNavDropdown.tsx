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

      {/* Neon-Grade Subtle Luminous Mega Dropdown Panel */}
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

          {/* 3-Column Layout: Enterprise MCP | Commercial SaaS | Featured Spotlight Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-7 relative z-10">
            
            {/* COLUMN 1: ENTERPRISE MCP (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#797D86] dark:text-[#797D86] block">
                  Enterprise MCP
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="/service#enterprise-mcp"
                  onClick={() => handleItemClick("enterprise-mcp")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Database Bridge
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Read-only Postgres, Snowflake &amp; Mongo
                  </p>
                </a>

                <a
                  href="/service#enterprise-mcp"
                  onClick={() => handleItemClick("enterprise-mcp")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    API &amp; Service Porting
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Swagger, GraphQL &amp; private microservices
                  </p>
                </a>

                <a
                  href="/service#enterprise-mcp"
                  onClick={() => handleItemClick("enterprise-mcp")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    DevOps &amp; Cloud Triage
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    CloudWatch, Datadog &amp; Sentry in IDE
                  </p>
                </a>

                <a
                  href="/service#enterprise-mcp"
                  onClick={() => handleItemClick("enterprise-mcp")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Workflow &amp; CI/CD
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    GitHub, Linear &amp; Jira automation in Cursor
                  </p>
                </a>

                <a
                  href="/service#enterprise-mcp"
                  onClick={() => handleItemClick("enterprise-mcp")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Knowledge Base &amp; Docs
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Notion, Confluence &amp; internal wikis
                  </p>
                </a>

                <a
                  href="/service#enterprise-mcp"
                  onClick={() => handleItemClick("enterprise-mcp")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#34D59A] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Customer Ops &amp; Support
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Zendesk, Intercom &amp; CRM read access
                  </p>
                </a>
              </div>
            </div>

            {/* COLUMN 2: COMMERCIAL SAAS (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#797D86] dark:text-[#797D86] block">
                  SaaS Connectors
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="/service#saas-connectors"
                  onClick={() => handleItemClick("saas-connectors")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Cloud &amp; Developer Tools
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Remote SSE for platforms like Neon &amp; Vercel
                  </p>
                </a>

                <a
                  href="/service#saas-connectors"
                  onClick={() => handleItemClick("saas-connectors")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Productivity &amp; Workflow Apps
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Connectors for Linear, Notion &amp; Jira
                  </p>
                </a>

                <a
                  href="/service#saas-connectors"
                  onClick={() => handleItemClick("saas-connectors")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Fintech &amp; Payments
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    HITL Slack approval gates for Stripe &amp; billing
                  </p>
                </a>

                <a
                  href="/service#saas-connectors"
                  onClick={() => handleItemClick("saas-connectors")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    CRM &amp; Revenue Platforms
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Customer intelligence for HubSpot &amp; Salesforce
                  </p>
                </a>

                <a
                  href="/service#saas-connectors"
                  onClick={() => handleItemClick("saas-connectors")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Commerce &amp; Storefronts
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Product catalog &amp; orders for Shopify &amp; stores
                  </p>
                </a>

                <a
                  href="/service#saas-connectors"
                  onClick={() => handleItemClick("saas-connectors")}
                  className="group block"
                >
                  <h4 className={`text-[13px] font-semibold leading-tight group-hover:text-[#38BDF8] transition ${isDark ? "text-white" : "text-slate-900"}`}>
                    Marketplace Distribution
                  </h4>
                  <p className={`text-[12px] leading-snug mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
                    Smithery.ai, mcp.so &amp; @company npm listing
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
                    <span>White-Glove Delivery</span>
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-tight leading-snug">
                    Architected to Your Exact Stack
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    Custom-built MCP infrastructure for your internal data layer or public SaaS product—delivered in 48–72 hours with full code ownership.
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

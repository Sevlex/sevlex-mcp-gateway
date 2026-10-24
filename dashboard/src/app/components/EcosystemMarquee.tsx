"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { ClientBrandIcon } from "./ClientBrandIcon";

interface EcosystemItem {
  name: string;
  category: string;
  brand: string;
}

const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  { name: "Cursor IDE", category: "AI Runtime", brand: "cursor" },
  { name: "Claude Desktop", category: "Model Context", brand: "claude" },
  { name: "Windsurf Cascade", category: "Autonomous Agent", brand: "windsurf" },
  { name: "Google Antigravity", category: "Agent Runtime", brand: "antigravity" },
  { name: "Neon Postgres", category: "Cloud Database", brand: "postgres" },
  { name: "AWS ECS & Fargate", category: "Enterprise VPC", brand: "aws" },
  { name: "Apple macOS", category: "Endpoint Security", brand: "apple" },
  { name: "Ubuntu / Linux", category: "Daemon Service", brand: "ubuntu" },
  { name: "Microsoft Intune", category: "Fleet MDM", brand: "microsoft" },
  { name: "Node.js / TypeScript", category: "Native SDK", brand: "node" },
];

export function EcosystemMarquee() {
  const { isDark: ctxDark, theme } = useTheme();
  const isDark = ctxDark ?? (theme === "dark");

  return (
    <div className={`relative w-full overflow-hidden py-10 border-y transition-colors duration-200 ${
      isDark 
        ? "border-[#1E2024] bg-[#07080A]/60" 
        : "border-slate-200/90 bg-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
    }`}>
      {/* Edge gradient masks for seamless fade out */}
      <div className={`absolute top-0 bottom-0 left-0 w-24 sm:w-40 z-10 pointer-events-none transition-colors duration-200 ${
        isDark 
          ? "bg-gradient-to-r from-[#000000] to-transparent" 
          : "bg-gradient-to-r from-[#F8FAFC] to-transparent"
      }`} />
      <div className={`absolute top-0 bottom-0 right-0 w-24 sm:w-40 z-10 pointer-events-none transition-colors duration-200 ${
        isDark 
          ? "bg-gradient-to-l from-[#000000] to-transparent" 
          : "bg-gradient-to-l from-[#F8FAFC] to-transparent"
      }`} />

      {/* Track */}
      <div className="flex w-max animate-marquee gap-8 sm:gap-12 hover:[animation-play-state:paused]">
        {[...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS].map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={`flex items-center gap-3.5 px-4 py-2 rounded-xl border transition-all duration-200 cursor-default group ${
              isDark
                ? "bg-[#0E1013] border-[#20232A] hover:border-[#383C47] text-[#C9CBCF] hover:text-white"
                : "bg-white border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs"
            }`}
          >
            <div className="size-6 shrink-0 flex items-center justify-center">
              <ClientBrandIcon name={item.brand} size="xs" className="size-5 transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-tight">{item.name}</span>
              <span className={`text-[10px] font-mono tracking-wider uppercase ${
                isDark ? "text-[#6B7280]" : "text-slate-400"
              }`}>{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

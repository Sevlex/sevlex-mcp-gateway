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
    <div className="relative w-full overflow-hidden py-8 select-none">
      {/* Edge gradient masks for seamless fade out */}
      <div className={`absolute top-0 bottom-0 left-0 w-24 sm:w-48 z-10 pointer-events-none transition-colors duration-200 ${
        isDark 
          ? "bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent" 
          : "bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent"
      }`} />
      <div className={`absolute top-0 bottom-0 right-0 w-24 sm:w-48 z-10 pointer-events-none transition-colors duration-200 ${
        isDark 
          ? "bg-gradient-to-l from-[#000000] via-[#000000]/80 to-transparent" 
          : "bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent"
      }`} />

      {/* Track */}
      <div className="flex w-max animate-marquee gap-10 sm:gap-14 hover:[animation-play-state:paused] items-center">
        {[...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS].map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={`flex items-center gap-3 px-2 py-1.5 transition-all duration-200 cursor-default group opacity-75 hover:opacity-100 ${
              isDark
                ? "text-[#A1A4AB] hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="size-6 shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-200">
              <ClientBrandIcon name={item.brand} size="xs" className="size-5 transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-tight whitespace-nowrap">{item.name}</span>
              <span className={`text-[9px] font-mono tracking-wider uppercase ${
                isDark ? "text-[#585C66] group-hover:text-[#8E929E]" : "text-slate-400 group-hover:text-slate-600"
              }`}>{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

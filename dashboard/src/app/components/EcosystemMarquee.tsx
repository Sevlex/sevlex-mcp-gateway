"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { ClientBrandIcon } from "./ClientBrandIcon";

interface EcosystemItem {
  name: string;
  category: string;
  brand: string;
  accentColor?: string;
}

const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  { name: "Cursor IDE", category: "AI Runtime", brand: "cursor", accentColor: "#00F0FF" },
  { name: "Claude Desktop", category: "Model Context", brand: "claude", accentColor: "#D97757" },
  { name: "Windsurf Cascade", category: "Autonomous Agent", brand: "windsurf", accentColor: "#00E5FF" },
  { name: "Google Antigravity", category: "Agent Runtime", brand: "antigravity", accentColor: "#4285F4" },
  { name: "Neon Postgres", category: "Cloud Database", brand: "postgres", accentColor: "#34D59A" },
  { name: "AWS ECS & Fargate", category: "Enterprise VPC", brand: "aws", accentColor: "#FF9900" },
  { name: "Apple macOS", category: "Endpoint Security", brand: "apple", accentColor: "#E2E8F0" },
  { name: "Ubuntu / Linux", category: "Daemon Service", brand: "ubuntu", accentColor: "#E95420" },
  { name: "Microsoft Intune", category: "Fleet MDM", brand: "microsoft", accentColor: "#00A4EF" },
  { name: "Node.js / TypeScript", category: "Native SDK", brand: "node", accentColor: "#68A063" },
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
            className="flex items-center gap-3 px-2 py-1.5 transition-all duration-200 cursor-default group hover:translate-y-[-1px]"
          >
            <div className="size-6 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              <ClientBrandIcon name={item.brand} size="xs" className="size-5 shrink-0" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-semibold tracking-tight whitespace-nowrap transition-colors ${
                isDark ? "text-white group-hover:text-[#00F0FF]" : "text-slate-900 group-hover:text-cyan-700"
              }`}>
                {item.name}
              </span>
              <span 
                className="text-[9px] font-mono tracking-wider uppercase font-medium"
                style={{ color: item.accentColor || (isDark ? "#34D59A" : "#059669") }}
              >
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

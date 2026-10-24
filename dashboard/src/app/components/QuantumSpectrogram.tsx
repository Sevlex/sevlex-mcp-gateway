"use client";

import React, { useMemo } from "react";
import { useTheme } from "./ThemeProvider";

interface ColumnDef {
  id: number;
  leftPercent: number;
  heightPercent: number;
  widthPx: number;
  color: string;
  glowColor: string;
  opacity: number;
  blurPx: number;
  durationSec: number;
  delaySec: number;
}

export function QuantumSpectrogram({ className = "" }: { className?: string }) {
  const { isDark: ctxDark, theme } = useTheme();
  const isDark = ctxDark ?? (theme === "dark");

  // Procedurally generate 36 vertical laser columns across the canvas
  const columns: ColumnDef[] = useMemo(() => {
    const list: ColumnDef[] = [];
    const colors = [
      { dark: "#00F0FF", glow: "rgba(0, 240, 255, 0.4)", light: "#0284C7" }, // Cyber Cyan
      { dark: "#34D59A", glow: "rgba(52, 213, 154, 0.4)", light: "#059669" }, // Mint Emerald
      { dark: "#3B82F6", glow: "rgba(59, 130, 246, 0.35)", light: "#2563EB" }, // Electric Blue
      { dark: "#6366F1", glow: "rgba(99, 102, 241, 0.3)", light: "#4F46E5" },  // Quantum Indigo
      { dark: "#10B981", glow: "rgba(16, 185, 129, 0.35)", light: "#10B981" }, // Neon Teal
    ];

    const totalBars = 36;
    for (let i = 0; i < totalBars; i++) {
      // Clustered towards the center, tapering towards the edges
      const leftPercent = (i / (totalBars - 1)) * 96 + 2;
      const distFromCenter = Math.abs(leftPercent - 50) / 50;
      
      // Organic height distribution: taller near center, varied pseudo-randomly
      const seed = Math.sin(i * 12.9898 + 78.233);
      const randVal = (seed - Math.floor(seed));
      const baseHeight = (1 - distFromCenter * 0.45) * 85;
      const heightPercent = Math.max(25, Math.min(95, baseHeight + (randVal - 0.5) * 40));

      const colorScheme = colors[i % colors.length]!;
      const isForeground = i % 3 === 0;
      const isBackground = i % 5 === 0;

      list.push({
        id: i,
        leftPercent,
        heightPercent,
        widthPx: isForeground ? 3 : isBackground ? 1.5 : 2,
        color: isDark ? colorScheme.dark : colorScheme.light,
        glowColor: colorScheme.glow,
        opacity: isDark ? (isForeground ? 0.85 : 0.45) : (isForeground ? 0.5 : 0.25),
        blurPx: isBackground ? 4 : isForeground ? 0 : 1,
        durationSec: 3.5 + randVal * 3,
        delaySec: randVal * 2,
      });
    }
    return list;
  }, [isDark]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
    >
      {/* 1. Atmospheric Caustic Fields (Cyan + Mint + Indigo) */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[580px] rounded-full pointer-events-none blur-3xl transition-opacity duration-300 ${
          isDark 
            ? "bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18)_0%,rgba(52,213,154,0.14)_35%,rgba(99,102,241,0.08)_65%,transparent_80%)] opacity-90"
            : "bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.12)_0%,rgba(5,150,105,0.08)_40%,transparent_75%)] opacity-70"
        }`} 
      />

      {/* 2. Precision Vector Merkle Lattice */}
      <svg 
        className={`absolute inset-0 size-full transition-opacity duration-300 ${
          isDark ? "opacity-35" : "opacity-20"
        }`} 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="spectrogram-merkle-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.1" fill={isDark ? "#9CA3AF" : "#64748B"} opacity="0.6" />
            <path d="M 0 12 L 24 12 M 12 0 L 12 24" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="hero-glow-mask" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-mesh-caustic">
            <rect width="100%" height="100%" fill="url(#hero-glow-mask)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#spectrogram-merkle-grid)" mask="url(#hero-mesh-caustic)" />
      </svg>

      {/* 3. The Vertical Quantum Spectrogram Laser Columns */}
      <div 
        className="absolute inset-0 max-w-6xl mx-auto flex items-end justify-between px-4 sm:px-8"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 85%, transparent 100%)",
        }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="relative flex flex-col items-center justify-end h-full"
            style={{
              width: `${col.widthPx}px`,
              filter: col.blurPx > 0 ? `blur(${col.blurPx}px)` : undefined,
            }}
          >
            {/* The Vertical Column Beam */}
            <div
              className="w-full rounded-full transition-all duration-700 animate-pulse"
              style={{
                height: `${col.heightPercent}%`,
                background: `linear-gradient(to top, transparent 0%, ${col.color} 50%, #FFFFFF 100%)`,
                boxShadow: isDark ? `0 0 16px ${col.glowColor}, 0 0 28px ${col.glowColor}` : `0 0 10px ${col.glowColor}`,
                opacity: col.opacity,
                animationDuration: `${col.durationSec}s`,
                animationDelay: `${col.delaySec}s`,
              }}
            />

            {/* Glowing Quantum Node at the apex of the beam */}
            <div
              className="size-1.5 rounded-full absolute transition-opacity duration-300"
              style={{
                bottom: `calc(${col.heightPercent}% - 3px)`,
                backgroundColor: isDark ? "#FFFFFF" : col.color,
                boxShadow: `0 0 10px ${col.color}, 0 0 18px ${col.color}`,
                opacity: col.opacity > 0.4 ? 0.9 : 0.4,
              }}
            />
          </div>
        ))}
      </div>

      {/* 4. Glowing Horizon Laser Wire (The Layer 7 Inspection Boundary) */}
      <div className="absolute top-[380px] sm:top-[440px] left-0 right-0 h-px pointer-events-none">
        <div 
          className={`h-full w-full ${
            isDark 
              ? "bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent" 
              : "bg-gradient-to-r from-transparent via-[#0284C7]/30 to-transparent"
          }`} 
        />
        <div 
          className={`h-[2px] -mt-px mx-auto max-w-4xl blur-[1.5px] ${
            isDark 
              ? "bg-gradient-to-r from-transparent via-[#34D59A]/60 to-transparent" 
              : "bg-gradient-to-r from-transparent via-[#059669]/40 to-transparent"
          }`} 
        />
      </div>

      {/* 5. Lower Atmospheric Fog Dissolve into Content */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none transition-colors duration-200 ${
          isDark 
            ? "bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" 
            : "bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent"
        }`} 
      />
    </div>
  );
}

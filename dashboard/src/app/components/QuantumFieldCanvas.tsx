"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
  glow: string;
}

export function QuantumFieldCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark: ctxDark, theme } = useTheme();
  const isDark = ctxDark ?? (theme === "dark");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates for gentle interactive disturbance
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Color palette based on theme
    const darkPalette = [
      { color: "#00F0FF", glow: "rgba(0, 240, 255, 0.6)" }, // Cyber Cyan
      { color: "#34D59A", glow: "rgba(52, 213, 154, 0.6)" }, // Mint Emerald
      { color: "#6366F1", glow: "rgba(99, 102, 241, 0.5)" }, // Quantum Indigo
      { color: "#38BDF8", glow: "rgba(56, 189, 248, 0.5)" }, // Sky Blue
    ];

    const lightPalette = [
      { color: "#0284C7", glow: "rgba(2, 132, 199, 0.35)" },
      { color: "#059669", glow: "rgba(5, 150, 105, 0.35)" },
      { color: "#4F46E5", glow: "rgba(79, 70, 229, 0.3)" },
    ];

    const palette = isDark ? darkPalette : lightPalette;

    // Initialize 48 quantum particles
    const particleCount = Math.min(50, Math.floor(width / 24));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = palette[i % palette.length]!;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.25,
        color: p.color,
        glow: p.glow,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;

        // Mouse repelling force (smooth spring)
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Standard motion
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.globalAlpha = p.baseAlpha * (isDark ? 0.9 : 0.6);
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with delicate hairlines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]!;
          const connDx = p.x - p2.x;
          const connDy = p.y - p2.y;
          const connDist = Math.sqrt(connDx * connDx + connDy * connDy);

          if (connDist < 110) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = (1 - connDist / 110) * (isDark ? 0.18 : 0.08);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDark]);

  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Atmospheric Caustic Mesh Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full pointer-events-none blur-3xl transition-opacity duration-500 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,rgba(52,213,154,0.11)_35%,rgba(99,102,241,0.06)_65%,transparent_80%)] opacity-80"
            : "bg-[radial-gradient(ellipse_at_center,rgba(2,132,199,0.10)_0%,rgba(5,150,105,0.07)_40%,transparent_75%)] opacity-70"
        }`}
      />

      {/* 2. Interactive Quantum Particles & Synaptic Hairlines */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
        }}
      />
    </div>
  );
}

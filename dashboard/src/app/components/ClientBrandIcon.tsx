"use client";

import React from "react";
import { Cpu } from "lucide-react";

interface ClientBrandIconProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const LOGO_DEV_TOKEN = "pk_fdAoKVsxTvadheeQhynG5A";

export default function ClientBrandIcon({ name, size = "md", className = "" }: ClientBrandIconProps) {
  const norm = (name || "").toLowerCase();

  const sizeClass = 
    size === "xs" ? "w-3 h-3" :
    size === "sm" ? "w-3.5 h-3.5" :
    size === "lg" ? "w-6 h-6" : "w-4 h-4";

  if (norm.includes("cursor")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src="/cursor-icon.svg" 
        alt="Cursor IDE" 
        className={`${sizeClass} object-contain shrink-0 ${className}`} 
      />
    );
  }

  if (norm.includes("claude")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src="/claude-icon.svg" 
        alt="Anthropic Claude" 
        className={`${sizeClass} object-contain shrink-0 ${className}`} 
      />
    );
  }

  if (norm.includes("antigravity") || norm.includes("gemini") || norm.includes("google")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src="/gemini-logo.svg" 
        alt="Google Antigravity" 
        className={`${sizeClass} object-contain shrink-0 ${className} text-[#2563EB]`} 
      />
    );
  }

  if (norm.includes("windsurf") || norm.includes("codeium")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src="/windsurf-icon.svg" 
        alt="Windsurf IDE" 
        className={`${sizeClass} object-contain shrink-0 ${className} text-slate-800`} 
      />
    );
  }

  if (norm.includes("openai") || norm.includes("chatgpt")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={`https://img.logo.dev/openai.com?token=${LOGO_DEV_TOKEN}&size=64&format=png`} 
        alt="OpenAI" 
        className={`${sizeClass} object-contain shrink-0 ${className}`} 
      />
    );
  }

  if (norm.includes("vscode") || norm.includes("visual studio")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={`https://img.logo.dev/code.visualstudio.com?token=${LOGO_DEV_TOKEN}&size=64&format=png`} 
        alt="VS Code" 
        className={`${sizeClass} object-contain shrink-0 ${className}`} 
      />
    );
  }

  return <Cpu className={`${sizeClass} text-slate-500 shrink-0 ${className}`} />;
}

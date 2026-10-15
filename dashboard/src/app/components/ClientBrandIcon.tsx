"use client";

import React, { useState } from "react";
import { Cpu, Server, Database } from "lucide-react";

interface ClientBrandIconProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const LOGO_DEV_TOKEN = "pk_fdAoKVsxTvadheeQhynG5A";

export const getDomainForBrand = (name: string): string | null => {
  const norm = (name || "").toLowerCase();
  if (norm.includes("cursor")) return "cursor.com";
  if (norm.includes("claude") || norm.includes("anthropic")) return "anthropic.com";
  if (norm.includes("windsurf") || norm.includes("codeium")) return "codeium.com";
  if (norm.includes("antigravity") || norm.includes("gemini") || norm.includes("google")) return "google.com";
  if (norm.includes("postgres")) return "postgresql.org";
  if (norm.includes("aws") || norm.includes("amazon") || norm.includes("s3")) return "aws.amazon.com";
  if (norm.includes("github")) return "github.com";
  if (norm.includes("slack")) return "slack.com";
  if (norm.includes("jira") || norm.includes("atlassian")) return "atlassian.com";
  if (norm.includes("docker")) return "docker.com";
  if (norm.includes("kubernetes") || norm.includes("k8s")) return "kubernetes.io";
  if (norm.includes("linear")) return "linear.app";
  if (norm.includes("notion")) return "notion.so";
  if (norm.includes("figma")) return "figma.com";
  if (norm.includes("sentry")) return "sentry.io";
  if (norm.includes("datadog")) return "datadoghq.com";
  if (norm.includes("snowflake")) return "snowflake.com";
  if (norm.includes("openai") || norm.includes("chatgpt")) return "openai.com";
  if (norm.includes("vscode") || norm.includes("visual studio")) return "code.visualstudio.com";
  return null;
};

export default function ClientBrandIcon({ name, size = "md", className = "" }: ClientBrandIconProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const norm = (name || "").toLowerCase();
  const domain = getDomainForBrand(name);

  const sizeClass = 
    size === "xs" ? "w-3.5 h-3.5" :
    size === "sm" ? "w-4 h-4" :
    size === "md" ? "w-5 h-5" :
    size === "lg" ? "w-6 h-6" : "w-8 h-8";

  // If Logo.dev has a domain and hasn't failed, use the official full-color high-res PNG
  if (domain && !loadFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`} 
        alt={`${name} logo`} 
        onError={() => setLoadFailed(true)}
        className={`${sizeClass} object-contain shrink-0 rounded-xs ${className}`} 
      />
    );
  }

  // Local Brand Fallbacks
  if (norm.includes("cursor")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/cursor-icon.png" alt="Cursor" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("claude")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/claude-icon.png" alt="Claude" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("antigravity") || norm.includes("gemini") || norm.includes("google")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/gemini-logo.svg" alt="Gemini" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("windsurf") || norm.includes("codeium")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/windsurf-icon.png" alt="Windsurf" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("postgres")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/postgres-icon.png" alt="PostgreSQL" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("aws") || norm.includes("s3") || norm.includes("amazon")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/aws-icon.png" alt="AWS" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }

  return <Server className={`${sizeClass} text-slate-500 shrink-0 ${className}`} />;
}

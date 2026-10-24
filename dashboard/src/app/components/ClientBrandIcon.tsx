"use client";

import React, { useState } from "react";
import { Cpu, Server, Database, Terminal, GitBranch, Folder, FileCode } from "lucide-react";

interface ClientBrandIconProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LOGO_DEV_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN || "pk_fdAoKVsxTvadheeQhynG5A";

export const getLogoDevUrl = (domain: string, size = 128) => {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}&format=png`;
};

export const getDomainForBrand = (name: string): string | null => {
  const norm = (name || "").toLowerCase().trim();
  if (!norm) return null;

  // Filter out internal and generic agent labels so they don't query arbitrary domains
  if (
    norm.includes("script") ||
    norm.includes("custom") ||
    norm.includes("shell") ||
    norm.includes("terminal") ||
    norm.includes("workspace") ||
    norm.includes("knowledge")
  ) {
    return null;
  }

  // Developer Agents & Platforms
  if (norm.includes("claude")) return "claude.ai";
  if (norm.includes("anthropic")) return "anthropic.com";
  if (norm.includes("cursor")) return "cursor.com";
  if (norm.includes("windsurf") || norm.includes("codeium")) return "codeium.com";
  if (norm.includes("antigravity")) return null; // Uses official local high-res Google Antigravity arch asset
  if (norm.includes("node")) return "nodejs.org";
  if (norm.includes("drive")) return "google.com";
  if (norm.includes("gemini") || norm.includes("google")) return "google.com";
  if (norm.includes("postgres") || norm.includes("pgsql")) return "postgresql.org";
  if (norm.includes("aws") || norm.includes("amazon") || norm.includes("s3")) return "aws.amazon.com";
  if (norm.includes("github")) return "github.com";
  if (norm.includes("gitlab")) return "gitlab.com";
  if (norm.includes("bitbucket")) return "bitbucket.org";
  if (norm.includes("slack")) return "slack.com";
  if (norm.includes("jira") || norm.includes("atlassian") || norm.includes("confluence")) return "atlassian.com";
  if (norm.includes("docker")) return "docker.com";
  if (norm.includes("kubernetes") || norm.includes("k8s")) return "kubernetes.io";
  if (norm.includes("linear")) return "linear.app";
  if (norm.includes("notion")) return "notion.so";
  if (norm.includes("figma")) return "figma.com";
  if (norm.includes("windows") || norm.includes("microsoft") || norm.includes("intune") || norm.includes("azure")) return "microsoft.com";
  if (norm.includes("macos") || norm.includes("apple") || norm.includes("darwin")) return "apple.com";
  if (norm.includes("jamf")) return "jamf.com";
  if (norm.includes("linux") || norm.includes("ubuntu")) return "ubuntu.com";
  if (norm.includes("sentry")) return "sentry.io";
  if (norm.includes("datadog")) return "datadoghq.com";
  if (norm.includes("splunk")) return "splunk.com";
  if (norm.includes("pagerduty")) return "pagerduty.com";
  if (norm.includes("opsgenie")) return "opsgenie.com";
  if (norm.includes("snowflake")) return "snowflake.com";
  if (norm.includes("openai") || norm.includes("chatgpt")) return "openai.com";
  if (norm.includes("vscode") || norm.includes("visual studio")) return "code.visualstudio.com";
  if (norm.includes("stripe")) return "stripe.com";
  if (norm.includes("supabase")) return "supabase.com";
  if (norm.includes("neon")) return "neon.tech";
  if (norm.includes("cloudflare")) return "cloudflare.com";
  if (norm.includes("mongodb") || norm.includes("mongo")) return "mongodb.com";
  if (norm.includes("redis")) return "redis.io";
  if (norm.includes("mysql")) return "mysql.com";
  if (norm.includes("elastic") || norm.includes("elasticsearch")) return "elastic.co";
  if (norm.includes("okta")) return "okta.com";
  if (norm.includes("auth0")) return "auth0.com";
  if (norm.includes("twilio")) return "twilio.com";
  if (norm.includes("huggingface") || norm.includes("hf")) return "huggingface.co";
  if (norm.includes("cohere")) return "cohere.com";
  if (norm.includes("pinecone")) return "pinecone.io";
  if (norm.includes("salesforce")) return "salesforce.com";
  if (norm.includes("hubspot")) return "hubspot.com";
  if (norm.includes("zendesk")) return "zendesk.com";
  if (norm.includes("zoom")) return "zoom.us";
  if (norm.includes("trello")) return "trello.com";
  if (norm.includes("asana")) return "asana.com";
  if (norm.includes("airtable")) return "airtable.com";
  if (norm.includes("vercel")) return "vercel.com";
  if (norm.includes("postman")) return "postman.com";
  if (norm.includes("hashicorp") || norm.includes("terraform") || norm.includes("vault")) return "hashicorp.com";

  // If the name is already a valid domain, use it directly
  if (norm.includes(".") && !norm.includes(" ")) {
    return norm;
  }

  return null;
};

export function ClientBrandIcon({ name, size = "md", className = "" }: ClientBrandIconProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const norm = (name || "").toLowerCase();
  const domain = getDomainForBrand(name);

  const sizeClass = 
    size === "xs" ? "w-4 h-4" :
    size === "sm" ? "w-5 h-5" :
    size === "md" ? "w-7 h-7" :
    size === "lg" ? "w-8 h-8" : "w-10 h-10";

  // Priority 1: Official Verified Local Full-Color Assets for Core Platforms & Ecosystem
  if (norm.includes("claude")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/claude-icon.svg" alt="Claude" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("cursor")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/cursor-icon.svg" alt="Cursor" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("windsurf") || norm.includes("codeium")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/windsurf-icon.svg" alt="Windsurf" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("antigravity")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/antigravity-icon.png" alt="Google Antigravity" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("node")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/nodejs-icon.svg" alt="Node.js" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("postgres") || norm.includes("pgsql")) {
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
  if (norm.includes("windows") || norm.includes("microsoft") || norm.includes("intune")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/microsoft-icon.png" alt="Microsoft" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("linux") || norm.includes("ubuntu")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/ubuntu-icon.png" alt="Ubuntu" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("macos") || norm.includes("apple") || norm.includes("darwin")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/apple-icon.png" alt="Apple" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("jamf")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/jamf-icon.png" alt="Jamf" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("drive")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/google-drive-icon.svg" alt="Google Drive" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("gemini") || norm.includes("google")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/gemini-logo.svg" alt="Gemini" className={`${sizeClass} object-contain shrink-0 ${className}`} />
    );
  }
  if (norm.includes("custom") || norm.includes("script") || norm.includes("mcp script")) {
    return <Terminal className={`${sizeClass} text-emerald-400 shrink-0 ${className}`} />;
  }
  if (norm.includes("shell") || norm.includes("bash") || norm.includes("zsh") || norm.includes("system shell")) {
    return <Terminal className={`${sizeClass} text-blue-400 shrink-0 ${className}`} />;
  }
  if (norm.includes("git")) {
    return <GitBranch className={`${sizeClass} text-orange-400 shrink-0 ${className}`} />;
  }
  if (norm.includes("workspace") || norm.includes("file")) {
    return <Folder className={`${sizeClass} text-yellow-400 shrink-0 ${className}`} />;
  }

  // Priority 2: Verified Logo.dev CDN Token for Secondary SaaS Services
  if (domain && !loadFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`} 
        alt={`${name} logo`} 
        onError={() => setLoadFailed(true)}
        className={`${sizeClass} object-contain shrink-0 ${className}`} 
      />
    );
  }

  return <Server className={`${sizeClass} text-slate-500 shrink-0 ${className}`} />;
}

export default ClientBrandIcon;

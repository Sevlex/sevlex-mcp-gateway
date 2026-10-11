"use client";

import { useState } from "react";
import { Server, Send, Check, Copy, Download, ShieldCheck, Terminal, Code2, Cpu, Laptop } from "lucide-react";

interface FleetMdmTabProps {
  apiKey: string;
  setPingStatus: (msg: string | null) => void;
  copiedType: string | null;
  setCopiedType: (type: string | null) => void;
}

export default function FleetMdmTab({ apiKey, setPingStatus, copiedType, setCopiedType }: FleetMdmTabProps) {
  const [copyingPlatform, setCopyingPlatform] = useState<string | null>(null);

  const handleCopyFullScript = async (platform: "windows" | "macos") => {
    setCopyingPlatform(platform);
    try {
      const res = await fetch(`/api/mdm-script?platform=${platform}`);
      if (res.ok) {
        const text = await res.text();
        await navigator.clipboard.writeText(text);
        setCopiedType(platform);
        setPingStatus(`📋 Copied full enterprise ${platform === 'windows' ? 'PowerShell (.ps1)' : 'Bash (.sh)'} script! Paste directly into Intune/Jamf.`);
      } else {
        // Fallback command if network fails
        const fallback = platform === "windows" 
          ? "irm https://raw.githubusercontent.com/meetpanchal-sevlex/sevlex-mcp-gateway/main/deploy/deploy-mdm.ps1 | iex" 
          : "curl -fsSL https://raw.githubusercontent.com/meetpanchal-sevlex/sevlex-mcp-gateway/main/deploy/deploy-mdm.sh | bash";
        await navigator.clipboard.writeText(fallback);
        setCopiedType(platform);
        setPingStatus(`📋 Copied silent bootstrap command for ${platform}`);
      }
    } catch {
      setPingStatus("❌ Could not copy script to clipboard");
    } finally {
      setCopyingPlatform(null);
      setTimeout(() => {
        setCopiedType(null);
        setPingStatus(null);
      }, 4000);
    }
  };

  const handleDownloadScript = (platform: "windows" | "macos") => {
    window.open(`/api/mdm-script?platform=${platform}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white">Enterprise Fleet Rollout (MDM)</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Universal 5-in-1 Shield
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Zero-Touch enterprise software distribution. Silently protect 50+ employee laptops via Microsoft Intune and Jamf Pro.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            50 Managed Hosts Target
          </span>
        </div>
      </div>

      {/* Universal Protected AI Engines Banner */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0d0d0d] shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-400" />
            Universal AI Tool Coverage (Pre-emptive Shadow AI Governance)
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">1 Script Configures All 5</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { name: "Claude Desktop", icon: Laptop, status: "Supported" },
            { name: "Claude Code CLI", icon: Terminal, status: "Supported" },
            { name: "Cursor IDE", icon: Code2, status: "Supported" },
            { name: "Windsurf IDE", icon: Cpu, status: "Supported" },
            { name: "Google Antigravity", icon: ShieldCheck, status: "Supported" },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#141416] border border-zinc-800/80">
                <IconComponent size={14} className="text-blue-400 flex-shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate">{item.name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">● Auto-Shielded</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Role Callout */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 text-xs text-blue-200 leading-relaxed flex items-start gap-3">
        <span className="text-base">💡</span>
        <div>
          <strong className="text-white block mb-0.5">Role of MDM in Sevlex:</strong>
          Microsoft Intune and Jamf Pro <span className="underline font-semibold text-blue-300">do not view or collect logs</span>. Their sole role is to remotely distribute and lock down the Sevlex gateway on company laptops over Wi-Fi so developers don&apos;t have to touch anything.
        </div>
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: MICROSOFT INTUNE (WINDOWS) */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Server size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Microsoft Intune (Windows)</h3>
                  <p className="text-xs text-zinc-400">PowerShell Universal Script (.ps1)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                WINDOWS MDM
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Deploys corporate policy to <code className="text-zinc-300 bg-zinc-800/80 px-1 py-0.5 rounded font-mono">C:\ProgramData\Sevlex</code> and automatically shields Claude Desktop, Claude Code, Cursor, Windsurf, and Antigravity.
            </p>

            <div className="bg-[#090909] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between mb-4">
              <span>Target: All Engineering Devices (50 Hosts)</span>
              <span className="text-emerald-400 font-semibold">Ready to Deploy</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <button 
              onClick={async () => {
                setPingStatus("Contacting Microsoft Graph API & queuing rollout...");
                try {
                  const res = await fetch("/api/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": apiKey },
                    body: JSON.stringify({ action: "deploy_intune", targetGroup: "All Engineering Laptops (50 Devices)" })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPingStatus("⚡ Pushed to Microsoft Intune! Silent rollout queued for 50 Windows laptops.");
                  } else {
                    setPingStatus("❌ Intune push failed: " + (data.error || "Unknown"));
                  }
                } catch {
                  setPingStatus("❌ Network error connecting to API");
                }
                setTimeout(() => setPingStatus(null), 4000);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-950"
            >
              <Send size={14} /> ⚡ 1-Click Push via API
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleCopyFullScript("windows")}
                disabled={copyingPlatform === "windows"}
                className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white font-medium bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/60 transition"
              >
                {copiedType === "windows" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copiedType === "windows" ? "Copied Script!" : "Copy Full .ps1 Script"}
              </button>

              <button
                onClick={() => handleDownloadScript("windows")}
                title="Download deploy-mdm.ps1"
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: JAMF PRO (MACOS & LINUX) */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Server size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Jamf Pro (macOS &amp; Linux)</h3>
                  <p className="text-xs text-zinc-400">Bash Universal Script (.sh)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                MACOS MDM
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Deploys corporate policy to <code className="text-zinc-300 bg-zinc-800/80 px-1 py-0.5 rounded font-mono">/etc/sevlex</code> and automatically shields employee MacBooks running Claude Desktop, Claude Code, Cursor, Windsurf, and Antigravity.
            </p>

            <div className="bg-[#090909] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between mb-4">
              <span>Target: macOS Engineering Fleet (50 Devices)</span>
              <span className="text-emerald-400 font-semibold">Ready to Deploy</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <button 
              onClick={async () => {
                setPingStatus("Contacting Jamf Pro API & deploying package...");
                try {
                  const res = await fetch("/api/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": apiKey },
                    body: JSON.stringify({ action: "deploy_jamf", targetGroup: "macOS Engineering Laptops (50 Devices)" })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPingStatus("⚡ Pushed to Jamf Pro! Silent rollout active across all enrolled MacBooks.");
                  } else {
                    setPingStatus("❌ Jamf push failed: " + (data.error || "Unknown"));
                  }
                } catch {
                  setPingStatus("❌ Network error connecting to API");
                }
                setTimeout(() => setPingStatus(null), 4000);
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              <Send size={14} /> ⚡ 1-Click Push via API
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleCopyFullScript("macos")}
                disabled={copyingPlatform === "macos"}
                className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white font-medium bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/60 transition"
              >
                {copiedType === "macos" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copiedType === "macos" ? "Copied Script!" : "Copy Full .sh Script"}
              </button>

              <button
                onClick={() => handleDownloadScript("macos")}
                title="Download deploy-mdm.sh"
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

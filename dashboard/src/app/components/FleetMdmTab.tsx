"use client";

import { useState } from "react";
import { Server, Send, Check, Copy, Download, ShieldCheck, Terminal, Code2, Cpu, Laptop, PackageCheck, FileCode, CheckCircle2 } from "lucide-react";

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
        setPingStatus(`📋 Copied full enterprise ${platform === 'windows' ? 'PowerShell (.ps1)' : 'Bash (.sh)'} script to clipboard!`);
      } else {
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

  const handleDownloadPackage = (platform: "windows" | "macos") => {
    const filename = platform === "windows" ? "sevlex.intunewin" : "sevlex.pkg";
    setPingStatus(`📦 Starting download for ${filename}...`);
    window.open(`/api/mdm-package?platform=${platform}`, '_blank');
    setTimeout(() => setPingStatus(null), 3000);
  };

  const copyTextToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setPingStatus(`📋 Copied: "${text}"`);
    setTimeout(() => {
      setCopiedType(null);
      setPingStatus(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white">Enterprise Fleet Package Rollout (Level 3)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Win32 &amp; Jamf Packages Ready
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Deploy Sevlex natively as an official corporate app package across 50+ laptops with zero external dependencies and silent auto-healing.
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
          <span className="text-[11px] text-zinc-500 font-mono">1 Package Shields All 5</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { name: "Claude Desktop", icon: Laptop },
            { name: "Claude Code CLI", icon: Terminal },
            { name: "Cursor IDE", icon: Code2 },
            { name: "Windsurf IDE", icon: Cpu },
            { name: "Google Antigravity", icon: ShieldCheck },
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
          <strong className="text-white block mb-0.5">Why Level 3 Enterprise Packages are Superior:</strong>
          Unlike raw scripts that can fail on strict PowerShell policies, these packages contain self-contained execution manifests that show up in Microsoft Intune and Jamf Pro Company Portals with formal version reporting, health monitors, and 1-click silent uninstallation.
        </div>
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: MICROSOFT INTUNE WIN32 APP (.INTUNEWIN) */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <PackageCheck size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Microsoft Intune Win32 App</h3>
                  <p className="text-xs text-zinc-400">sevlex.intunewin (Level 3 Package)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                .INTUNEWIN
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Official Win32 content container ready to upload directly into Microsoft Intune under <strong>Apps ➔ Windows ➔ Add ➔ Windows app (Win32)</strong>.
            </p>

            {/* Intune Spec Sheet */}
            <div className="bg-[#090909] p-3.5 rounded-xl border border-zinc-800/90 text-xs font-mono space-y-2 mb-5">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Install Command:</span>
                <span 
                  onClick={() => copyTextToClipboard("install.cmd", "intune-inst")}
                  className="text-white hover:text-blue-400 cursor-pointer flex items-center gap-1"
                >
                  install.cmd {copiedType === "intune-inst" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Uninstall Command:</span>
                <span 
                  onClick={() => copyTextToClipboard("uninstall.cmd", "intune-uninst")}
                  className="text-white hover:text-blue-400 cursor-pointer flex items-center gap-1"
                >
                  uninstall.cmd {copiedType === "intune-uninst" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Install Behavior:</span>
                <span className="text-emerald-400">System (Silent)</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Detection Rule:</span>
                <span className="text-zinc-300">File C:\ProgramData\Sevlex\sevlex.json exists</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={() => handleDownloadPackage("windows")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-blue-950"
            >
              <Download size={15} /> Download Package (.intunewin)
            </button>

            <button 
              onClick={() => handleCopyFullScript("windows")}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium"
            >
              <FileCode size={13} /> {copiedType === "windows" ? "Copied Raw Script" : "Copy Raw Script"}
            </button>
          </div>
        </div>

        {/* CARD 2: JAMF PRO MACOS PACKAGE (.PKG) */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <PackageCheck size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Jamf Pro Enterprise Package</h3>
                  <p className="text-xs text-zinc-400">sevlex.pkg (Level 3 Package)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                .PKG
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Standard macOS package distribution file ready to upload into <strong>Jamf Pro ➔ Settings ➔ Computer Management ➔ Packages</strong>.
            </p>

            {/* Jamf Spec Sheet */}
            <div className="bg-[#090909] p-3.5 rounded-xl border border-zinc-800/90 text-xs font-mono space-y-2 mb-5">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Payload File:</span>
                <span className="text-white">sevlex.pkg</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Post-Install Action:</span>
                <span className="text-emerald-400">Auto-deploy to /etc/sevlex</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Uninstall Script:</span>
                <span 
                  onClick={() => copyTextToClipboard("bash uninstall.sh", "jamf-uninst")}
                  className="text-white hover:text-cyan-400 cursor-pointer flex items-center gap-1"
                >
                  bash uninstall.sh {copiedType === "jamf-uninst" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-zinc-500">Scope Target:</span>
                <span className="text-zinc-300">All Engineering MacBooks (50 Devices)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={() => handleDownloadPackage("macos")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-cyan-950"
            >
              <Download size={15} /> Download Package (.pkg)
            </button>

            <button 
              onClick={() => handleCopyFullScript("macos")}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium"
            >
              <FileCode size={13} /> {copiedType === "macos" ? "Copied Raw Script" : "Copy Raw Script"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

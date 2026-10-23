"use client";

import { useState } from "react";
import { 
  Server, Check, Copy, Download, ShieldCheck, Terminal, 
  Code2, Cpu, Laptop, PackageCheck, FileCode, CheckCircle2, Sparkles 
} from "lucide-react";
import ClientBrandIcon from "./ClientBrandIcon";

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
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Fleet Package Rollout (Level 3)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
              Win32 &amp; Jamf Packages Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Deploy Sevlex natively as an official corporate app package across 50+ laptops with zero external dependencies and silent auto-healing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Enterprise Fleet Rollout
          </span>
        </div>
      </div>

      {/* Universal Protected AI Engines Banner */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0E0D17] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            Universal AI Tool Coverage (Pre-emptive Shadow AI Governance)
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">1 Package Shields All AI Clients</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: "Claude Desktop" },
            { name: "Claude Code CLI" },
            { name: "Cursor IDE" },
            { name: "Windsurf IDE" },
            { name: "Google Antigravity" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12111D] border border-white/[0.08] shadow-md hover:border-blue-500/40 transition">
              <ClientBrandIcon name={item.name} size="md" className="rounded-md shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                <p className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Auto-Shielded
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: MICROSOFT INTUNE WIN32 APP (.INTUNEWIN) */}
        <div className="bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="Microsoft Intune" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Microsoft Intune Win32 App</h3>
                  <p className="text-xs text-zinc-400 font-mono">sevlex.intunewin (Level 3 Package)</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
                .INTUNEWIN
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Official Win32 content container ready to upload directly into Microsoft Intune under <strong>Apps ➔ Windows ➔ Add ➔ Windows app (Win32)</strong>.
            </p>

            {/* Intune Spec Sheet */}
            <div className="bg-[#12111D] p-4 rounded-xl border border-white/[0.06] text-xs font-mono space-y-2.5 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Install Command:</span>
                <span 
                  onClick={() => copyTextToClipboard("install.cmd", "intune-inst")}
                  className="text-white hover:text-blue-400 cursor-pointer flex items-center gap-1 font-bold"
                >
                  install.cmd {copiedType === "intune-inst" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-zinc-500" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Uninstall Command:</span>
                <span 
                  onClick={() => copyTextToClipboard("uninstall.cmd", "intune-uninst")}
                  className="text-white hover:text-blue-400 cursor-pointer flex items-center gap-1 font-bold"
                >
                  uninstall.cmd {copiedType === "intune-uninst" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-zinc-500" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Install Behavior:</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">System (Silent)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Detection Rule:</span>
                <span className="text-zinc-200 text-[11px] truncate max-w-[200px]" title="File C:\ProgramData\Sevlex\sevlex.json exists">
                  File C:\ProgramData\Sevlex\sevlex.json exists
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={() => handleDownloadPackage("windows")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              <Download size={15} /> Download Package (.intunewin)
            </button>

            <button 
              onClick={() => handleCopyFullScript("windows")}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition cursor-pointer"
            >
              <FileCode size={13} /> {copiedType === "windows" ? "Copied Raw Script" : "Copy Raw Script"}
            </button>
          </div>
        </div>

        {/* CARD 2: JAMF PRO MACOS PACKAGE (.PKG) */}
        <div className="bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="Jamf" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Jamf Pro Enterprise Package</h3>
                  <p className="text-xs text-zinc-400 font-mono">sevlex.pkg (Level 3 Package)</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
                .PKG
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Standard macOS package distribution file ready to upload into <strong>Jamf Pro ➔ Settings ➔ Computer Management ➔ Packages</strong>.
            </p>

            {/* Jamf Spec Sheet */}
            <div className="bg-[#12111D] p-4 rounded-xl border border-white/[0.06] text-xs font-mono space-y-2.5 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Payload File:</span>
                <span className="text-white font-bold">sevlex.pkg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Post-Install Action:</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">Auto-deploy to /etc/sevlex</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Uninstall Script:</span>
                <span 
                  onClick={() => copyTextToClipboard("bash uninstall.sh", "jamf-uninst")}
                  className="text-white hover:text-blue-400 cursor-pointer flex items-center gap-1 font-bold"
                >
                  bash uninstall.sh {copiedType === "jamf-uninst" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-zinc-500" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Scope Target:</span>
                <span className="text-zinc-200 text-[11px]">All Engineering MacBooks</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={() => handleDownloadPackage("macos")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              <Download size={15} /> Download Package (.pkg)
            </button>

            <button 
              onClick={() => handleCopyFullScript("macos")}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition cursor-pointer"
            >
              <FileCode size={13} /> {copiedType === "macos" ? "Copied Raw Script" : "Copy Raw Script"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

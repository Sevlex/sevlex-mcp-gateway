"use client";

import { useState } from "react";
import { 
  Server, Check, Copy, Download, ShieldCheck, Terminal, 
  Code2, Cpu, Laptop, PackageCheck, FileCode, CheckCircle2, Sparkles 
} from "lucide-react";

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="text-[#632CA6]" size={22} />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Fleet Package Rollout (Level 3)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#632CA6] border border-purple-200 uppercase tracking-wider font-mono">
              Win32 &amp; Jamf Packages Ready
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Deploy Sevlex natively as an official corporate app package across 50+ laptops with zero external dependencies and silent auto-healing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            50 Managed Hosts Target
          </span>
        </div>
      </div>

      {/* Universal Protected AI Engines Banner */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-600" />
            Universal AI Tool Coverage (Pre-emptive Shadow AI Governance)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">1 Package Shields All 5</span>
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
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition">
                <IconComponent size={16} className="text-[#632CA6] flex-shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Auto-Shielded
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Role Callout */}
      <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 text-xs text-purple-900 leading-relaxed flex items-start gap-3">
        <Sparkles size={18} className="text-[#632CA6] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-bold block mb-0.5">Why Level 3 Enterprise Packages are Superior:</strong>
          Unlike raw scripts that can fail on strict PowerShell execution policies, these packages contain self-contained execution manifests that show up in Microsoft Intune and Jamf Pro Company Portals with formal version reporting, health monitors, and 1-click silent uninstallation.
        </div>
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: MICROSOFT INTUNE WIN32 APP (.INTUNEWIN) */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <PackageCheck size={20} className="text-[#632CA6]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Microsoft Intune Win32 App</h3>
                  <p className="text-xs text-slate-500 font-mono">sevlex.intunewin (Level 3 Package)</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#632CA6] border border-purple-200 uppercase tracking-wider font-mono">
                .INTUNEWIN
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Official Win32 content container ready to upload directly into Microsoft Intune under <strong>Apps ➔ Windows ➔ Add ➔ Windows app (Win32)</strong>.
            </p>

            {/* Intune Spec Sheet */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-2.5 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Install Command:</span>
                <span 
                  onClick={() => copyTextToClipboard("install.cmd", "intune-inst")}
                  className="text-slate-900 hover:text-[#632CA6] cursor-pointer flex items-center gap-1 font-bold"
                >
                  install.cmd {copiedType === "intune-inst" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-400" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Uninstall Command:</span>
                <span 
                  onClick={() => copyTextToClipboard("uninstall.cmd", "intune-uninst")}
                  className="text-slate-900 hover:text-[#632CA6] cursor-pointer flex items-center gap-1 font-bold"
                >
                  uninstall.cmd {copiedType === "intune-uninst" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-400" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Install Behavior:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">System (Silent)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Detection Rule:</span>
                <span className="text-slate-700 text-[11px] truncate max-w-[200px]" title="File C:\ProgramData\Sevlex\sevlex.json exists">
                  File C:\ProgramData\Sevlex\sevlex.json exists
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={() => handleDownloadPackage("windows")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#632CA6] hover:bg-[#52248a] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download size={15} /> Download Package (.intunewin)
            </button>

            <button 
              onClick={() => handleCopyFullScript("windows")}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition"
            >
              <FileCode size={13} /> {copiedType === "windows" ? "Copied Raw Script" : "Copy Raw Script"}
            </button>
          </div>
        </div>

        {/* CARD 2: JAMF PRO MACOS PACKAGE (.PKG) */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <PackageCheck size={20} className="text-[#632CA6]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Jamf Pro Enterprise Package</h3>
                  <p className="text-xs text-slate-500 font-mono">sevlex.pkg (Level 3 Package)</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#632CA6] border border-purple-200 uppercase tracking-wider font-mono">
                .PKG
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Standard macOS package distribution file ready to upload into <strong>Jamf Pro ➔ Settings ➔ Computer Management ➔ Packages</strong>.
            </p>

            {/* Jamf Spec Sheet */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-2.5 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payload File:</span>
                <span className="text-slate-900 font-bold">sevlex.pkg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Post-Install Action:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">Auto-deploy to /etc/sevlex</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Uninstall Script:</span>
                <span 
                  onClick={() => copyTextToClipboard("bash uninstall.sh", "jamf-uninst")}
                  className="text-slate-900 hover:text-[#632CA6] cursor-pointer flex items-center gap-1 font-bold"
                >
                  bash uninstall.sh {copiedType === "jamf-uninst" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-400" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Scope Target:</span>
                <span className="text-slate-700 text-[11px]">All Engineering MacBooks (50 Devices)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={() => handleDownloadPackage("macos")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Download size={15} /> Download Package (.pkg)
            </button>

            <button 
              onClick={() => handleCopyFullScript("macos")}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition"
            >
              <FileCode size={13} /> {copiedType === "macos" ? "Copied Raw Script" : "Copy Raw Script"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
